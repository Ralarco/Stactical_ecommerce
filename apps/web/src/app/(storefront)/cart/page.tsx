'use client';

import Link from 'next/link';
import { useCart } from '@/features/cart/context/CartContext';
import { formatMoney } from '@/lib/utils/money';

export default function CartPage() {
  const { items, itemCount, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  // Estimated costs
  const shipping = subtotal > 50000 ? 0 : 4990;
  const total = subtotal + shipping;

  return (
    <main className="bg-surface min-h-screen">
      {/* Header */}
      <section className="bg-ink-black py-16 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-gold" />
            <span className="text-[10px] font-bold tracking-[0.4em] text-gold uppercase">Carrito</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-pure-white sm:text-5xl uppercase">
            Tu Carrito
          </h1>
          {itemCount > 0 && (
            <p className="mt-4 text-sm font-light tracking-wider text-pure-white/40 uppercase">
              {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
            </p>
          )}
        </div>
      </section>

      <section className="py-12 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <svg className="mb-8 h-24 w-24 text-ink-black/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              <h2 className="text-lg font-bold tracking-wider text-ink-black/40 uppercase">
                Tu carrito está vacío
              </h2>
              <p className="mt-3 text-sm text-ink-black/30">
                Explora nuestro catálogo y encuentra lo que necesitas
              </p>
              <Link
                href="/products"
                className="mt-8 bg-ink-black px-10 py-4 text-xs font-bold tracking-[0.3em] text-pure-white no-underline uppercase transition-all hover:bg-gold hover:text-ink-black"
              >
                Ver Productos
              </Link>
            </div>
          ) : (
            /* Cart Content */
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Items List */}
              <div className="lg:col-span-2">
                {/* Table Header */}
                <div className="mb-4 hidden border-b border-ink-black/10 pb-3 sm:grid sm:grid-cols-12 sm:gap-4">
                  <span className="col-span-6 text-[10px] font-bold tracking-[0.2em] text-ink-black/40 uppercase">Producto</span>
                  <span className="col-span-2 text-center text-[10px] font-bold tracking-[0.2em] text-ink-black/40 uppercase">Cantidad</span>
                  <span className="col-span-2 text-right text-[10px] font-bold tracking-[0.2em] text-ink-black/40 uppercase">Precio</span>
                  <span className="col-span-2 text-right text-[10px] font-bold tracking-[0.2em] text-ink-black/40 uppercase">Total</span>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="group rounded-lg border border-ink-black/5 bg-pure-white p-4 transition-colors hover:border-ink-black/10 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4"
                    >
                      {/* Product Info */}
                      <div className="col-span-6 flex gap-4">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-surface-container">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-ink-black/10">
                              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="text-sm font-bold text-ink-black no-underline hover:text-gold transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <div className="mt-1 flex flex-wrap gap-3">
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
                          <span className="mt-1 text-[10px] font-mono text-ink-black/30">
                            SKU: {item.variant.sku}
                          </span>
                          {/* Mobile: remove button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold tracking-wider text-ink-black/30 uppercase hover:text-error transition-colors sm:hidden"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 mt-4 flex items-center justify-center sm:mt-0">
                        <div className="flex items-center border border-ink-black/10">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center text-ink-black/40 hover:text-ink-black transition-colors"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                            </svg>
                          </button>
                          <span className="flex h-9 w-10 items-center justify-center text-sm font-bold text-ink-black border-x border-ink-black/10">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.variant.availableStock}
                            className="flex h-9 w-9 items-center justify-center text-ink-black/40 hover:text-ink-black transition-colors disabled:opacity-30"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="col-span-2 mt-3 text-right sm:mt-0">
                        <span className="text-sm font-mono text-ink-black/60">
                          {formatMoney(item.variant.price)}
                        </span>
                      </div>

                      {/* Line Total */}
                      <div className="col-span-2 mt-3 flex items-center justify-end gap-3 sm:mt-0">
                        <span className="text-sm font-bold text-gold">
                          {formatMoney(item.variant.price * item.quantity)}
                        </span>
                        {/* Desktop remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="hidden p-1 text-ink-black/20 hover:text-error transition-colors sm:block"
                          aria-label="Eliminar"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-8 flex items-center justify-between border-t border-ink-black/10 pt-6">
                  <Link
                    href="/products"
                    className="text-xs font-bold tracking-[0.2em] text-ink-black/40 no-underline uppercase hover:text-gold transition-colors"
                  >
                    ← Seguir Comprando
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold tracking-[0.2em] text-ink-black/30 uppercase hover:text-error transition-colors"
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-lg border border-ink-black/10 bg-pure-white p-6 shadow-sm">
                  <h3 className="mb-6 text-xs font-bold tracking-[0.2em] text-ink-black uppercase">
                    Resumen del Pedido
                  </h3>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-ink-black/60">Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})</span>
                      <span className="font-mono font-medium text-ink-black">{formatMoney(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-ink-black/60">Envío estimado</span>
                      <span className="font-mono font-medium text-ink-black">
                        {shipping === 0 ? (
                          <span className="text-gold">Gratis</span>
                        ) : (
                          formatMoney(shipping)
                        )}
                      </span>
                    </div>

                    {shipping > 0 && (
                      <p className="text-[10px] text-ink-black/30 tracking-wider">
                        Envío gratis en compras sobre {formatMoney(50000)}
                      </p>
                    )}

                    <div className="my-3 h-[1px] w-full bg-ink-black/10" />

                    <div className="flex justify-between">
                      <span className="text-sm font-bold tracking-wider text-ink-black uppercase">Total</span>
                      <span className="text-xl font-bold text-ink-black">{formatMoney(total)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-6 flex w-full items-center justify-center bg-ink-black px-6 py-4 text-xs font-bold tracking-[0.3em] text-pure-white no-underline uppercase transition-all hover:bg-gold hover:text-ink-black"
                  >
                    Finalizar Compra
                  </Link>

                  {/* Security badges */}
                  <div className="mt-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[10px] text-ink-black/30 tracking-wider">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                      <span>Pago 100% seguro</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-ink-black/30 tracking-wider">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                      <span>Despacho a todo Chile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
