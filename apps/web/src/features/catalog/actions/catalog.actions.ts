'use server';

import { PrismaProductRepository } from '../infrastructure/prisma-product.repository';
import { getProducts } from '../application/get-products.use-case';
import { getProductBySlug } from '../application/get-product-by-slug.use-case';
import { searchProducts } from '../application/search-products.use-case';
import { handleAction } from '@/lib/errors/error-handler';

const repo = new PrismaProductRepository();

export async function fetchProducts(params: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return handleAction(() =>
    getProducts(repo, {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      ...params,
    })
  );
}

export async function fetchProductBySlug(slug: string) {
  return handleAction(() => getProductBySlug(repo, slug));
}

export async function fetchSearchProducts(query: string, page?: number) {
  return handleAction(() => searchProducts(repo, query, page));
}
