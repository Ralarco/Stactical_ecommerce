import { prisma } from '@/lib/db/prisma';
import type { IProductRepository } from '../domain/product.repository';
import type { Product, Variant, Category } from '@stactical/shared-types';

/** Prisma implementation of IProductRepository */
export class PrismaProductRepository implements IProductRepository {
  async findAll(params: {
    page: number;
    pageSize: number;
    categorySlug?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page, pageSize, categorySlug, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const skip = (page - 1) * pageSize;

    const where = {
      deletedAt: null,
      ...(params.activeOnly !== false && { isActive: true }),
      ...(categorySlug && { category: { slug: categorySlug } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortOrder },
        include: { category: true, variants: { where: { isActive: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    return { products: products as unknown as Product[], total };
  }

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true, deletedAt: null },
      include: {
        category: true,
        variants: { where: { isActive: true, deletedAt: null } },
      },
    });

    return product as unknown as (Product & { variants: Variant[]; category: Category }) | null;
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product as unknown as Product | null;
  }

  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const product = await prisma.product.create({ data });
    return product as unknown as Product;
  }

  async update(id: string, data: Partial<Product>) {
    const product = await prisma.product.update({ where: { id }, data });
    return product as unknown as Product;
  }

  async softDelete(id: string) {
    await prisma.product.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });
  }

  async findAllCategories() {
    const categories = await prisma.category.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { name: 'asc' },
    });
    return categories as unknown as Category[];
  }
}
