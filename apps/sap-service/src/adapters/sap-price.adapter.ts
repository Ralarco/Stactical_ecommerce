import { SapClient } from './sap-client';

/** SAP Price Adapter — reads prices from SAP */
export class SapPriceAdapter {
  constructor(private client: SapClient) {}

  async fetchPrices(): Promise<Array<{ materialCode: string; price: string; currency: string }>> {
    // TODO: Call SAP pricing endpoint
    throw new Error('SapPriceAdapter.fetchPrices not implemented');
  }
}
