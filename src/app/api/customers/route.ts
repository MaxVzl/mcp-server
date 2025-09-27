import { NextRequest, NextResponse } from "next/server";
import { createCustomer, getCustomers } from "@/data-access/customers";

export async function GET() {
  return NextResponse.json(await getCustomers());
}

export async function POST(request: NextRequest) {
  return NextResponse.json(await createCustomer(await request.json()));
}