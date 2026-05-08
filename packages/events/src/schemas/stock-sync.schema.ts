import { z } from 'zod';

/** Schema for STOCK_SYNC integration event payload */
export const stockSyncSchema = z.object({
  items: z.array(
    z.object({
      sku: z.string(),
      sapMaterialCode: z.string(),
      availableStock: z.number().int().min(0),
      incomingStock: z.number().int().min(0).optional(),
    })
  ),
  syncSource: z.enum(['SCHEDULED', 'WEBHOOK', 'MANUAL']),
  timestamp: z.string().datetime(),
});

export type StockSyncPayload = z.infer<typeof stockSyncSchema>;
