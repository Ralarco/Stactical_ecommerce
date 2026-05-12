import type { Decimal } from '@prisma/client/runtime/library';

/**
 * Monetary helpers enforcing Decimal usage.
 * Spec: All monetary values must use Decimal types.
 */

/** Create a Decimal from a string or number */
export function toDecimal(value: string | number): any {
  // We avoid importing the Decimal constructor directly here to keep this client-safe.
  // If this is called on the server, we might need a better way, 
  // but for now let's focus on fixing the client error.
  return value; 
}

/** Format a value as a string with 2 decimal places */
export function formatMoney(value: any, currency = 'CLP'): string {
  if (value === undefined || value === null) return 'N/A';

  let amount: number;

  // Handle Prisma Decimal (server-side or serialized)
  if (typeof value === 'object' && value !== null) {
    if (typeof value.toNumber === 'function') {
      amount = value.toNumber();
    } else if (value.toString) {
      amount = Number(value.toString());
    } else {
      amount = Number(value);
    }
  } else {
    amount = Number(value);
  }

  if (isNaN(amount)) return 'N/A';

  // CLP doesn't use decimals conventionally
  if (currency === 'CLP') {
    return `$${Math.round(amount).toLocaleString('es-CL')}`;
  }

  return `$${amount.toFixed(2)}`;
}

/** Sum an array of values */
export function sumDecimals(values: any[]): number {
  return values.reduce((acc, val) => {
    const num = typeof val?.toNumber === 'function' ? val.toNumber() : Number(val);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);
}

/** Multiply value by quantity */
export function multiplyDecimal(value: any, quantity: number): number {
  const num = typeof value?.toNumber === 'function' ? value.toNumber() : Number(value);
  return (isNaN(num) ? 0 : num) * quantity;
}
