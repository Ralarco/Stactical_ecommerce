'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  if (!user) return null;
  const initial = user.name.charAt(0).toUpperCase();

  function handleLogout() {
    setOpen(false);
    logout();
    router.push('/');
  }

  const menuItemClass =
    'flex w-full items-center gap-3 px-5 py-3 text-xs font-medium tracking-[0.1em] uppercase text-pure-white/60 no-underline transition-colors hover:text-gold hover:bg-pure-white/5';

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded px-2 py-1.5 transition-colors hover:bg-pure-white/5"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="flex h-8 w-8 items-center justify-center border border-gold">
          <span className="text-xs font-semibold text-gold">{initial}</span>
        </div>
        <span className="hidden text-xs font-medium tracking-[0.1em] text-pure-white/60 uppercase sm:inline">
          {user.name}
        </span>
        <svg
          className={`h-3 w-3 text-gold transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 border border-pure-white/10 bg-ink-black shadow-2xl">
          {/* Header */}
          <div className="border-b border-pure-white/10 px-5 py-4">
            <p className="text-sm font-semibold text-pure-white truncate">{user.name}</p>
            <p className="mt-1 text-xs text-pure-white/40 truncate">{user.email}</p>
          </div>

          {/* Links */}
          <div className="py-2">
            {user.role === 'ADMIN' && (
              <Link href="/admin/dashboard" onClick={() => setOpen(false)} className={menuItemClass}>
                <svg className="h-4 w-4 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
                Admin Dashboard
              </Link>
            )}
            <Link href="/dashboard" onClick={() => setOpen(false)} className={menuItemClass}>
              <svg className="h-4 w-4 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Editar Perfil
            </Link>
            <Link href="/dashboard?tab=orders" onClick={() => setOpen(false)} className={menuItemClass}>
              <svg className="h-4 w-4 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              Mis Órdenes
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-pure-white/10 py-2">
            <button onClick={handleLogout} className={menuItemClass}>
              <svg className="h-4 w-4 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
