import type { IntegrationEventType, IntegrationStatus } from '@stactical/shared-types';

/** Base integration event type used across apps */
export type IntegrationEventRecord = {
  id: string;
  type: IntegrationEventType;
  payload: Record<string, unknown>;
  status: IntegrationStatus;
  retries: number;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
