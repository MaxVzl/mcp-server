"use client";

import { Button } from "../ui/button"
import { MessageCircleIcon, BotMessageSquareIcon, UserIcon, XIcon, SendIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import React, { useState, useRef, useEffect } from "react";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { sendMessageAction, confirmFunctionCallsAction } from "@/app/[slug]/chat/chat.actions";
import ReactMarkdown from "react-markdown";
import { components } from "../../../mdx-components";

type Input = {
  role: "user" | "assistant" | "system" | "developer";
  content: string;
}

type FunctionCall = {
  name: string;
  arguments: any;
  description?: string;
}

export const Chatbot = ({ slug }: { slug: string }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState<Input[]>([
    {
      role: "assistant",
      content: "Bonjour, je suis un assistant de chat qui peut vous aider à trouver des informations et à utiliser les outils disponibles. Comment puis-je vous aider ?",
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingFunctionCalls, setPendingFunctionCalls] = useState<FunctionCall[] | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [input]);

  const handleSendMessage = async () => {
    setLoading(true);
    const currentMessage = message;
    setMessage("");
    
    const updatedInput: Input[] = [
      ...input,
      {
        role: "user" as const,
        content: currentMessage,
      }
    ];
    setInput(updatedInput);

    try {
      let response: Input[];
      
      if (pendingFunctionCalls) {
        // Si on a des function calls en attente, on les confirme
        response = await confirmFunctionCallsAction(currentMessage, updatedInput, slug, pendingFunctionCalls);
        setPendingFunctionCalls(null);
      } else {
        // Sinon, on envoie le message normalement
        response = await sendMessageAction(currentMessage, updatedInput, slug);
      }

      // Vérifier si la réponse contient des function calls en attente
      const lastMessage = response[response.length - 1];
      if (lastMessage?.role === "system" && lastMessage.content.startsWith("PENDING_FUNCTION_CALLS:")) {
        const functionCallsData = lastMessage.content.replace("PENDING_FUNCTION_CALLS:", "");
        const functionCalls = JSON.parse(functionCallsData) as FunctionCall[];
        setPendingFunctionCalls(functionCalls);
        // Retirer le message système de l'affichage
        response = response.slice(0, -1);
      }

      setInput(prev => [...prev, ...response]);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setInput(prev => [...prev, {
        role: "assistant",
        content: "❌ Une erreur s'est produite. Veuillez réessayer."
      }]);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="fixed bottom-4 right-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button size="icon">
            {open ? <XIcon className="size-4" /> : <MessageCircleIcon className="size-4" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Chatbot</h4>
              <p className="text-muted-foreground text-sm">
                Chat with your project.
              </p>
            </div>
            <ScrollArea className="h-80" ref={scrollAreaRef}>
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
                         <div className="prose prose-sm max-w-none text-sm ">
                           <ReactMarkdown components={components}>{inp.content}</ReactMarkdown>
                         </div>
                       </CardContent>
                     </Card>
                  </div>
                ))}
              </div>
            </ScrollArea>
            {pendingFunctionCalls && (
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800 font-medium">
                  ⏳ Actions en attente de confirmation
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Répondez "oui" pour confirmer ou "non" pour annuler
                </p>
              </div>
            )}
            <Textarea 
              placeholder={pendingFunctionCalls ? "Confirmez les actions (oui/non)..." : "Type your message here."} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}