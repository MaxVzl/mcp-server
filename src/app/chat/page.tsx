import { Chat } from "./_components/chat";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen p-4 gap-4">
      <div>Chat</div>
      <Chat/>
    </div>
  );
}