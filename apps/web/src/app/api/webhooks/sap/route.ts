import { NextResponse } from 'next/server';

/** SAP inbound webhook — stock/price updates */
export async function POST(request: Request) {
  // TODO: Validate SAP webhook, process idempotently
  return NextResponse.json({ received: true });
}
