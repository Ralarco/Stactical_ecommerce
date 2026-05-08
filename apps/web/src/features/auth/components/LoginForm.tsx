'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      if (email === 'admin@stactical.com' && password === 'admin123') {
        login({ id: '1', name: 'Admin User', email: 'admin@stactical.com', role: 'ADMIN' });
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
        await new Promise((r) => setTimeout(r, 1200));
        router.push('/');
      } else if (email === 'customer@stactical.com' && password === 'customer123') {
        login({ id: '2', name: 'Cliente de Prueba', email: 'customer@stactical.com', role: 'CUSTOMER' });
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
        await new Promise((r) => setTimeout(r, 1200));
        router.push('/');
      } else {
        setError('Credenciales inválidas. Intenta nuevamente.');
      }
    } catch {
      setError('Error de conexión. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full border-b border-pure-white/20 bg-transparent py-3 text-sm tracking-wide text-pure-white placeholder:text-pure-white/20 focus:border-gold focus:outline-none disabled:opacity-40';

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-black px-6 py-16 sm:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(201,169,110,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative mx-auto w-full max-w-[448px]">
        {/* Brand */}
        <div className="mb-14 text-center">
          <Link href="/" className="font-heading text-sm font-bold tracking-[0.3em] text-pure-white no-underline uppercase">
            Stactical
          </Link>
          <div className="mx-auto mt-5 h-[1px] w-12 bg-gold" />
          <p className="mt-5 text-xs tracking-[0.15em] text-pure-white/40 uppercase">Accede a tu cuenta</p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-pure-white/10 bg-pure-white/5 p-8 backdrop-blur-sm sm:p-10">
          {success && (
            <div className="mb-6 flex items-center gap-3 rounded border border-gold/30 bg-gold/10 p-4">
              <svg className="h-4 w-4 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span className="text-sm font-semibold text-gold">{success}</span>
            </div>
          )}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded border border-error/30 bg-error/10 p-4">
              <svg className="h-4 w-4 shrink-0 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <span className="text-sm text-pure-white/70">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="login-email" className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">Email</label>
              <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com" required autoComplete="email" disabled={!!success} className={inputClass} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">Contraseña</label>
                <Link href="/forgot-password" className="text-xs text-pure-white/30 no-underline hover:text-gold">¿Olvidaste?</Link>
              </div>
              <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required autoComplete="current-password" disabled={!!success} className={inputClass} />
            </div>

            <button type="submit" disabled={loading || !!success}
              className="mt-2 flex w-full items-center justify-center rounded border border-gold bg-gold px-8 py-3.5 text-xs font-bold tracking-[0.15em] uppercase text-ink-black transition-colors hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed">
              {loading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-ink-black border-t-transparent" />
              ) : success ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Sesión Iniciada
                </span>
              ) : 'Iniciar Sesión'}
            </button>
          </form>

          {!success && (
            <>
              <div className="my-8 flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-pure-white/10" />
                <span className="text-xs tracking-[0.15em] text-pure-white/20 uppercase">o</span>
                <div className="h-[1px] flex-1 bg-pure-white/10" />
              </div>
              <Link href="/register"
                className="flex w-full items-center justify-center rounded border border-pure-white/20 bg-transparent px-8 py-3.5 text-xs font-medium tracking-[0.12em] uppercase text-pure-white/60 no-underline transition-colors hover:border-gold hover:text-gold">
                Crear una cuenta
              </Link>
            </>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-1 rounded border border-pure-white/5 p-4 text-center">
          <p className="text-[10px] tracking-wider text-pure-white/20 uppercase">Credenciales de Prueba:</p>
          <p className="text-xs text-pure-white/40">Admin: admin@stactical.com / admin123</p>
          <p className="text-xs text-pure-white/40">Customer: customer@stactical.com / customer123</p>
        </div>
      </div>
    </div>
  );
}
