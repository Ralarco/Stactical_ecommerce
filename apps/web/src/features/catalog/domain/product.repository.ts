import type { Product, Variant, Category } from '@stactical/shared-types';

/** Product repository interface — domain layer */
export interface IProductRepository {
  findAll(params: {
    page: number;
    pageSize: number;
    categorySlug?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    activeOnly?: boolean;
  }): Promise<{ products: Product[]; total: number }>;

  findBySlug(slug: string): Promise<(Product & { variants: Variant[]; category: Category }) | null>;

  findById(id: string): Promise<Product | null>;

  create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;

  update(id: string, data: Partial<Product>): Promise<Product>;

  softDelete(id: string): Promise<void>;

  findAllCategories(): Promise<Category[]>;
}
