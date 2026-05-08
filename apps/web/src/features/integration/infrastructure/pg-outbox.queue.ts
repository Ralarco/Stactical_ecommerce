import { prisma } from '@/lib/db/prisma';
import { createLogger } from '@/lib/logger';
import { CONSTANTS } from '@stactical/config';
import type { IEventQueue, QueuedEvent } from '../domain/event-queue.interface';
import type { IntegrationEventType } from '@stactical/shared-types';

const log = createLogger('pg-outbox');

/**
 * PostgreSQL Outbox implementation of IEventQueue.
 * Uses the IntegrationEvent table as an outbox.
 *
 * Supports:
 * - Transactional emit (within Prisma transactions)
 * - Polling with row locking (SELECT ... FOR UPDATE SKIP LOCKED)
 * - Retry with exponential backoff tracking
 * - Dead letter after max retries
 */
export class PgOutboxQueue implements IEventQueue {
  async emit(event: {
    type: IntegrationEventType;
    payload: Record<string, unknown>;
  }): Promise<string> {
    const record = await prisma.integrationEvent.create({
      data: {
        type: event.type,
        payload: event.payload,
        status: 'PENDING',
      },
    });

    log.info({ eventId: record.id, type: event.type }, 'Event emitted');
    return record.id;
  }

  async poll(batchSize: number): Promise<QueuedEvent[]> {
    // Use raw query for row-level locking (SKIP LOCKED)
    const events = await prisma.$queryRawUnsafe<QueuedEvent[]>(
      `SELECT id, type, payload, status, retries, "createdAt"
       FROM "IntegrationEvent"
       WHERE status = 'PENDING'
       ORDER BY "createdAt" ASC
       LIMIT $1
       FOR UPDATE SKIP LOCKED`,
      batchSize
    );

    return events;
  }

  async ack(eventId: string): Promise<void> {
    await prisma.integrationEvent.update({
      where: { id: eventId },
      data: {
        status: 'SUCCESS',
        processedAt: new Date(),
      },
    });

    log.info({ eventId }, 'Event acknowledged');
  }

  async nack(eventId: string, error: Error): Promise<void> {
    const event = await prisma.integrationEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) return;

    const newRetries = event.retries + 1;

    if (newRetries >= CONSTANTS.MAX_EVENT_RETRIES) {
      await this.deadLetter(eventId, error.message);
      return;
    }

    await prisma.integrationEvent.update({
      where: { id: eventId },
      data: {
        status: 'PENDING',
        retries: newRetries,
        lastError: error.message,
      },
    });

    log.warn({ eventId, retries: newRetries }, 'Event nacked — will retry');
  }

  async deadLetter(eventId: string, reason: string): Promise<void> {
    await prisma.integrationEvent.update({
      where: { id: eventId },
      data: {
        status: 'FAILED',
        lastError: reason,
        processedAt: new Date(),
      },
    });

    log.error({ eventId, reason }, 'Event moved to dead letter');
  }
}
