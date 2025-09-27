import { getResources, getTools } from "@/lib/mcp";
import { Chat } from "./_components/chat";
import { Chatbot } from "@/components/chatbot/chatbot";

export default async function ChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const resources = await getResources(slug);
  const tools = await getTools(slug);

  return (
    <div className="flex">
      {/* <div className="flex flex-col h-screen p-4 gap-4 flex-1">
        <div>Chat</div>
        <Chat slug={slug}/>
      </div> */}
      <div className="flex flex-col h-screen p-4 gap-4 w-60">
        <div>Resources</div>
        <div>
          {resources.map((resource) => (
            <div key={resource.name}>{resource.name}</div>
          ))}
        </div>
        <div className="h-px bg-gray-200"></div>
        <div>Tools</div>
        <div>
          {tools.map((tool) => (
            <div key={tool.name}>{tool.name}</div>
          ))}
        </div>
      </div>
      <Chatbot slug={slug} />
    </div>
  );
}