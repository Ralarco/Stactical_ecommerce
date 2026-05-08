import type { IProductRepository } from '../domain/product.repository';
import { NotFoundError } from '@/lib/errors/app-error';

/** Get single product by slug — used for product detail pages (ISR) */
export async function getProductBySlug(
  repo: IProductRepository,
  slug: string
) {
  const product = await repo.findBySlug(slug);

  if (!product) {
    throw new NotFoundError('Product', slug);
  }

  return product;
}
