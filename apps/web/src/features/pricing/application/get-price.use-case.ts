import type { IPricingStrategy, PricingContext } from '../domain/pricing-strategy.interface';
import { StandardPricingStrategy } from '../infrastructure/standard-pricing.strategy';
import type { Decimal } from '@prisma/client/runtime/library';

const standardStrategy = new StandardPricingStrategy();

/** Get the price for a variant given a pricing context */
export async function getPrice(
  variantId: string,
  context: PricingContext,
  strategy?: IPricingStrategy
): Promise<Decimal> {
  const pricingStrategy = strategy ?? standardStrategy;
  return pricingStrategy.getPrice(variantId, context);
}
