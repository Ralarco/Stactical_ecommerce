import { ProductCard } from './ProductCard';
import type { Product, Variant } from '@stactical/shared-types';

interface ProductGridProps {
  products: (Product & { variants: Variant[] })[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <p className="text-sm font-medium text-on-surface-variant uppercase tracking-[0.2em]">
          No se encontraron productos
        </p>
        <div className="mt-4 h-[1px] w-12 bg-gold/30" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
