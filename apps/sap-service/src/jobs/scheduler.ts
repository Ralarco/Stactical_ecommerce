import cron from 'node-cron';
import { createLogger } from '../lib/logger';
import { pollEvents } from './poll-events.job';

const log = createLogger('scheduler');

/**
 * Job scheduler for SAP integration service.
 * Spec: Section 12 — scheduled jobs, webhook, manual trigger.
 */
export function startScheduler() {
  // Poll integration events every 30 seconds
  cron.schedule('*/30 * * * * *', async () => {
    try {
      await pollEvents(10);
    } catch (error) {
      log.error({ err: error }, 'Event polling failed');
    }
  });

  log.info('📅 Scheduler started');
  log.info('  ├─ Event polling: every 30s');
  // TODO: Add stock sync schedule (e.g., every 5 minutes)
  // TODO: Add price sync schedule
}
