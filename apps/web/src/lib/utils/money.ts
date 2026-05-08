import { Decimal } from '@prisma/client/runtime/library';

/**
 * Monetary helpers enforcing Decimal usage.
 * Spec: All monetary values must use Decimal types.
 */

/** Create a Decimal from a string or number */
export function toDecimal(value: string | number): Decimal {
  return new Decimal(value);
}

/** Format a Decimal as a string with 2 decimal places */
export function formatMoney(value: Decimal | string, currency = 'CLP'): string {
  const decimal = typeof value === 'string' ? new Decimal(value) : value;
  const formatted = decimal.toFixed(2);

  // CLP doesn't use decimals conventionally, but we store with precision
  if (currency === 'CLP') {
    return `$${Math.round(decimal.toNumber()).toLocaleString('es-CL')}`;
  }

  return `$${formatted}`;
}

/** Sum an array of Decimal values */
export function sumDecimals(values: Decimal[]): Decimal {
  return values.reduce((acc, val) => acc.add(val), new Decimal(0));
}

/** Multiply Decimal by quantity */
export function multiplyDecimal(value: Decimal, quantity: number): Decimal {
  return value.mul(quantity);
}
