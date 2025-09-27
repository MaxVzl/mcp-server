"use server";

import OpenAI from "openai";
import { callTool, getResources, getTools, readResource } from "@/lib/mcp";

type Input = {
  role: "user" | "assistant" | "system" | "developer";
  content: string;
}

type FunctionCall = {
  name: string;
  arguments: any;
  description?: string;
}

export async function sendMessageAction(message: string, oldInput: Input[], slug: string, confirmedFunctionCalls?: FunctionCall[]): Promise<Input[]> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const resources = await getResources(slug);

  const resourcesContent = await Promise.all(
    resources.map(resource => readResource(slug, resource.uri))
  );

  const instructions = JSON.stringify({
    resources: resourcesContent,
    messages: oldInput
  });

  const messages: Input[] = [{
    role: "user",
    content: message
  }]

  const tools = (await getTools(slug)).map((tool) => ({
    type: "function" as const,
    name: tool.name,
    parameters: tool.inputSchema,
    strict: true,
  }));

  const finalMessages: Input[] = [];
  
  let continueLoop = true;

  while (continueLoop) {
    const response = await client.responses.create({
      model: 'gpt-4o',
      instructions: instructions,
      input: messages,
      tools: tools,
      tool_choice: "auto"
    });

    console.log(response.output);

    let hasFunctionCall = false;
    const pendingFunctionCalls: FunctionCall[] = [];

    for (const output of response.output) {
      if (output.type === "message") {
        finalMessages.push({
          role: "assistant",
          content: output.content.map(c => c.type === "output_text" ? c.text : '').join('')
        });

        messages.push({
          role: "assistant",
          content: output.content.map(c => c.type === "output_text" ? c.text : '').join('')
        });
      } else if (output.type === "function_call") {
        hasFunctionCall = true;

        const toolName = output.name;
        const toolArgs = typeof output.arguments === 'string' ? JSON.parse(output.arguments) : output.arguments;

        pendingFunctionCalls.push({
          name: toolName,
          arguments: toolArgs
        });
      }
    }

    // Si on a des function calls en attente et qu'on n'a pas encore de confirmation
    if (hasFunctionCall && !confirmedFunctionCalls) {
      // Créer un récapitulatif des actions prévues
      const summary = pendingFunctionCalls.map((fc, index) => 
        `${index + 1}. **${fc.name}** avec les paramètres: ${JSON.stringify(fc.arguments, null, 2)}`
      ).join('\n\n');

      const confirmationMessage = `🤖 **Actions prévues**\n\nJe vais exécuter les actions suivantes :\n\n${summary}\n\nVoulez-vous que je procède à l'exécution de ces actions ?`;

      finalMessages.push({
        role: "assistant",
        content: confirmationMessage
      });

      // Retourner les messages avec les function calls en attente
      return [...finalMessages, {
        role: "system",
        content: `PENDING_FUNCTION_CALLS:${JSON.stringify(pendingFunctionCalls)}`
      }];
    }

    // Si on a des function calls confirmées, les exécuter
    if (confirmedFunctionCalls && confirmedFunctionCalls.length > 0) {
      for (const functionCall of confirmedFunctionCalls) {
        const result = await callTool(slug, functionCall.name, functionCall.arguments);

        messages.push({
          role: "system",
          content: typeof result === 'string' ? result : JSON.stringify(result)
        });
      }
      
      // Réinitialiser les function calls confirmées pour la prochaine itération
      confirmedFunctionCalls = undefined;
    }

    continueLoop = hasFunctionCall;
  }

  return finalMessages;
}

export async function confirmFunctionCallsAction(
  message: string, 
  oldInput: Input[], 
  slug: string, 
  pendingFunctionCalls: FunctionCall[]
): Promise<Input[]> {
  // Si l'utilisateur confirme (oui, oui, confirm, go, etc.)
  const confirmationKeywords = ['oui', 'yes', 'confirm', 'go', 'ok', 'okay', 'valider', 'exécuter'];
  const isConfirmed = confirmationKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );

  if (isConfirmed) {
    // Exécuter les function calls confirmées
    return await sendMessageAction(message, oldInput, slug, pendingFunctionCalls);
  } else {
    // L'utilisateur a refusé ou donné une réponse ambiguë
    return [...oldInput, {
      role: "assistant",
      content: "❌ Exécution annulée. Les actions n'ont pas été exécutées. Vous pouvez reformuler votre demande si nécessaire."
    }];
  }
}