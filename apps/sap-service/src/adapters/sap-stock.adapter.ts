import { SapClient } from './sap-client';

/** SAP Stock Adapter — reads stock from SAP */
export class SapStockAdapter {
  constructor(private client: SapClient) {}

  async fetchStock(): Promise<Array<{ materialCode: string; stock: number }>> {
    // TODO: Call SAP stock endpoint
    throw new Error('SapStockAdapter.fetchStock not implemented');
  }
}
