export type Cart = {
  id: string;
  userId: string | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};
