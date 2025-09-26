"use client";

import { sendMessageAction } from "@/app/chat/chat.actions";
import { useState } from "react";

export const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello, how are you?",
      role: "assistant",
    },
  ]);

  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    setMessage("");
    messages.push({
      id: messages.length + 1,
      content: message,
      role: "user",
    });
    const updatedMessages = [...messages];
    setMessages(updatedMessages);
    const response = await sendMessageAction(
      message,
      updatedMessages.map((message) => message.content)
    );
    updatedMessages.push({
      id: updatedMessages.length + 1,
      content: response,
      role: "assistant",
    });
    setMessages([...updatedMessages]);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-2">
            <div>{message.role}</div>
            <div>{":"}</div>
            <div>{message.content}</div>
          </div>
        ))}
      </div>
      <textarea className="w-full border-2 border-gray-300 rounded-md p-2" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button className="bg-blue-500 text-white rounded-md p-2" onClick={handleSendMessage}>Send</button>
    </div>
  )
}