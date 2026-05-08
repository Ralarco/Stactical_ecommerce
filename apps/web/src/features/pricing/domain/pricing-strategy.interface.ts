import type { Decimal } from '@prisma/client/runtime/library';
import type { CustomerType } from '@stactical/shared-types';

/**
 * Pricing context passed to pricing strategies.
 * B2B-ready: includes customer type and organization for future
 * negotiated pricing, volume discounts, etc.
 */
export interface PricingContext {
  customerType: CustomerType;
  organizationId?: string;
  quantity: number;
}

/**
 * Pricing Strategy Interface.
 * Initial: StandardPricingStrategy (catalog price).
 * Future: NegotiatedPricingStrategy, VolumePricingStrategy.
 */
export interface IPricingStrategy {
  readonly name: string;
  getPrice(variantId: string, context: PricingContext): Promise<Decimal>;
}
