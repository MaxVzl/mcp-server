import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
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
        const param = action.parameters![key];
        if (param.type === 'string') {
          acc[key] = z.string().describe(param.description || '');
        } else if (param.type === 'number') {
          acc[key] = z.number().describe(param.description || '');
        } else if (param.type === 'boolean') {
          acc[key] = z.boolean().describe(param.description || '');
        } else if (param.type === 'object') {
          acc[key] = z.record(z.any()).describe(param.description || '');
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
      async (args) => {        
        // Si l'action a une URL et une méthode, faire l'appel API
        if (action.url && action.method) {
          try {
            let apiUrl = action.url;
            
            // Remplacer les paramètres d'URL (:id, :userId, etc.)
            Object.keys(args).forEach(key => {
              const param = action.parameters![key];
              if (param?.in === 'path' && apiUrl.includes(`:${key}`)) {
                apiUrl = apiUrl.replace(`:${key}`, String(args[key]));
              }
            });
            
            // Construire l'URL avec les paramètres de query pour GET
            if (action.method === 'GET') {
              const urlParams = new URLSearchParams();
              Object.keys(args).forEach(key => {
                const param = action.parameters![key];
                if (param?.in !== 'path') { // Seulement les paramètres non-path
                  urlParams.append(key, String(args[key]));
                }
              });
              if (urlParams.toString()) {
                apiUrl += `?${urlParams.toString()}`;
              }
            }
                        
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
            
            return { 
              content: [
                {
                  type: "text",
                  text: "Tool executed successfully. Result:",
                },
                { 
                  type: "text", 
                  text: JSON.stringify(data) 
                }
              ]
            };
            } catch (error) {
              console.error("API call failed:", error);
              return { 
                content: [{ 
                  type: 'text' as const, 
                  text: `Tool execution failed. Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
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

export async function getMcpClient(slug: string) {
  const mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });

  const transport = new StreamableHTTPClientTransport(
    new URL(`http://localhost:3000/api/${slug}/mcp`)
  );

  await mcp.connect(transport);

  return mcp;
}

export async function getResources(slug: string) {
  const mcp = await getMcpClient(slug);
  const listResources = await mcp.listResources();

  return listResources.resources;
}

export async function readResource(slug: string, uri: string) {
  const mcp = await getMcpClient(slug);
  const resource = await mcp.readResource({ uri: uri });

  return resource.contents[0]?.text || '';
}

export async function getTools(slug: string) {
  const mcp = await getMcpClient(slug);
  const listTools = await mcp.listTools();

  return listTools.tools;
}

export async function callTool(slug: string, toolName: string, args: any) {
  const mcp = await getMcpClient(slug);
  const tool = await mcp.callTool({ name: toolName, arguments: args });

  return tool.content;
}