'use client';

import { useState, useEffect } from 'react';
import {
  createCategoryAction,
  updateCategoryAction,
} from '@/features/catalog/actions/admin-catalog.actions';

export function CategoryFormModal({
  isOpen,
  onClose,
  categoryToEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: any;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    isActive: true,
  });

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name || '',
        slug: categoryToEdit.slug || '',
        isActive: categoryToEdit.isActive ?? true,
      });
    } else {
      setFormData({ name: '', slug: '', isActive: true });
    }
    setError('');
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (categoryToEdit) {
        const res = await updateCategoryAction(categoryToEdit.id, formData);
        if (!res.success) throw new Error(res.error || 'Error al actualizar categoría');
      } else {
        const res = await createCategoryAction({ name: formData.name, slug: formData.slug });
        if (!res.success) throw new Error(res.error || 'Error al crear categoría');
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg bg-pure-white p-6 shadow-2xl">
        <h2 className="mb-6 text-lg font-bold uppercase tracking-wider text-ink-black">
          {categoryToEdit ? 'Editar Categoría' : 'Nueva Categoría'}
        </h2>

        {error && (
          <div className="mb-4 rounded bg-error/10 p-3 text-sm text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-black/60">
              Nombre
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  name: val,
                  slug: val
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, ''),
                });
              }}
              className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2.5 text-sm text-ink-black focus:border-gold focus:outline-none"
              placeholder="Ej: Ropa Táctica"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-black/60">
              Slug (URL)
            </label>
            <input
              required
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2.5 text-sm text-ink-black focus:border-gold focus:outline-none font-mono"
              placeholder="ropa-tactica"
            />
            <p className="mt-1 text-[10px] text-ink-black/30">
              Se usa en la URL: /products?category={formData.slug || '...'}
            </p>
          </div>

          {categoryToEdit && (
            <div className="flex items-center pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-5 w-5 rounded border-ink-black/20 text-gold focus:ring-gold"
                />
                <span className="text-sm font-bold uppercase tracking-wider text-ink-black">
                  Categoría activa
                </span>
              </label>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-4 border-t border-ink-black/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-6 py-2.5 text-xs font-bold tracking-widest text-ink-black/60 uppercase transition-colors hover:text-ink-black"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded border border-gold bg-gold px-6 py-2.5 text-xs font-bold tracking-widest text-ink-black uppercase transition-colors hover:bg-gold-light disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
