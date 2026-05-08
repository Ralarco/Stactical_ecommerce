import { SapClient } from './sap-client';
import type { OrderCreatedPayload } from '@stactical/events';

/** SAP Order Adapter — sends orders to SAP */
export class SapOrderAdapter {
  constructor(private client: SapClient) {}

  async syncOrder(payload: OrderCreatedPayload): Promise<{ sapOrderId: string }> {
    // TODO: Map to SAP order format and send
    throw new Error('SapOrderAdapter.syncOrder not implemented');
  }
}
