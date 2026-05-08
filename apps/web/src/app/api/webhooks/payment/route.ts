import { NextResponse } from 'next/server';

/** Payment webhook — idempotent processing */
export async function POST(request: Request) {
  // TODO: Validate signature, parse payload, process idempotently
  return NextResponse.json({ received: true });
}
