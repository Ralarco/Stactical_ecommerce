'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product, Variant } from '@stactical/shared-types';
import { formatMoney } from '@/lib/utils/money';
import { useCart } from '@/features/cart/context/CartContext';

interface ProductCardProps {
  product: Product & { variants: Variant[] };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // Get the base price from the first active variant
  const baseVariant = product.variants?.[0];
  const priceLabel = baseVariant ? formatMoney(baseVariant.price) : 'N/A';
  const inStock = baseVariant && baseVariant.availableStock > 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!baseVariant || !inStock) return;

    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
      },
      {
        id: baseVariant.id,
        sku: baseVariant.sku,
        price: Number(baseVariant.price),
        size: baseVariant.size,
        color: baseVariant.color,
        availableStock: baseVariant.availableStock,
      },
      1
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-4 rounded-lg bg-pure-white p-4 transition-all hover:shadow-xl hover:shadow-gold/5"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-surface-container">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/20 transition-transform duration-500 group-hover:scale-110">
            <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Badges */}
        {!inStock && (
          <div className="absolute top-2 right-2 bg-ink-black/80 px-2 py-1 text-[10px] font-bold tracking-widest text-pure-white uppercase">
            Sin Stock
          </div>
        )}

        {/* Quick Add Button */}
        {inStock && (
          <button
            onClick={handleQuickAdd}
            className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
              added
                ? 'bg-gold text-ink-black scale-110'
                : 'bg-ink-black text-pure-white opacity-0 group-hover:opacity-100 hover:bg-gold hover:text-ink-black'
            }`}
            aria-label="Agregar al carrito"
          >
            {added ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-sm font-bold tracking-tight text-on-surface transition-colors group-hover:text-gold">
          {product.name}
        </h3>
        <p className="text-xs font-semibold tracking-wider text-gold">
          {priceLabel}
        </p>
      </div>

      <div className="mt-2 flex items-center gap-2 px-1 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Ver Detalle</span>
        <span className="h-[1px] w-4 bg-gold transition-all group-hover:w-8" />
      </div>
    </Link>
  );
}
