'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProductAction, updateProductAction } from '@/features/catalog/actions/admin-catalog.actions';
import { uploadImageAction } from '@/features/catalog/actions/upload.actions';

export function ProductFormModal({
  isOpen,
  onClose,
  categories,
  productToEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  productToEdit?: any;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    sku: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    isActive: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (productToEdit) {
      const variant = productToEdit.variants?.[0] || {};
      setFormData({
        name: productToEdit.name || '',
        slug: productToEdit.slug || '',
        description: productToEdit.description || '',
        categoryId: productToEdit.categoryId || '',
        sku: variant.sku || '',
        price: Number(variant.price) || 0,
        stock: variant.availableStock || 0,
        imageUrl: productToEdit.imageUrl || '',
        isActive: productToEdit.isActive ?? false,
      });
      setImageFile(null);
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        categoryId: categories[0]?.id || '',
        sku: '',
        price: 0,
        stock: 0,
        imageUrl: '',
        isActive: false, // Default to unpublished
      });
      setImageFile(null);
    }
  }, [productToEdit, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalImageUrl = formData.imageUrl;

      if (imageFile) {
        const fileData = new FormData();
        fileData.append('file', imageFile);
        const uploadRes = await uploadImageAction(fileData);
        if (!uploadRes.success) {
          throw new Error(uploadRes.error || 'Error uploading image');
        }
        finalImageUrl = uploadRes.data as string;
      }

      const submissionData = { ...formData, imageUrl: finalImageUrl };

      if (productToEdit) {
        const variantId = productToEdit.variants?.[0]?.id;
        if (!variantId) throw new Error('No variant found to update');
        
        const res = await updateProductAction(productToEdit.id, variantId, submissionData);
        if (!res.success) throw new Error(res.error || 'Error updating product');
      } else {
        const res = await createProductAction(submissionData);
        if (!res.success) throw new Error(res.error || 'Error creating product');
      }
      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-lg bg-pure-white p-6 shadow-2xl my-8">
        <h2 className="mb-6 text-xl font-bold uppercase tracking-wider text-ink-black">
          {productToEdit ? 'Editar Producto' : 'Añadir Producto'}
        </h2>
        
        {error && (
          <div className="mb-4 rounded bg-error/10 p-3 text-sm text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
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
                    slug: val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                  });
                }}
                className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2 text-sm text-ink-black focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-black/60">
                Slug
              </label>
              <input
                required
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2 text-sm text-ink-black focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-black/60">
              Descripción
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2 text-sm text-ink-black focus:border-gold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-black/60">
                Categoría
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2 text-sm text-ink-black focus:border-gold focus:outline-none"
              >
                <option value="">Seleccione...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-black/60">
                SKU (Variante Base)
              </label>
              <input
                required
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2 text-sm text-ink-black focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-black/60">
                Precio
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2 text-sm text-ink-black focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-black/60">
                Stock Disponible
              </label>
              <input
                required
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2 text-sm text-ink-black focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ink-black/60">
                Imagen del Producto
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2 text-sm text-ink-black focus:border-gold focus:outline-none file:mr-4 file:rounded file:border-0 file:bg-gold file:px-4 file:py-1 file:text-xs file:font-bold file:uppercase file:text-ink-black hover:file:bg-gold-light"
              />
              {formData.imageUrl && !imageFile && (
                <div className="mt-2 text-xs text-ink-black/60">
                  Imagen actual: <a href={formData.imageUrl} target="_blank" className="text-gold hover:underline">Ver</a>
                </div>
              )}
            </div>
            
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-5 w-5 rounded border-ink-black/20 text-gold focus:ring-gold"
                />
                <span className="text-sm font-bold uppercase tracking-wider text-ink-black">
                  Publicar en la tienda
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4 border-t border-ink-black/10 pt-6">
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
