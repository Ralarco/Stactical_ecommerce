'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryFormModal } from './CategoryFormModal';
import {
  getCategoryProductCountAction,
  deleteCategoryAction,
} from '@/features/catalog/actions/admin-catalog.actions';

export function CategoriesPanel() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null);
  const [deleteError, setDeleteError] = useState('');

  const loadCategories = useCallback(async () => {
    const res = await getCategoryProductCountAction();
    if (res.success) setCategories(res.data);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAdd = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: any) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: any) => {
    if (!confirm(`¿Eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`)) return;

    setDeleteError('');
    const res = await deleteCategoryAction(category.id);
    if (!res.success) {
      setDeleteError(res.error);
      return;
    }
    loadCategories();
    router.refresh();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    loadCategories();
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-[0.2em] text-ink-black uppercase">
            Categorías
          </h2>
          <p className="mt-1 text-xs text-ink-black/40">
            Organiza tus productos en categorías para facilitar la navegación
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded border border-gold bg-gold px-5 py-2 text-xs font-bold tracking-widest text-ink-black uppercase transition-colors hover:bg-gold-light"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva Categoría
        </button>
      </div>

      {/* Error Banner */}
      {deleteError && (
        <div className="rounded bg-error/10 p-3 text-sm text-error flex items-center justify-between">
          <span>{deleteError}</span>
          <button onClick={() => setDeleteError('')} className="text-error/60 hover:text-error">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="rounded-lg border border-ink-black/10 bg-pure-white shadow-sm">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="mb-4 h-12 w-12 text-ink-black/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            <p className="text-sm text-ink-black/40">No hay categorías registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink-black/80">
              <thead>
                <tr className="border-b border-ink-black/10 text-xs tracking-widest text-ink-black/40 uppercase">
                  <th className="px-6 py-3 font-medium">Nombre</th>
                  <th className="px-6 py-3 font-medium">Slug</th>
                  <th className="px-6 py-3 font-medium text-center">Productos</th>
                  <th className="px-6 py-3 font-medium text-center">Estado</th>
                  <th className="px-6 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-ink-black/5 transition-colors hover:bg-ink-black/[0.02]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-gold/10">
                          <svg className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                          </svg>
                        </div>
                        <span className="font-medium text-ink-black">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-ink-black/40">{cat.slug}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-ink-black/5 px-2 text-xs font-bold text-ink-black/60">
                        {cat.productCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${
                        cat.isActive ? 'bg-gold/10 text-gold' : 'bg-ink-black/5 text-ink-black/40'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cat.isActive ? 'bg-gold' : 'bg-ink-black/30'}`} />
                        {cat.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-xs font-medium tracking-wider text-ink-black/40 hover:text-gold uppercase transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="text-xs font-medium tracking-wider text-ink-black/20 hover:text-error uppercase transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
}
