import { PrismaProductRepository } from '@/features/catalog/infrastructure/prisma-product.repository';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { CategoryNav } from '@/features/catalog/components/CategoryNav';

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, search, page = '1' } = await searchParams;
  const repo = new PrismaProductRepository();

  const [{ products, total }, categories] = await Promise.all([
    repo.findAll({
      page: parseInt(page),
      pageSize: 12,
      categorySlug: category,
      search: search,
    }),
    repo.findAllCategories(),
  ]);

  return (
    <main className="bg-surface min-h-screen">
      {/* ─── Header ─── */}
      <section className="bg-ink-black py-20 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-gold" />
            <span className="text-[10px] font-bold tracking-[0.4em] text-gold uppercase">Catálogo</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-pure-white sm:text-6xl uppercase">
            {category ? category.replace(/-/g, ' ') : 'Todos los Productos'}
          </h1>
          <p className="mt-6 max-w-2xl text-sm font-light tracking-wider leading-relaxed text-pure-white/40 uppercase">
            Equipo de alto rendimiento diseñado para resistir las condiciones más extremas. 
            Utilidad pura sin concesiones.
          </p>
        </div>
      </section>

      {/* ─── Catalog ─── */}
      <section className="py-12 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          {/* Filters & Nav */}
          <div className="mb-12 border-b border-surface-container-high">
            <CategoryNav categories={categories} currentSlug={category} />
          </div>

          {/* Results Info */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">
              Mostrando {products.length} de {total} productos
            </p>
          </div>

          {/* Grid */}
          <ProductGrid products={JSON.parse(JSON.stringify(products))} />

          {/* Pagination (Placeholder) */}
          {total > 12 && (
            <div className="mt-16 flex justify-center border-t border-surface-container-high pt-12">
               <button className="text-xs font-bold tracking-[0.3em] text-gold uppercase hover:text-gold-light">
                 Cargar Más
               </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
