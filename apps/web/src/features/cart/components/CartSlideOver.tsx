'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/features/cart/context/CartContext';
import { formatMoney } from '@/lib/utils/money';

export function CartSlideOver() {
  const { items, itemCount, subtotal, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart();
    }
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-ink-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-pure-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-black/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold tracking-[0.2em] text-ink-black uppercase">
              Tu Carrito
            </h2>
            {itemCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center bg-gold text-[10px] font-bold text-ink-black">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center text-ink-black/40 transition-colors hover:text-ink-black"
            aria-label="Cerrar carrito"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <svg className="h-20 w-20 text-ink-black/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              <div>
                <p className="text-sm font-bold text-ink-black/40 uppercase tracking-wider">
                  Carrito vacío
                </p>
                <p className="mt-2 text-xs text-ink-black/30">
                  Agrega productos para comenzar
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-4 border border-ink-black/20 px-8 py-3 text-xs font-bold tracking-[0.2em] text-ink-black uppercase transition-colors hover:border-gold hover:text-gold"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg border border-ink-black/5 bg-surface p-3 transition-colors hover:border-ink-black/10"
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-container">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink-black/10">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-sm font-bold text-ink-black no-underline hover:text-gold transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <div className="mt-1 flex gap-2">
                        {item.variant.size && (
                          <span className="text-[10px] font-medium tracking-wider text-ink-black/40 uppercase">
                            Talla: {item.variant.size}
                          </span>
                        )}
                        {item.variant.color && (
                          <span className="text-[10px] font-medium tracking-wider text-ink-black/40 uppercase">
                            Color: {item.variant.color}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-ink-black/10">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-ink-black/40 hover:text-ink-black transition-colors"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                          </svg>
                        </button>
                        <span className="flex h-7 w-8 items-center justify-center text-xs font-bold text-ink-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.variant.availableStock}
                          className="flex h-7 w-7 items-center justify-center text-ink-black/40 hover:text-ink-black transition-colors disabled:opacity-30"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      </div>

                      <span className="text-sm font-bold text-gold">
                        {formatMoney(item.variant.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="self-start p-1 text-ink-black/20 hover:text-error transition-colors"
                    aria-label="Eliminar"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Totals */}
        {items.length > 0 && (
          <div className="border-t border-ink-black/10 px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold tracking-[0.2em] text-ink-black/60 uppercase">
                Subtotal
              </span>
              <span className="text-lg font-bold text-ink-black">
                {formatMoney(subtotal)}
              </span>
            </div>

            <p className="mb-4 text-[10px] text-ink-black/40 tracking-wider uppercase">
              Envío e impuestos se calculan al finalizar la compra
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/cart"
                onClick={closeCart}
                className="flex items-center justify-center border border-ink-black/20 px-6 py-3.5 text-xs font-bold tracking-[0.3em] text-ink-black no-underline uppercase transition-colors hover:border-gold hover:text-gold"
              >
                Ver Carrito
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex items-center justify-center bg-ink-black px-6 py-3.5 text-xs font-bold tracking-[0.3em] text-pure-white no-underline uppercase transition-all hover:bg-gold hover:text-ink-black"
              >
                Finalizar Compra
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
