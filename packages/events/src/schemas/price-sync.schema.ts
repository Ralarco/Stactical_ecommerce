import { z } from 'zod';

/** Schema for PRICE_SYNC integration event payload */
export const priceSyncSchema = z.object({
  items: z.array(
    z.object({
      sku: z.string(),
      sapMaterialCode: z.string(),
      price: z.string(),
      currency: z.string().default('CLP'),
    })
  ),
  syncSource: z.enum(['SCHEDULED', 'WEBHOOK', 'MANUAL']),
  timestamp: z.string().datetime(),
});

export type PriceSyncPayload = z.infer<typeof priceSyncSchema>;
