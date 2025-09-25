import { NextRequest, NextResponse } from "next/server";
import { getAllQuotes, addQuote } from "@/data/quotes";

export async function GET() {
  return NextResponse.json(getAllQuotes());
}

export async function POST(request: NextRequest) {
  const { customer, amount } = await request.json();
  const quote = { customer, amount };
  const newQuote = addQuote(quote);
  return NextResponse.json(newQuote);
}