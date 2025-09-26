"use server";

import OpenAI from "openai";
import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export async function sendMessageAction(message: string, oldMessages: string[]) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  // const mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });

  // const transport = new StreamableHTTPClientTransport(
  //   new URL("http://localhost:3000/api/faktu/mcp")
  // );

  // await mcp.connect(transport);

  // const toolsResult = await mcp.listTools();
  // const tools = toolsResult.tools.map((tool) => {
  //   return {
  //     name: tool.name,
  //     description: tool.description,
  //     input_schema: tool.inputSchema,
  //   };
  // });

  // const input_list = [
  //   {"role": "user", "content": "What is my horoscope? I am an Aquarius."}
  // ]

  const response = await client.responses.create({
    model: 'gpt-4o',
    // instructions: "You are a coding assistant that talks like a pirate",
    instructions: oldMessages.join("\n"),
    input: message,
    tools: [
      {
        "type": "mcp",
        "server_label": "faktu",
        "server_description": "A Faktu MCP server to assist with Faktu.",
        // "server_url": "http://localhost:3000/api/faktu/mcp",
        "server_url": "https://mcp-server-peach-xi.vercel.app/api/faktu/mcp",
        "require_approval": "never",
      }
    ]
  });

  console.log("response", response);
  
  return response.output_text;
}