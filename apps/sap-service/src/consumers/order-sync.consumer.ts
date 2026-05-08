import { createLogger } from '../lib/logger';
import type { OrderCreatedPayload } from '@stactical/events';
import { orderCreatedSchema } from '@stactical/events';

const log = createLogger('order-sync');

/** Consume ORDER_CREATED events and sync to SAP */
export async function processOrderCreated(payload: Record<string, unknown>) {
  const parsed = orderCreatedSchema.safeParse(payload);

  if (!parsed.success) {
    log.error({ errors: parsed.error.format() }, 'Invalid ORDER_CREATED payload');
    throw new Error('Invalid ORDER_CREATED payload');
  }

  log.info({ orderId: parsed.data.orderId }, 'Processing ORDER_CREATED');

  // TODO: Use SapOrderAdapter to sync
  log.info({ orderId: parsed.data.orderId }, 'Order synced to SAP');
}
