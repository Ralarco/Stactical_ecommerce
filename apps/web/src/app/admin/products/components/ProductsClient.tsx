'use client';

import { useState } from 'react';
import { ProductFormModal } from './ProductFormModal';
import { CategoriesPanel } from './CategoriesPanel';
import { formatMoney } from '@/lib/utils/money';

type Tab = 'products' | 'categories';

export function ProductsClient({ products, categories }: { products: any[], categories: any[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const handleEdit = (product: any) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.variants?.some((v: any) => v.sku?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filterCategory || p.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'products', label: 'Productos', count: products.length },
    { key: 'categories', label: 'Categorías', count: categories.length },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wider text-ink-black uppercase">
          Gestión de Productos
        </h1>
        {activeTab === 'products' && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded border border-gold bg-gold px-6 py-2.5 text-xs font-bold tracking-widest text-ink-black uppercase transition-colors hover:bg-gold-light"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Añadir Producto
          </button>
        )}
      </div>

      {/* ─── Tabs ─── */}
      <div className="flex items-center gap-1 border-b border-ink-black/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-2 px-5 py-3 text-xs font-bold tracking-[0.15em] uppercase transition-colors ${
              activeTab === tab.key
                ? 'text-gold'
                : 'text-ink-black/40 hover:text-ink-black/60'
            }`}
          >
            {tab.label}
            <span className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
              activeTab === tab.key
                ? 'bg-gold/10 text-gold'
                : 'bg-ink-black/5 text-ink-black/30'
            }`}>
              {tab.count}
            </span>
            {/* Active indicator */}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
            )}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ─── */}
      {activeTab === 'products' && (
        <div className="rounded-lg border border-ink-black/10 bg-pure-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full max-w-sm">
              <input
                type="text"
                placeholder="Buscar por SKU o Nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-ink-black/20 bg-transparent px-4 py-2 text-sm text-ink-black placeholder:text-ink-black/40 focus:border-gold focus:outline-none"
              />
            </div>
            <div className="flex gap-4">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded border border-ink-black/20 bg-pure-white px-4 py-2 text-sm text-ink-black focus:border-gold focus:outline-none"
              >
                <option value="">Todas las Categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink-black/80">
              <thead>
                <tr className="border-b border-ink-black/10 text-xs tracking-widest text-ink-black/40 uppercase">
                  <th className="pb-3 font-medium">SKU (Base)</th>
                  <th className="pb-3 font-medium">Nombre</th>
                  <th className="pb-3 font-medium">Categoría</th>
                  <th className="pb-3 font-medium text-right">Precio</th>
                  <th className="pb-3 font-medium text-right">Stock</th>
                  <th className="pb-3 font-medium text-center">Estado SAP</th>
                  <th className="pb-3 font-medium text-center">Publicado</th>
                  <th className="pb-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const baseVariant = product.variants?.[0] || {};
                  return (
                    <tr key={product.id} className="border-b border-ink-black/5 transition-colors hover:bg-ink-black/5">
                      <td className="py-4 font-mono text-gold">{baseVariant.sku || 'N/A'}</td>
                      <td className="py-4 font-medium">{product.name}</td>
                      <td className="py-4 text-ink-black/60">{product.category?.name || 'N/A'}</td>
                      <td className="py-4 text-right font-mono">{baseVariant.price ? formatMoney(baseVariant.price) : 'N/A'}</td>
                      <td className="py-4 text-right font-mono">
                        <span className={baseVariant.availableStock === 0 ? 'text-error font-bold' : ''}>
                          {baseVariant.availableStock || 0}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${
                          product.sapSyncStatus === 'SUCCESS' ? 'bg-gold/10 text-gold' :
                          product.sapSyncStatus === 'FAILED' ? 'bg-error/10 text-error' :
                          'bg-ink-black/5 text-ink-black/60'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            product.sapSyncStatus === 'SUCCESS' ? 'bg-gold' :
                            product.sapSyncStatus === 'FAILED' ? 'bg-error' :
                            'bg-ink-black/40'
                          }`} />
                          {product.sapSyncStatus === 'NOT_REQUIRED' ? 'N/A' : product.sapSyncStatus || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${
                          product.isActive ? 'bg-gold/10 text-gold' : 'bg-ink-black/5 text-ink-black/60'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            product.isActive ? 'bg-gold' : 'bg-ink-black/40'
                          }`} />
                          {product.isActive ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-xs font-medium tracking-wider text-ink-black/40 hover:text-gold uppercase transition-colors"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-ink-black/40 text-sm">
                      No hay productos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <CategoriesPanel />
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        productToEdit={productToEdit}
      />
    </div>
  );
}
