import { createId } from '@paralleldrive/cuid2';

/**
 * Generate a CUID2 identifier.
 * Used for external references and idempotency keys.
 */
export function generateId(): string {
  return createId();
}

/** Generate an order external reference (human-readable) */
export function generateOrderReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}
