import type { IntegrationEventType, IntegrationStatus } from '@stactical/shared-types';

/**
 * Event Queue Interface.
 * Abstracts the underlying queue implementation.
 *
 * Initial: PostgreSQL outbox pattern.
 * Future: BullMQ, Redis Streams, or SQS.
 */
export interface IEventQueue {
  /** Emit a new integration event */
  emit(event: {
    type: IntegrationEventType;
    payload: Record<string, unknown>;
  }): Promise<string>; // Returns event ID

  /** Poll for pending events */
  poll(batchSize: number): Promise<QueuedEvent[]>;

  /** Acknowledge successful processing */
  ack(eventId: string): Promise<void>;

  /** Negative acknowledge — mark for retry */
  nack(eventId: string, error: Error): Promise<void>;

  /** Move to dead letter after max retries */
  deadLetter(eventId: string, reason: string): Promise<void>;
}

export interface QueuedEvent {
  id: string;
  type: IntegrationEventType;
  payload: Record<string, unknown>;
  status: IntegrationStatus;
  retries: number;
  createdAt: Date;
}
