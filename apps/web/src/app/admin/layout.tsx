'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  // Basic client-side protection for admin route
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, router]);

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    { name: 'Productos', href: '/admin/products', icon: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z' },
    { name: 'Transacciones', href: '/admin/transactions', icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z' },
    { name: 'Usuarios', href: '/admin/users', icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
    { name: 'Sincronización SAP', href: '/admin/sap', icon: 'M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z' },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-pure-white/10 bg-ink-black transition-transform max-md:-translate-x-full md:translate-x-0">
        <div className="flex h-16 items-center justify-center border-b border-pure-white/10 px-6">
          <Link href="/" className="font-heading text-sm font-bold tracking-[0.2em] text-pure-white no-underline uppercase">
            STACTICAL <span className="text-gold">ADMIN</span>
          </Link>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <p className="px-4 pb-2 pt-4 text-xs font-semibold tracking-[0.2em] text-pure-white/40 uppercase">
            Gestión
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded px-4 py-3 text-xs font-medium tracking-[0.1em] uppercase transition-colors ${isActive
                    ? 'bg-pure-white/10 text-gold'
                    : 'text-pure-white/60 hover:bg-pure-white/5 hover:text-pure-white'
                  }`}
              >
                <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d={item.icon} />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col md:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-pure-white/10 bg-ink-black/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-semibold tracking-[0.15em] text-pure-white uppercase">
              {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-xs font-medium tracking-[0.1em] text-pure-white/60 uppercase transition-colors hover:text-gold">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Volver a la Tienda
            </Link>
            <span className="text-xs tracking-wider text-pure-white/40 uppercase">
              {user?.name}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 sm:p-8 lg:p-12">
          <div className="mx-auto w-full max-w-[1280px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
