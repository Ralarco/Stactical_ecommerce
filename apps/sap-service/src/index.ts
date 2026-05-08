import { createLogger } from './lib/logger';
import { validateEnv } from './config/env';
import { startScheduler } from './jobs/scheduler';

const log = createLogger('main');

async function main() {
  log.info('🚀 Starting SAP Integration Service...');

  // Validate environment
  const env = validateEnv();
  log.info({ sapBaseUrl: env.SAP_BASE_URL }, 'Environment validated');

  // Start job scheduler
  startScheduler();

  log.info('✅ SAP Integration Service started');
}

main().catch((error) => {
  console.error('❌ Failed to start SAP Integration Service:', error);
  process.exit(1);
});
