import type { Cart, CartItem } from '@stactical/shared-types';

export interface ICartRepository {
  findById(id: string): Promise<(Cart & { items: CartItem[] }) | null>;
  findByUserId(userId: string): Promise<(Cart & { items: CartItem[] }) | null>;
  create(userId?: string): Promise<Cart>;
  addItem(cartId: string, variantId: string, quantity: number): Promise<CartItem>;
  updateItemQuantity(itemId: string, quantity: number): Promise<CartItem>;
  removeItem(itemId: string): Promise<void>;
  clear(cartId: string): Promise<void>;
}
