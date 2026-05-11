'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { registerUser } from '@/features/auth/actions/register';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', company: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    
    if (formData.password.length < 8) { 
      setError('La contraseña debe tener al menos 8 caracteres.'); 
      return; 
    }
    
    if (formData.password !== formData.confirmPassword) { 
      setError('Las contraseñas no coinciden.'); 
      return; 
    }
    
    setLoading(true);
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (formData.company) {
        data.append('company', formData.company);
      }

      const result = await registerUser(data);

      if (result.success) {
        // Successful registration
        router.push('/login?registered=true');
      } else {
        // Display error from server
        setError(result.error || 'Error al crear la cuenta. Intenta más tarde.');
      }
    } catch {
      setError('Error de conexión. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full border-b border-pure-white/20 bg-transparent py-3 text-sm tracking-wide text-pure-white placeholder:text-pure-white/20 focus:border-gold focus:outline-none';

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-black px-6 py-16 sm:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(201,169,110,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative mx-auto w-full max-w-[448px]">
        <div className="mb-14 text-center">
          <Link href="/" className="font-heading text-sm font-bold tracking-[0.3em] text-pure-white no-underline uppercase">
            Stactical
          </Link>
          <div className="mx-auto mt-5 h-[1px] w-12 bg-gold" />
          <p className="mt-5 text-xs tracking-[0.15em] text-pure-white/40 uppercase">Crear cuenta</p>
        </div>

        <div className="rounded-lg border border-pure-white/10 bg-pure-white/5 p-8 backdrop-blur-sm sm:p-10">
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded border border-error/30 bg-error/10 p-4">
              <svg className="h-4 w-4 shrink-0 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <span className="text-sm text-pure-white/70">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {[
              { id: 'register-name', label: 'Nombre completo', type: 'text', field: 'name', placeholder: 'Juan Pérez', autoComplete: 'name' },
              { id: 'register-email', label: 'Email', type: 'email', field: 'email', placeholder: 'tu@email.com', autoComplete: 'email' },
              { id: 'register-company', label: 'Empresa', type: 'text', field: 'company', placeholder: 'Mi Empresa SpA', autoComplete: 'organization', optional: true },
              { id: 'register-password', label: 'Contraseña', type: 'password', field: 'password', placeholder: 'Mínimo 8 caracteres', autoComplete: 'new-password' },
              { id: 'register-confirm', label: 'Confirmar contraseña', type: 'password', field: 'confirmPassword', placeholder: 'Repite tu contraseña', autoComplete: 'new-password' },
            ].map(({ id, label, type, field, placeholder, autoComplete, optional }) => (
              <div key={id} className="flex flex-col gap-2">
                <label htmlFor={id} className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">
                  {label}
                  {optional && <span className="ml-1 font-normal normal-case text-pure-white/30">(opcional)</span>}
                </label>
                <input
                  id={id} type={type}
                  value={formData[field as keyof typeof formData]}
                  onChange={(e) => updateField(field, e.target.value)}
                  placeholder={placeholder}
                  required={!optional}
                  minLength={type === 'password' ? 8 : undefined}
                  autoComplete={autoComplete}
                  className={inputClass}
                />
              </div>
            ))}

            <div className="flex items-start gap-3">
              <input id="register-terms" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-gold" />
              <label htmlFor="register-terms" className="text-xs leading-relaxed text-pure-white/40">
                Acepto los <Link href="#" className="text-gold underline">Términos de Servicio</Link> y la <Link href="#" className="text-gold underline">Política de Privacidad</Link>
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded border border-gold bg-gold px-8 py-3.5 text-xs font-bold tracking-[0.15em] uppercase text-ink-black transition-colors hover:bg-gold-light disabled:opacity-40 disabled:cursor-not-allowed">
              {loading ? <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-ink-black border-t-transparent" /> : 'Crear Cuenta'}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-pure-white/10" />
            <span className="text-xs tracking-[0.15em] text-pure-white/20 uppercase">o</span>
            <div className="h-[1px] flex-1 bg-pure-white/10" />
          </div>
          <Link href="/login"
            className="flex w-full items-center justify-center rounded border border-pure-white/20 bg-transparent px-8 py-3.5 text-xs font-medium tracking-[0.12em] uppercase text-pure-white/60 no-underline transition-colors hover:border-gold hover:text-gold">
            Ya tengo una cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
