import { Action, getActionsFile, getMarkdownContent, getProjectDocs } from "./projects";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";

export async function loadResources(server: McpServer, slug: string) {
  const docs = getProjectDocs(slug);
  docs?.forEach((doc) => {
    server.resource(
      doc,
      `file:///${doc}`,
      async (uri) => {
        return {
          contents: [{
            uri: uri.href,
            text: getMarkdownContent(slug, doc) || "",
            mimeType: "text/markdown"
          }]
        };
      }
    );
  });
}

export async function loadTools(server: McpServer, slug: string) {
  const actions = getActionsFile(slug);
  actions?.forEach((action: Action) => {
    // Convertir les paramètres JSON en schéma Zod
    const zodSchema = action.parameters ? 
      Object.keys(action.parameters).reduce((acc, key) => {
        const param = action.parameters[key];
        if (param.type === 'string') {
          acc[key] = z.string().describe(param.description || '');
        } else if (param.type === 'number') {
          acc[key] = z.number().describe(param.description || '');
        } else if (param.type === 'boolean') {
          acc[key] = z.boolean().describe(param.description || '');
        } else if (param.type === 'object') {
          acc[key] = z.object(param.properties || {}).describe(param.description || '');
        } else if (param.type === 'array') {
          acc[key] = z.array(z.any()).describe(param.description || '');
        } else {
          // Type par défaut si non reconnu
          acc[key] = z.any().describe(param.description || '');
        }
        return acc;
      }, {} as Record<string, z.ZodTypeAny>) : {};

    server.tool(
      action.label,
      action.description,
      zodSchema,
      async (args, extra) => {
        console.log("args", args);
        
        // Si l'action a une URL et une méthode, faire l'appel API
        if (action.url && action.method) {
          try {
            let apiUrl = action.url;
            
            // Remplacer les paramètres d'URL (:id, :userId, etc.)
            Object.keys(args).forEach(key => {
              const param = action.parameters[key];
              if (param?.in === 'path' && apiUrl.includes(`:${key}`)) {
                apiUrl = apiUrl.replace(`:${key}`, String(args[key]));
              }
            });
            
            // Construire l'URL avec les paramètres de query pour GET
            if (action.method === 'GET') {
              const urlParams = new URLSearchParams();
              Object.keys(args).forEach(key => {
                const param = action.parameters[key];
                if (param?.in !== 'path') { // Seulement les paramètres non-path
                  urlParams.append(key, String(args[key]));
                }
              });
              if (urlParams.toString()) {
                apiUrl += `?${urlParams.toString()}`;
              }
            }
            
            console.log(`Making ${action.method} request to: ${apiUrl}`);
            
            const response = await fetch(apiUrl, {
              method: action.method,
              headers: {
                'Content-Type': 'application/json',
              },
              ...(action.method !== 'GET' && { body: JSON.stringify(args) })
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("API response:", data);
            
            return { 
              content: [{ 
                type: 'text' as const, 
                text: JSON.stringify(data, null, 2) 
              }] 
            };
          } catch (error) {
            console.error("API call failed:", error);
            return { 
              content: [{ 
                type: 'text' as const, 
                text: `Error calling API: ${error instanceof Error ? error.message : 'Unknown error'}` 
              }] 
            };
          }
        } else {
          // Fallback pour les actions sans URL
          return { content: [{ type: 'text' as const, text: `Action ${action.label} executed` }] };
        }
      }
    );
  });
}