import type { OrderStatus } from '../enums';

/** DTO for checkout submission */
export type CheckoutDto = {
  cartId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  billingAddress: AddressDto;
  shippingAddress: AddressDto;
};

export type AddressDto = {
  street: string;
  number: string;
  apartment?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

/** DTO for creating an order from checkout */
export type CreateOrderDto = CheckoutDto & {
  userId?: string;
};

/** DTO for stock updates from SAP */
export type StockUpdateDto = {
  sku: string;
  sapMaterialCode: string;
  availableStock: number;
  incomingStock?: number;
};
