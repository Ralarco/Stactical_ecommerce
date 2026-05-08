'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/features/auth/context/AuthContext';
import { UserMenu } from './UserMenu';

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);

  return (
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
      </nav>
    </header>
  );
}
