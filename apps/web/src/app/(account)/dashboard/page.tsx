'use client';
// Force reload

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { AddressesManager } from '@/features/account/components/AddressesManager';

type TabType = 'profile' | 'security' | 'addresses' | 'orders' | 'delete';

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && ['profile', 'security', 'addresses', 'orders', 'delete'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      router.push('/login');
    }
  }, [user, router]);

  // Prevent rendering if not logged in
  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Mi Perfil' },
    { id: 'security', label: 'Seguridad' },
    { id: 'addresses', label: 'Direcciones' },
    { id: 'orders', label: 'Mis Pedidos' },
    { id: 'delete', label: 'Eliminar Cuenta' },
  ] as const;

  const inputClass =
    'w-full border-b border-ink-black/20 bg-transparent py-3 text-sm tracking-wide text-ink-black placeholder:text-ink-black/40 focus:border-gold focus:outline-none';

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
      <div className="mb-16">
        <h1 className="font-heading text-3xl font-bold tracking-widest text-ink-black uppercase">
          Panel de Control
        </h1>
        <p className="mt-4 text-sm tracking-widest text-ink-black/60 uppercase">
          Bienvenido, {user.name}
        </p>
      </div>

      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Sidebar Nav */}
        <nav className="flex w-full flex-col gap-2 lg:w-64 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-between border-l-2 px-6 py-4 text-left text-xs font-semibold tracking-[0.15em] uppercase transition-colors ${
                activeTab === tab.id
                  ? 'border-gold bg-ink-black/5 text-ink-black'
                  : 'border-transparent text-ink-black/40 hover:bg-ink-black/5 hover:text-ink-black'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <svg className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </button>
          ))}
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="mt-8 flex items-center gap-3 px-6 py-4 text-left text-xs font-semibold tracking-[0.15em] uppercase text-error transition-colors hover:bg-error/10"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            Cerrar Sesión
          </button>
        </nav>

        {/* Content Area */}
        <div className="flex-1">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="mb-8 font-heading text-xl font-bold tracking-widest uppercase">Datos Personales</h2>
              <form className="max-w-xl space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">Nombre completo</label>
                  <input type="text" defaultValue={user.name} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">Correo electrónico</label>
                  <input type="email" defaultValue={user.email} className={inputClass} disabled />
                  <p className="mt-2 text-[10px] text-ink-black/40 uppercase tracking-wider">El correo no puede ser modificado</p>
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">Teléfono</label>
                  <input type="tel" placeholder="+56 9 1234 5678" className={inputClass} />
                </div>
                <button type="submit" className="mt-8 rounded bg-ink-black px-8 py-3 text-xs font-bold tracking-widest text-pure-white uppercase hover:bg-gold hover:text-ink-black transition-colors">
                  Guardar Cambios
                </button>
              </form>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="mb-8 font-heading text-xl font-bold tracking-widest uppercase">Cambiar Contraseña</h2>
              <form className="max-w-xl space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">Contraseña Actual</label>
                  <input type="password" placeholder="••••••••" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">Nueva Contraseña</label>
                  <input type="password" placeholder="••••••••" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">Confirmar Nueva Contraseña</label>
                  <input type="password" placeholder="••••••••" className={inputClass} />
                </div>
                <button type="submit" className="mt-8 rounded bg-ink-black px-8 py-3 text-xs font-bold tracking-widest text-pure-white uppercase hover:bg-gold hover:text-ink-black transition-colors">
                  Actualizar Contraseña
                </button>
              </form>
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <AddressesManager userId={user.id} userName={user.name} />
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="mb-8 font-heading text-xl font-bold tracking-widest uppercase">Historial de Compras</h2>
              
              <div className="rounded border border-ink-black/10 bg-pure-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-ink-black/5 text-xs font-semibold tracking-widest uppercase text-ink-black/60">
                      <tr>
                        <th className="px-6 py-4">Nº Pedido</th>
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4 text-right">Total</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-black/5">
                      {/* Dummy Order */}
                      <tr className="hover:bg-ink-black/5 transition-colors">
                        <td className="px-6 py-4 font-mono">#ORD-9482</td>
                        <td className="px-6 py-4 text-ink-black/60">08 May 2026</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                            <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
                            En Proceso
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold">$124.500</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs font-bold uppercase tracking-widest text-gold hover:text-ink-black transition-colors">
                            Ver Detalles
                          </button>
                        </td>
                      </tr>
                      {/* Dummy Order 2 */}
                      <tr className="hover:bg-ink-black/5 transition-colors">
                        <td className="px-6 py-4 font-mono">#ORD-8120</td>
                        <td className="px-6 py-4 text-ink-black/60">15 Abr 2026</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-black/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-black">
                            <span className="h-1.5 w-1.5 rounded-full bg-ink-black"></span>
                            Entregado
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold">$89.990</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs font-bold uppercase tracking-widest text-gold hover:text-ink-black transition-colors">
                            Ver Detalles
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* DELETE ACCOUNT TAB */}
          {activeTab === 'delete' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="max-w-xl rounded border border-error/20 bg-error/5 p-8">
                <h2 className="mb-4 font-heading text-xl font-bold tracking-widest text-error uppercase">Zona de Peligro</h2>
                <p className="mb-8 text-sm leading-relaxed text-ink-black/70">
                  Eliminar tu cuenta es una acción permanente y no se puede deshacer. Se borrarán todos tus datos personales, historial de pedidos y direcciones guardadas.
                </p>
                <button className="rounded border border-error px-8 py-3 text-xs font-bold tracking-widest text-error uppercase hover:bg-error hover:text-pure-white transition-colors">
                  Eliminar mi cuenta definitivamente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccountDashboard() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Cargando panel...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
