import type { Order, OrderItem } from '@stactical/shared-types';
import type { OrderStatus } from '@stactical/shared-types';

export interface IOrderRepository {
  findById(id: string): Promise<(Order & { items: OrderItem[] }) | null>;
  findByUserId(userId: string, page: number, pageSize: number): Promise<{ orders: Order[]; total: number }>;
  create(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  updateSyncStatus(id: string, syncStatus: string, sapOrderId?: string): Promise<Order>;
}
