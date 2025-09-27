import prisma from "@/lib/prisma";

export async function getQuotes() {
  return prisma.quote.findMany();
}

export async function getQuoteById(id: string) {
  return prisma.quote.findUnique({
    where: {
      id
    }
  });
}

type CreateQuote = {
  amount: number
  customerId: string
}

export async function createQuote(quote: CreateQuote) {
  return prisma.quote.create({
    data: quote
  });
}

type UpdateQuote = {
  amount?: number
  customerId?: string
}

export async function updateQuote(id: string, quote: UpdateQuote) {
  return prisma.quote.update({
    where: { id },
    data: quote
  });
}

export async function deleteQuote(id: string) {
  return prisma.quote.delete({
    where: { id }
  });
}