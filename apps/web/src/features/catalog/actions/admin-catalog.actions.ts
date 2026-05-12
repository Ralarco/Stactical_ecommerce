'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { handleAction } from '@/lib/errors/error-handler';

export async function createProductAction(data: {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
}) {
  return handleAction(async () => {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        sapSyncStatus: 'NOT_REQUIRED', // Or PENDING if we want to sync it TO sap later
        variants: {
          create: {
            sku: data.sku,
            price: data.price,
            availableStock: data.stock,
          },
        },
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return product;
  });
}

export async function updateProductAction(
  productId: string,
  variantId: string,
  data: {
    name: string;
    slug: string;
    description: string;
    categoryId: string;
    sku: string;
    price: number;
    stock: number;
    imageUrl?: string;
    isActive: boolean;
  }
) {
  return handleAction(async () => {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        variants: {
          update: {
            where: { id: variantId },
            data: {
              sku: data.sku,
              price: data.price,
              availableStock: data.stock,
            },
          },
        },
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return product;
  });
}

export async function getCategoriesAction() {
  return handleAction(async () => {
    return prisma.category.findMany({
      where: { isActive: true },
    });
  });
}

export async function getProductForEditAction(productId: string) {
  return handleAction(async () => {
    return prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true,
      },
    });
  });
}

// ─── Category Actions ───

export async function createCategoryAction(data: {
  name: string;
  slug: string;
}) {
  return handleAction(async () => {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        isActive: true,
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return category;
  });
}

export async function updateCategoryAction(
  categoryId: string,
  data: {
    name: string;
    slug: string;
    isActive: boolean;
  }
) {
  return handleAction(async () => {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: data.name,
        slug: data.slug,
        isActive: data.isActive,
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return category;
  });
}

export async function deleteCategoryAction(categoryId: string) {
  return handleAction(async () => {
    // Check if there are products using this category
    const productCount = await prisma.product.count({
      where: { categoryId, deletedAt: null },
    });

    if (productCount > 0) {
      throw new Error(`No se puede eliminar: ${productCount} producto(s) usan esta categoría`);
    }

    await prisma.category.update({
      where: { id: categoryId },
      data: { isActive: false, deletedAt: new Date() },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
  });
}

export async function getCategoryProductCountAction() {
  return handleAction(async () => {
    const categories = await prisma.category.findMany({
      where: { isActive: true, deletedAt: null },
      include: {
        _count: { select: { products: { where: { deletedAt: null } } } },
      },
      orderBy: { name: 'asc' },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      isActive: c.isActive,
      productCount: c._count.products,
      createdAt: c.createdAt,
    }));
  });
}
