import type { Payment } from '@stactical/shared-types';

export interface IPaymentRepository {
  create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment>;
  findByOrderId(orderId: string): Promise<Payment[]>;
  findByExternalId(externalTransactionId: string): Promise<Payment | null>;
  updateStatus(id: string, status: string, metadata?: Record<string, unknown>): Promise<Payment>;
}
