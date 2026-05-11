'use client';

import { useState, useEffect } from 'react';
import { getAddresses, createAddress, deleteAddress, setDefaultAddress } from '../actions/addresses';

export function AddressesManager({ userId, userName }: { userId: string; userName: string }) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const loadAddresses = async () => {
    setIsLoading(true);
    const data = await getAddresses(userId);
    setAddresses(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAddresses();
  }, [userId]);

  async function handleAddAddress(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const result = await createAddress(userId, formData);

    if (!result.success) {
      setError(result.error || 'Error desconocido');
      return;
    }

    setShowForm(false);
    loadAddresses();
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Seguro que deseas eliminar esta dirección?')) return;
    await deleteAddress(userId, id);
    loadAddresses();
  }

  async function handleSetDefault(id: string) {
    await setDefaultAddress(userId, id);
    loadAddresses();
  }

  const inputClass =
    'w-full border-b border-ink-black/20 bg-transparent py-3 text-sm tracking-wide text-ink-black placeholder:text-ink-black/40 focus:border-gold focus:outline-none';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold tracking-widest uppercase">Direcciones de Despacho</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold hover:text-ink-black transition-colors"
        >
          {showForm ? (
            <>Cancelar</>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Agregar Nueva
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddAddress} className="mb-12 max-w-2xl border border-gold/30 bg-gold/5 p-6 md:p-8">
          <h3 className="mb-6 font-heading text-sm font-bold tracking-widest uppercase text-gold">Nueva Dirección</h3>
          
          {error && <p className="mb-6 text-xs text-error font-semibold">{error}</p>}

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">Nombre (ej. Casa, Oficina)</label>
              <input name="title" required type="text" placeholder="Casa Principal" className={inputClass} />
            </div>
            
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">Calle y Número</label>
              <input name="street" required type="text" placeholder="Av. Providencia 1234, Depto 501" className={inputClass} />
            </div>

            <div>
              <label className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">Comuna / Ciudad</label>
              <input name="city" required type="text" placeholder="Providencia" className={inputClass} />
            </div>

            <div>
              <label className="text-xs font-semibold tracking-[0.15em] uppercase text-gold">Región</label>
              <input name="region" required type="text" placeholder="Región Metropolitana" className={inputClass} />
            </div>

            <div className="sm:col-span-2 mt-4 flex items-center gap-3">
              <input type="checkbox" name="isDefault" id="isDefault" className="h-4 w-4 accent-gold" />
              <label htmlFor="isDefault" className="text-sm text-ink-black/80">Establecer como dirección predeterminada</label>
            </div>
          </div>

          <button type="submit" className="mt-8 rounded bg-ink-black px-8 py-3 text-xs font-bold tracking-widest text-pure-white uppercase hover:bg-gold hover:text-ink-black transition-colors">
            Guardar Dirección
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="text-sm text-ink-black/60">Cargando direcciones...</div>
      ) : addresses.length === 0 ? (
        <div className="rounded border border-ink-black/10 bg-pure-white p-12 text-center">
          <p className="text-sm text-ink-black/60">No tienes direcciones guardadas aún.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className={`relative border p-6 transition-shadow hover:shadow-lg ${address.isDefault ? 'border-gold/50 bg-gold/5' : 'border-ink-black/10 bg-pure-white'}`}>
              <div className="absolute right-6 top-6 flex gap-4">
                {!address.isDefault && (
                  <button onClick={() => handleSetDefault(address.id)} title="Hacer predeterminada" className="text-ink-black/40 hover:text-gold transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </button>
                )}
                <button onClick={() => handleDelete(address.id)} className="text-ink-black/40 hover:text-error transition-colors">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
              <h3 className="mb-2 font-heading text-sm font-bold tracking-widest uppercase">{address.title}</h3>
              <div className="space-y-1 text-sm text-ink-black/70">
                <p>{userName}</p>
                <p>{address.street}</p>
                <p>{address.city}, {address.region}</p>
                <p>{address.country}</p>
              </div>
              {address.isDefault && (
                <div className="mt-6">
                  <span className="inline-flex items-center rounded border border-gold bg-gold/10 px-2 py-1 text-[10px] font-bold tracking-widest text-gold uppercase">
                    Predeterminada
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
