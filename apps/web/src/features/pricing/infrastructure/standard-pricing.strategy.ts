import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/errors/app-error';
import type { Decimal } from '@prisma/client/runtime/library';
import type { IPricingStrategy, PricingContext } from '../domain/pricing-strategy.interface';

/**
 * Standard pricing — returns the catalog price from the Variant table.
 * This is the default pricing strategy for B2C customers.
 */
export class StandardPricingStrategy implements IPricingStrategy {
  readonly name = 'standard';

  async getPrice(variantId: string, _context: PricingContext): Promise<Decimal> {
    const variant = await prisma.variant.findUnique({
      where: { id: variantId },
      select: { price: true },
    });

    if (!variant) {
      throw new NotFoundError('Variant', variantId);
    }

    return variant.price;
  }
}
