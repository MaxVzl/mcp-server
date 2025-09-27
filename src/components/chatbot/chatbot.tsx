"use client";

import { Button } from "../ui/button"
import { MessageCircleIcon, BotMessageSquareIcon, UserIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { sendMessageAction } from "@/app/[slug]/chat/chat.actions";
import ReactMarkdown from "react-markdown";

type Input = {
  role: "user" | "assistant" | "system" | "developer";
  content: string;
}

export const Chatbot = ({ slug }: { slug: string }) => {
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
    <div className="fixed bottom-4 right-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon"><MessageCircleIcon className="size-4" /></Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Chatbot</h4>
              <p className="text-muted-foreground text-sm">
                Chat with your project.
              </p>
            </div>
            <ScrollArea className="h-80">
              <div className="p-2 space-y-2">
                {input.map((inp, index) => (
                  <div key={index} className={`flex items-start gap-2 ${inp.role === "user" ? "flex-row-reverse" : ""}`}>
                    {inp.role === "assistant" && (
                      <div className="flex items-center justify-center p-1 bg-gray-200 size-8 rounded-full flex-shrink-0">
                        <BotMessageSquareIcon className="size-4" />
                      </div>
                    )}
                    <Card className={`p-1 ${inp.role === "user" ? "rounded-br-none" : "rounded-bl-none"}`}>
                      <CardContent className="p-1">
                        <div className="prose prose-sm max-w-none text-sm">
                          <ReactMarkdown>{inp.content}</ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Textarea placeholder="Type your message here." value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }} />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}