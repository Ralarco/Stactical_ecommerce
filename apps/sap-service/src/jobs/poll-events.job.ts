import { prisma } from '../lib/db/prisma';
import { createLogger } from '../lib/logger';
import { processOrderCreated } from '../consumers/order-sync.consumer';
import { processStockSync } from '../consumers/stock-sync.consumer';
import { processPriceSync } from '../consumers/price-sync.consumer';
import { CONSTANTS } from '@stactical/config';
import type { IntegrationEventType } from '@stactical/shared-types';

const log = createLogger('poll-events');

/** Consumer dispatch map */
const consumers: Record<string, (payload: Record<string, unknown>) => Promise<void>> = {
  ORDER_CREATED: processOrderCreated,
  STOCK_SYNC: processStockSync,
  PRICE_SYNC: processPriceSync,
};

/** Poll IntegrationEvent table for pending events */
export async function pollEvents(batchSize = 10) {
  const events = await prisma.integrationEvent.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
    take: batchSize,
  });

  if (events.length === 0) return;

  log.info({ count: events.length }, 'Polled events');

  for (const event of events) {
    const consumer = consumers[event.type];

    if (!consumer) {
      log.warn({ type: event.type }, 'No consumer for event type');
      continue;
    }

    try {
      // Mark as processing
      await prisma.integrationEvent.update({
        where: { id: event.id },
        data: { status: 'PROCESSING' },
      });

      await consumer(event.payload as Record<string, unknown>);

      // Mark as success
      await prisma.integrationEvent.update({
        where: { id: event.id },
        data: { status: 'SUCCESS', processedAt: new Date() },
      });

      log.info({ eventId: event.id, type: event.type }, 'Event processed');
    } catch (error) {
      const newRetries = event.retries + 1;
      const status = newRetries >= CONSTANTS.MAX_EVENT_RETRIES ? 'FAILED' : 'PENDING';

      await prisma.integrationEvent.update({
        where: { id: event.id },
        data: {
          status,
          retries: newRetries,
          lastError: error instanceof Error ? error.message : 'Unknown error',
          ...(status === 'FAILED' ? { processedAt: new Date() } : {}),
        },
      });

      log.error(
        { eventId: event.id, retries: newRetries, err: error },
        status === 'FAILED' ? 'Event moved to dead letter' : 'Event will retry'
      );
    }
  }
}
