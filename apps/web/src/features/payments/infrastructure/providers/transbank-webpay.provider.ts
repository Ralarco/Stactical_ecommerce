import type { IPaymentProvider } from '../domain/payment-provider.interface';

/**
 * Transbank Webpay Plus provider.
 * Implements the IPaymentProvider interface.
 *
 * Uses transbank-sdk for integration/production environments.
 * TRANSBANK_ENVIRONMENT controls which endpoint is used.
 */
export class TransbankWebpayProvider implements IPaymentProvider {
  readonly name = 'transbank-webpay-plus';

  async createTransaction(input: {
    orderId: string;
    amount: number;
    returnUrl: string;
    sessionId?: string;
  }) {
    // TODO: Implement with transbank-sdk
    // const tx = new WebpayPlus.Transaction();
    // const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    throw new Error('TransbankWebpayProvider.createTransaction not implemented');
  }

  async confirmTransaction(token: string) {
    // TODO: Implement with transbank-sdk
    // const response = await tx.commit(token);
    throw new Error('TransbankWebpayProvider.confirmTransaction not implemented');
  }

  async refundTransaction(transactionId: string, amount: number) {
    // TODO: Implement with transbank-sdk
    // const response = await tx.refund(token, amount);
    throw new Error('TransbankWebpayProvider.refundTransaction not implemented');
  }

  async handleWebhook(payload: unknown, signature: string) {
    // TODO: Implement webhook validation
    throw new Error('TransbankWebpayProvider.handleWebhook not implemented');
  }
}
