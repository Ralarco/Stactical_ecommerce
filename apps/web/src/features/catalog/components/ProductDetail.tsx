'use client';

import { useState } from 'react';
import type { Product, Variant, Category } from '@stactical/shared-types';
import { formatMoney } from '@/lib/utils/money';
import { useCart } from '@/features/cart/context/CartContext';
import { VariantSelector } from './VariantSelector';

interface ProductDetailProps {
  product: Product & { variants: Variant[]; category: Category };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
      },
      {
        id: selectedVariant.id,
        sku: selectedVariant.sku,
        price: Number(selectedVariant.price),
        size: selectedVariant.size,
        color: selectedVariant.color,
        availableStock: selectedVariant.availableStock,
      },
      quantity
    );

    // Show "Added" feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      {/* ─── Gallery ─── */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-container-high lg:aspect-auto lg:h-[700px]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/10">
            <svg className="h-48 w-48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-6 left-6">
          <span className="bg-ink-black/90 px-3 py-1.5 text-[10px] font-bold tracking-[0.25em] text-gold uppercase backdrop-blur-sm">
            {product.category.name}
          </span>
        </div>
      </div>

      {/* ─── Info ─── */}
      <div className="flex flex-col py-4 lg:py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-ink-black sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold tracking-tight text-gold">
            {formatMoney(selectedVariant.price)}
          </p>
        </div>

        <div className="mb-10 h-[1px] w-full bg-surface-container-high" />

        {/* Description */}
        <div className="mb-10 space-y-4">
          <h2 className="text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase">Descripción</h2>
          <p className="text-base leading-relaxed text-on-surface-variant/80">
            {product.description || 'Sin descripción disponible.'}
          </p>
        </div>

        {/* Variant Selector */}
        {product.variants.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-4 text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase">Seleccionar Variante</h2>
            <VariantSelector 
              variants={product.variants} 
              selectedId={selectedVariant.id} 
              onChange={(id) => {
                const variant = product.variants.find(v => v.id === id);
                if (variant) {
                  setSelectedVariant(variant);
                  setQuantity(1);
                }
              }} 
            />
          </div>
        )}

        {/* Availability */}
        <div className="mb-10 flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full ${selectedVariant.availableStock > 0 ? 'bg-gold' : 'bg-error'}`} />
          <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">
            {selectedVariant.availableStock > 0 
              ? `Stock Disponible: ${selectedVariant.availableStock}` 
              : 'Agotado'}
          </span>
        </div>

        {/* Quantity + Add to Cart */}
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Quantity Selector */}
          <div className="flex items-center border border-ink-black/10">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-14 w-12 items-center justify-center text-ink-black/40 hover:text-ink-black transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>
            <span className="flex h-14 w-14 items-center justify-center text-sm font-bold text-ink-black border-x border-ink-black/10">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(selectedVariant.availableStock, quantity + 1))}
              disabled={quantity >= selectedVariant.availableStock}
              className="flex h-14 w-12 items-center justify-center text-ink-black/40 hover:text-ink-black transition-colors disabled:opacity-30"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={selectedVariant.availableStock === 0}
            className={`flex-1 px-10 py-5 text-xs font-bold tracking-[0.3em] uppercase transition-all disabled:opacity-50 disabled:hover:bg-ink-black disabled:hover:text-pure-white ${
              added
                ? 'bg-gold text-ink-black'
                : 'bg-ink-black text-pure-white hover:bg-gold hover:text-ink-black'
            }`}
          >
            {added ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Agregado
              </span>
            ) : (
              'Añadir al Carrito'
            )}
          </button>
        </div>

        {/* SAP Info (Subtle) */}
        <div className="mt-12 flex items-center gap-2 border-t border-surface-container py-6">
          <span className="text-[10px] font-medium text-on-surface-variant/40 uppercase tracking-widest">
            SKU: {selectedVariant.sku}
          </span>
          <span className="text-[10px] text-on-surface-variant/20">|</span>
          <span className="text-[10px] font-medium text-on-surface-variant/40 uppercase tracking-widest">
            SAP: {selectedVariant.sapMaterialCode || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}
