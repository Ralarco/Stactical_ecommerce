'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ─── Types ───

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
}

export interface CartVariant {
  id: string;
  sku: string;
  price: number;
  size?: string | null;
  color?: string | null;
  availableStock: number;
}

export interface CartLineItem {
  id: string; // cartItemId (local uuid)
  product: CartProduct;
  variant: CartVariant;
  quantity: number;
}

export interface CartState {
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
}

interface CartContextValue extends CartState {
  addItem: (product: CartProduct, variant: CartVariant, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ─── Storage ───

const STORAGE_KEY = 'stactical_cart:v1';

function loadCart(): CartLineItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartLineItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// ─── Provider ───

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  const addItem = useCallback((product: CartProduct, variant: CartVariant, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variant.id === variant.id);

      if (existingIndex >= 0) {
        // Update quantity (cap at available stock)
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, variant.availableStock);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }

      // Add new line item
      return [
        ...prev,
        {
          id: generateId(),
          product,
          variant,
          quantity: Math.min(quantity, variant.availableStock),
        },
      ];
    });

    setIsOpen(true); // Open slide-over on add
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== lineId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === lineId
          ? { ...item, quantity: Math.min(quantity, item.variant.availableStock) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((o) => !o),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
