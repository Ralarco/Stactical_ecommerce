import type { IProductRepository } from '../domain/product.repository';

/** Search products use case */
export async function searchProducts(
  repo: IProductRepository,
  query: string,
  page = 1,
  pageSize = 20
) {
  return repo.findAll({ page, pageSize, search: query });
}
