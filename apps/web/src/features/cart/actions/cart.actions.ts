'use server';

/** Cart Server Actions — TODO: implement with use cases */
export async function addToCart(variantId: string, quantity: number) {
  throw new Error('addToCart not implemented');
}

export async function updateCartItem(itemId: string, quantity: number) {
  throw new Error('updateCartItem not implemented');
}

export async function removeFromCart(itemId: string) {
  throw new Error('removeFromCart not implemented');
}
