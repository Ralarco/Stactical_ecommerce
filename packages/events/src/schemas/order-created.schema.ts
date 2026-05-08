import { z } from 'zod';

/** Schema for ORDER_CREATED integration event payload */
export const orderCreatedSchema = z.object({
  orderId: z.string(),
  externalReference: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  items: z.array(
    z.object({
      variantId: z.string(),
      sku: z.string(),
      sapMaterialCode: z.string().nullable(),
      quantity: z.number().int().positive(),
      priceAtPurchase: z.string(),
    })
  ),
  subtotal: z.string(),
  tax: z.string(),
  shippingCost: z.string(),
  discount: z.string(),
  total: z.string(),
  currency: z.string().default('CLP'),
  billingAddress: z.record(z.unknown()),
  shippingAddress: z.record(z.unknown()),
});

export type OrderCreatedPayload = z.infer<typeof orderCreatedSchema>;
