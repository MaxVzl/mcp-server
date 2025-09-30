"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { BotMessageSquareIcon, ChevronDownIcon, ChevronUpIcon, SparkleIcon, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { generateQuote } from "./[transport]/actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { components } from "../../../../mdx-components";

type Input = {
  role: "user" | "assistant" | "system" | "developer";
  content: string;
}

interface QuoteItem {
  label: string;
  htAmount: number;
}

export default function TestPage() {
  const [quoteName, setQuoteName] = useState("");
  const [quote, setQuote] = useState<QuoteItem[]>([ { "label": "ordinateur", "htAmount": 1500 }, { "label": "souris", "htAmount": 100}, { "label": "clavier", "htAmount": 200} ]);
  const totalHt = quote.reduce((sum, item) => sum + (Number(item.htAmount) || 0), 0);
  const [messages, setMessages] = useState<Input[]>([]);
  const [message, setMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuote = async () => {
    if (!message.trim()) return; // Ne rien faire si le message est vide
    setLoading(true);

    // On prépare le message utilisateur avec le bon type
    const userMessage: Input = { role: "user", content: message };

    // On prépare la liste des messages à jour pour l'appel
    const updatedMessages = [...messages, userMessage];

    // Ajoute le message utilisateur à l'affichage
    setMessages(updatedMessages);
    setMessage("");

    try {
      const response = await generateQuote(
        userMessage,
        updatedMessages,
        quote
      );

      // Ajoute la réponse de l'assistant à la suite
      setMessages(prevMessages => [
        ...prevMessages,
        { role: "assistant", content: response.message } as Input
      ]);
      setQuote(response.quote);
    } catch (error) {
      setMessages(prevMessages => [
        ...prevMessages,
        { role: "assistant", content: "❌ Une erreur est survenue lors de la génération du devis." } as Input
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex gap-2 p-4">
      <div className="gap-2 flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <div>Nom du devis</div>
          <Input type="text" value={quoteName} onChange={(e) => setQuoteName(e.target.value)} className="w-40" />
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          {quote.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div>Nom du produit</div>
              <Input
                type="text"
                value={item.label}
                onChange={(e) =>
                  setQuote(quote.map((q, i) => (i === index ? { ...q, label: e.target.value } : q)))
                }
                className="w-40"
              />
              <div>Prix HT</div>
              <Input
                type="number"
                value={item.htAmount}
                onChange={(e) =>
                  setQuote(quote.map((q, i) => (i === index ? { ...q, htAmount: Number(e.target.value) } : q)))
                }
                className="w-40"
              />
              <Button
                variant="outline"
                onClick={() =>
                  setQuote((prev) => {
                    if (index <= 0) return prev;
                    const copy = [...prev];
                    const [moved] = copy.splice(index, 1);
                    copy.splice(index - 1, 0, moved);
                    return copy;
                  })
                }
              >
                <ChevronUpIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setQuote((prev) => {
                    if (index >= prev.length - 1) return prev;
                    const copy = [...prev];
                    const [moved] = copy.splice(index, 1);
                    copy.splice(index + 1, 0, moved);
                    return copy;
                  })
                }
              >
                <ChevronDownIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setQuote(quote.filter((_, i) => i !== index))}
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2 justify-end mt-2">
            <div className="font-medium">Total HT</div>
            <div className="w-40 text-right font-semibold">{totalHt.toFixed(2)} €</div>
          </div>
        </div>
        <Separator />
        <Button variant="outline" onClick={() => setQuote([...quote, { label: "", htAmount: 0 }])}>Ajouter un produit</Button>
      </div>
      <div className="flex flex-col gap-2 w-[400px]">
        {/* <div className="flex flex-col gap-2">
          {messages.map((message, index) => (
            <div key={index} className="flex gap-2">
              <div className="font-semibold">{message.role}:</div>
              <div className="prose prose-sm max-w-none">{message.content}</div>
            </div>
          ))}
        </div> */}
        <ScrollArea className="max-h-80" ref={scrollAreaRef}>
          <div className="p-2 space-y-2">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                {message.role === "assistant" && (
                  <div className="flex items-center justify-center p-1 bg-gray-200 size-8 rounded-full flex-shrink-0">
                    <BotMessageSquareIcon className="size-4" />
                  </div>
                )}
                  <Card className={`p-1 ${message.role === "user" ? "rounded-br-none" : "rounded-bl-none"}`}>
                    <CardContent className="p-1">
                      <div className="prose prose-sm max-w-none text-sm ">
                        <ReactMarkdown components={components}>{message.content}</ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Separator />
        <Textarea
          placeholder="Décrivez votre demande pour générer un devis..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleGenerateQuote();
            }
          }}
        />
        <Button onClick={handleGenerateQuote} disabled={loading}>
          <SparkleIcon className="size-4" />
          Générer le devis
        </Button>
      </div>
    </div>
  );
}