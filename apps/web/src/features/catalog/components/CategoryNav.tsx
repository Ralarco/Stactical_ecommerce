import Link from 'next/link';
import type { Category } from '@stactical/shared-types';

interface CategoryNavProps {
  categories: Category[];
  currentSlug?: string;
}

export function CategoryNav({ categories, currentSlug }: CategoryNavProps) {
  return (
    <nav className="flex items-center gap-8 overflow-x-auto pb-4 scrollbar-hide">
      <Link
        href="/products"
        className={`
          whitespace-nowrap text-[11px] font-bold tracking-[0.3em] uppercase transition-colors
          ${!currentSlug ? 'text-gold' : 'text-on-surface-variant hover:text-gold'}
        `}
      >
        Todos
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.slug}`}
          className={`
            whitespace-nowrap text-[11px] font-bold tracking-[0.3em] uppercase transition-colors
            ${currentSlug === category.slug ? 'text-gold' : 'text-on-surface-variant hover:text-gold'}
          `}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
