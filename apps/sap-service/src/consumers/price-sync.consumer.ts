import { createLogger } from '../lib/logger';

const log = createLogger('price-sync');

/** Consume PRICE_SYNC events and update local prices */
export async function processPriceSync(payload: Record<string, unknown>) {
  log.info('Processing PRICE_SYNC');
  // TODO: Use SapPriceAdapter + update Variant.price
  throw new Error('processPriceSync not implemented');
}
