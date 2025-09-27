"use client";

import { sendMessageAction } from "@/app/[slug]/chat/chat.actions";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

type Input = {
  role: "user" | "assistant" | "system" | "developer";
  content: string;
}

export const Chat = ({ slug }: { slug: string }) => {
  const [input, setInput] = useState<Input[]>([
    {
      role: "assistant",
      content: "Bonjour, je suis un assistant de chat qui peut vous aider à trouver des informations et à utiliser les outils disponibles. Comment puis-je vous aider ?",
    }
  ]);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    setLoading(true);
    setMessage("");
    const updatedInput: Input[] = [
      ...input,
      {
        role: "user" as const,
        content: message,
      }
    ];
    setInput(updatedInput);
    const response = await sendMessageAction(message, updatedInput, slug);
    setInput(prev => [...prev, ...response]);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        {input.map((inp, index) => (
          <div key={index} className="flex gap-2">
            <div className="font-semibold">{inp.role}:</div>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{inp.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="font-semibold">assistant:</div>
            <div className="prose prose-sm max-w-none">
              ...
            </div>
          </div>
        )}
      </div>
      <textarea className="w-full border-2 border-gray-300 rounded-md p-2" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button className={`bg-blue-500 text-white rounded-md p-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`} onClick={handleSendMessage} disabled={loading}>Send</button>
    </div>
  )
}