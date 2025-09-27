import { NextRequest, NextResponse } from "next/server";
import { createQuote, getQuotes } from "@/data-access/quotes";

export async function GET() {
  return NextResponse.json(await getQuotes());
}

export async function POST(request: NextRequest) {
  return NextResponse.json(await createQuote(await request.json()));
}