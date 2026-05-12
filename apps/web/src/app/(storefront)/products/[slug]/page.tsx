import { notFound } from 'next/navigation';
import { PrismaProductRepository } from '@/features/catalog/infrastructure/prisma-product.repository';
import { ProductDetail } from '@/features/catalog/components/ProductDetail';
import Link from 'next/link';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const repo = new PrismaProductRepository();
  const product = await repo.findBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-surface min-h-screen">
      {/* ─── Breadcrumbs ─── */}
      <nav className="py-6 px-6 sm:px-8 lg:px-12 border-b border-surface-container">
        <div className="mx-auto max-w-[1280px] flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase">
          <Link href="/" className="text-on-surface-variant/40 hover:text-gold transition-colors">Inicio</Link>
          <span className="text-on-surface-variant/20">/</span>
          <Link href="/products" className="text-on-surface-variant/40 hover:text-gold transition-colors">Productos</Link>
          <span className="text-on-surface-variant/20">/</span>
          <span className="text-gold">{product.name}</span>
        </div>
      </nav>

      {/* ─── Main Content ─── */}
      <section className="py-12 px-6 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1280px]">
          <ProductDetail product={JSON.parse(JSON.stringify(product))} />
        </div>
      </section>

      {/* ─── Related Products Placeholder ─── */}
      <section className="bg-surface-container py-20 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 flex items-center gap-4">
            <div className="h-[1px] w-8 bg-gold" />
            <h2 className="text-xs font-bold tracking-[0.3em] text-on-surface uppercase">Relacionados</h2>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
            <p className="text-xs font-medium tracking-widest uppercase">Próximamente</p>
          </div>
        </div>
      </section>
    </main>
  );
}
