import { createMcpHandler } from '@vercel/mcp-adapter';
import { z } from "zod";

const QuoteSchema = z.array(
  z.object({
    label: z.string(),
    htAmount: z.number(),
  })
);

const handler = createMcpHandler(
  async (server) => {
    server.tool(
      "quote_builder",
      "Prend un devis au format JSON et le renvoie validé.",
      {
        quote: QuoteSchema,
      },
      async ({ quote }) => {
        return {
          content: [{ type: "text", text: JSON.stringify(quote, null, 2) }],
        };
      }
    );
  },
  {},
  {
    basePath: `/api/test`,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
