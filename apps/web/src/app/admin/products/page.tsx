import { PrismaProductRepository } from '@/features/catalog/infrastructure/prisma-product.repository';
import { ProductsClient } from './components/ProductsClient';

// Ensure the page is dynamically rendered to get fresh data
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const repo = new PrismaProductRepository();
  
  // Fetch products and categories in parallel
  const [productsData, categories] = await Promise.all([
    repo.findAll({ page: 1, pageSize: 100, activeOnly: false }), // Fetch more for admin or add pagination later
    repo.findAllCategories()
  ]);

  // Serialize Prisma models (Decimal, Date) before passing to Client Component
  const serializedProducts = JSON.parse(JSON.stringify(productsData.products));
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return (
    <ProductsClient 
      products={serializedProducts} 
      categories={serializedCategories} 
    />
  );
}
