import type { OrderStatus, SyncStatus } from '../enums';

export type Order = {
  id: string;
  externalReference: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  billingAddress: Record<string, unknown>;
  shippingAddress: Record<string, unknown>;
  subtotal: string;
  tax: string;
  shippingCost: string;
  discount: string;
  total: string;
  currency: string;
  status: OrderStatus;
  syncStatus: SyncStatus;
  sapOrderId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItem = {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: string;
  createdAt: Date;
  updatedAt: Date;
};
