'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useCart } from '@/features/cart/context/CartContext';
import { UserMenu } from './UserMenu';
import { CartSlideOver } from '@/features/cart/components/CartSlideOver';

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const [imageError, setImageError] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-ink-black">
        <div className="h-[1px] w-full bg-gold" />
        <nav className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-6 sm:px-8 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 no-underline group">
            <div className="relative h-12 w-48 overflow-hidden">
              {!imageError ? (
                <Image
                  src="/logo.png"
                  alt="Stactical Logo"
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full items-center">
                  <span className="font-heading text-xl font-black tracking-[0.3em] text-pure-white uppercase">
                    Stactical
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden items-center gap-8 md:flex lg:gap-10">
            {['Inicio', 'Colecciones', 'Equipo', 'Sobre Nosotros'].map((item) => (
              <Link
                key={item}
                href={item === 'Inicio' ? '/' : '/products'}
                className="text-xs font-medium tracking-[0.12em] text-pure-white/60 no-underline uppercase transition-colors hover:text-gold"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Right side: Cart + Auth */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative flex h-10 w-10 items-center justify-center text-pure-white/60 transition-colors hover:text-gold"
              aria-label="Abrir carrito"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-gold text-[9px] font-bold text-ink-black">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-3 py-2 text-xs font-medium tracking-[0.12em] text-pure-white/60 no-underline uppercase hover:text-gold"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center border border-gold bg-transparent px-5 py-2 text-xs font-semibold tracking-[0.12em] text-gold uppercase no-underline transition-colors hover:bg-gold hover:text-ink-black"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Cart Slide-over (mounted here so it's available globally) */}
      <CartSlideOver />
    </>
  );
}
