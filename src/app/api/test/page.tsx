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
import { TableCell, TableFooter, Table } from "@/components/ui/table";
import { TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Input = {
  role: "user" | "assistant" | "system" | "developer";
  content: string;
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

interface QuoteItem {
  label: string;
  qty: number;
  amount: number;
}

export default function TestPage() {
  // const [quote, setQuote] = useState<Quote>({
  //   label: "LOGO HERE",
  //   number: "#000000",
  //   company: "SCR Informatiques",
  //   address: "123 Rue de la Paix, 75000 Paris",
  //   dateIssued: "00/00/0000",
  //   payTerms: "00/00/0000",
  //   items: [
  //     { label: "ordinateur", qty: 1, amount: 1500 },
  //     { label: "souris", qty: 1, amount: 100 },
  //     { label: "clavier", qty: 1, amount: 200 }
  //   ],
  //   notes: "Payment to be made within 30 days",
  //   backgroundColor: "#1E90FF",
  //   textColor: "#FFFFFF"
  // });
  const [quote, setQuote] = useState<Quote>();
  const [messages, setMessages] = useState<Input[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleGenerateQuote = async () => {
    if (!message.trim()) return;
    setLoading(true);

    type ServerResponse = { quote: Quote; message: string };

    const userMessage: Input = { role: "user", content: message };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setMessage("");

    try {
      const response = (await generateQuote(
        userMessage,
        updatedMessages,
        quote as Quote
      )) as ServerResponse;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.message },
      ]);

      setQuote(response.quote);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Une erreur est survenue lors de la génération du devis." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2 p-4">
      {quote && (
        <div className="flex flex-col gap-10 w-full">
          <div className="flex justify-between items-start">
            <span className="text-2xl font-bold" style={{color: quote.backgroundColor}}>{quote.label}</span>
            <div className="flex flex-col items-end gap-2">
              <span className="text-muted-foreground">N° du devis</span>
              <span className="font-semibold" style={{color: quote.backgroundColor}}>{quote.number}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Résumé</span>
            <Separator className="flex-1"/>
          </div>
          <div className="grid grid-cols-3">
            <div className="flex flex-col items-start gap-2">
              <span className="font-semibold">Nom de l'entreprise</span>
              <span className="text-muted-foreground">Adresse</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="font-semibold">{quote.company}</span>
              <span className="text-muted-foreground">{quote.address}</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="text-muted-foreground">Date de délivrance : {quote.dateIssued}</span>
              <span className="text-muted-foreground">Délai de paiement : {quote.payTerms}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Table className="border-1">
              <TableHeader style={{backgroundColor: quote.backgroundColor}}>
                <TableRow>
                  <TableHead className="w-5/6" style={{color: quote.textColor}}>Article</TableHead>
                  <TableHead className="text-right" style={{color: quote.textColor}}>Qte</TableHead>
                  <TableHead className="text-right" style={{color: quote.textColor}}>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quote.items.map((quoteItem, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{quoteItem.label}</TableCell>
                    <TableCell className="text-right">{quoteItem.qty}</TableCell>
                    <TableCell className="text-right">{quoteItem.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end">
              <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                <span className="text-muted-foreground text-right">Sous total</span>
                <span className="font-semibold text-right">{quote.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)} €</span>
                <span className="text-muted-foreground text-right">Tax</span>
                <span className="font-semibold text-right">0 €</span>
              </div>
            </div>
            <Separator/>
            <div className="flex justify-end">
              <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                <span className="font-semibold text-right">Sous total</span>
                <span className="font-semibold text-right" style={{color: quote.backgroundColor}}>{quote.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)} €</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-muted p-4">
            <span className="font-extralight text-muted-foreground">Notes</span>
            <span>{quote.notes}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 w-[400px]">
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