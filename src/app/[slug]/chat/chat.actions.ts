"use server";

import OpenAI from "openai";
import { callTool, getResources, getTools, readResource } from "@/lib/mcp";

type Input = {
  role: "user" | "assistant" | "system" | "developer";
  content: string;
}

export async function sendMessageAction(message: string, oldInput: Input[], slug: string): Promise<Input[]> {
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

        const result = await callTool(slug, toolName, toolArgs);

        messages.push({
          role: "system",
          content: typeof result === 'string' ? result : JSON.stringify(result)
        });
      }
    }

    continueLoop = hasFunctionCall;
  }

  return finalMessages;
}