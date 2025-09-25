import { loadResources, loadTools } from '@/lib/mcp';
import { projectExists } from '@/lib/projects';
import { createMcpHandler } from '@vercel/mcp-adapter';
import { NextRequest } from 'next/server';

const handler = async (request: NextRequest, { params }: { params: Promise<{ slug: string; transport: string }> }) => {
  const { slug } = await params;

  if (!projectExists(slug)) {
    return new Response('Project not found', { status: 404 });
  }
  
  return createMcpHandler(
    async (server) => {
      loadResources(server, slug);
      loadTools(server, slug);
    },
    {},
    {
      basePath: `/api/${slug}`,
    }
  )(request);
};

export { handler as GET, handler as POST, handler as DELETE };
