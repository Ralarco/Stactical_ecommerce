import type { IProductRepository } from '../domain/product.repository';

/** Get paginated products use case */
export async function getProducts(
  repo: IProductRepository,
  params: {
    page: number;
    pageSize: number;
    categorySlug?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
) {
  return repo.findAll(params);
}
