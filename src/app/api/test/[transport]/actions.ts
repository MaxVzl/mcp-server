"use server";

import OpenAI from "openai";


type Input = {
  role: "user" | "assistant" | "system" | "developer";
  content: string;
}

interface QuoteItem {
  label: string;
  qty: number;
  amount: number;
}

interface Quote {
  label: string;
  number: string;
  company: string;
  address: string;
  dateIssued: string;
  payTerms: string;
  items: QuoteItem[];
  notes: string;
  backgroundColor: string;
  textColor: string;
}

export async function generateQuote(message: Input, oldMessages: Input[], quote: Quote) {
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
              type: "object",
              properties: {
                label: { type: "string" },
                number: { type: "string" },
                company: { type: "string" },
                address: { type: "string" },
                dateIssued: { type: "string" },
                payTerms: { type: "string" },
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      label: { type: "string" },
                      qty: { type: "number" },
                      amount: { type: "number" },
                    },
                    required: ["label", "qty", "amount"],
                    additionalProperties: false,
                  },
                },
                notes: { type: "string" },
                backgroundColor: { type: "string" },
                textColor: { type: "string" },
              },
              required: [
                "label",
                "number",
                "company",
                "address",
                "dateIssued",
                "payTerms",
                "items",
                "notes",
                "backgroundColor",
                "textColor",
              ],
              additionalProperties: false,
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
