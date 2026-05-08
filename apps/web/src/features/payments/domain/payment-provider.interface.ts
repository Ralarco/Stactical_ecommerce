import type { Decimal } from '@prisma/client/runtime/library';

/**
 * Payment Provider Interface.
 * All payment providers must implement this contract.
 * Initial implementation: Transbank Webpay Plus.
 */

export interface CreateTransactionInput {
  orderId: string;
  amount: number;
  returnUrl: string;
  sessionId?: string;
}

export interface TransactionResult {
  token: string;
  url: string;
}

export interface ConfirmationResult {
  success: boolean;
  transactionId: string;
  authorizationCode: string | null;
  amount: number;
  status: 'AUTHORIZED' | 'FAILED' | 'CANCELLED';
  responseCode: number;
  rawResponse: Record<string, unknown>;
}

export interface RefundResult {
  success: boolean;
  refundId: string | null;
}

export interface WebhookResult {
  isValid: boolean;
  orderId: string | null;
  eventType: 'PAYMENT_CONFIRMED' | 'PAYMENT_FAILED' | 'REFUND_COMPLETED';
}

/** Abstract payment provider — all providers must implement this */
export interface IPaymentProvider {
  readonly name: string;

  createTransaction(input: CreateTransactionInput): Promise<TransactionResult>;

  confirmTransaction(token: string): Promise<ConfirmationResult>;

  refundTransaction(transactionId: string, amount: number): Promise<RefundResult>;

  handleWebhook(payload: unknown, signature: string): Promise<WebhookResult>;
}
