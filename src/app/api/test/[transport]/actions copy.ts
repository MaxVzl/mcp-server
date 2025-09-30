"use server";

import OpenAI from "openai";


type Input = {
  role: "user" | "assistant" | "system" | "developer";
  content: string;
}

interface QuoteItem {
  label: string;
  htAmount: number;
}

export async function generateQuote(message: Input, oldMessages: Input[], quote: QuoteItem[]) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await client.responses.create({
    model: 'gpt-4o',
    instructions: JSON.stringify({
      messages: oldMessages,
      quote: quote
    }),
    input: [message],
    text: {
      format: {
        type: "json_schema",
        name: "quote",
        schema: {
          type: "object",
          properties: {
            quote: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: { type: "string" },
                  htAmount: { type: "number" },
                },
                required: ["label", "htAmount"],
                additionalProperties: false,
              },
            },
            message: { type: "string", description: "Le message de l'assistant" },
          },
          required: ["quote", "message"],
          additionalProperties: false,
        }
      }
    }
  });

  const jsonResponse = JSON.parse(response.output_text);

  console.log(jsonResponse);

  return {
    quote: jsonResponse.quote,
    message: jsonResponse.message
  };
}
