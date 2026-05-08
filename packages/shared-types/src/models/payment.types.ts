export type Payment = {
  id: string;
  orderId: string;
  provider: string;
  externalTransactionId: string | null;
  amount: string;
  currency: string;
  status: PaymentStatus;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}
