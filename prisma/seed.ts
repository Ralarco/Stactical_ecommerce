import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Clean up
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 2. Categories
  const categories = [
    { name: 'Equipamiento Táctico', slug: 'equipamiento-tactico' },
    { name: 'Indumentaria', slug: 'indumentaria' },
    { name: 'Accesorios', slug: 'accesorios' },
    { name: 'Calzado', slug: 'calzado' },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  const tacticalCat = await prisma.category.findUniqueOrThrow({ where: { slug: 'equipamiento-tactico' } });
  const indumentariaCat = await prisma.category.findUniqueOrThrow({ where: { slug: 'indumentaria' } });

  // 3. Products & Variants
  const products = [
    {
      name: 'Chaleco Porta Placas Elite v2',
      description: 'Sistema de transporte de carga modular de alta resistencia. Diseñado para movilidad máxima y protección balística. Fabricado en Cordura 1000D.',
      slug: 'chaleco-porta-placas-elite-v2',
      categoryId: tacticalCat.id,
      variants: [
        { sku: 'TAC-CHL-V2-BLK', size: 'M', color: 'Black', price: 145000, stock: 15 },
        { sku: 'TAC-CHL-V2-GRY', size: 'L', color: 'Wolf Gray', price: 145000, stock: 8 },
      ]
    },
    {
      name: 'Pantalón Operativo Vanguard',
      description: 'Pantalón de combate con rodilleras integradas y 10 bolsillos funcionales. Tejido Ripstop elástico para mayor libertad de movimiento.',
      slug: 'pantalon-operativo-vanguard',
      categoryId: indumentariaCat.id,
      variants: [
        { sku: 'IND-PAN-VAN-32', size: '32', color: 'Coyote', price: 89900, stock: 24 },
        { sku: 'IND-PAN-VAN-34', size: '34', color: 'Coyote', price: 89900, stock: 12 },
      ]
    },
    {
      name: 'Guantes de Acción Directa',
      description: 'Guantes tácticos con protección de nudillos y palma reforzada. Compatibles con pantallas táctiles.',
      slug: 'guantes-accion-directa',
      categoryId: tacticalCat.id,
      variants: [
        { sku: 'TAC-GUA-AD-M', size: 'M', color: 'Black', price: 32500, stock: 50 },
        { sku: 'TAC-GUA-AD-L', size: 'L', color: 'Black', price: 32500, stock: 45 },
      ]
    },
    {
      name: 'Mochila de Asalto 72h',
      description: 'Capacidad de 45 litros con compartimento para hidratación y sistema MOLLE cortado con láser.',
      slug: 'mochila-asalto-72h',
      categoryId: tacticalCat.id,
      variants: [
        { sku: 'TAC-MOC-72-BLK', size: 'One Size', color: 'Black', price: 115000, stock: 10 },
      ]
    }
  ];

  for (const p of products) {
    const { variants, ...productData } = p;
    const createdProduct = await prisma.product.create({ data: productData });
    
    for (const v of variants) {
      await prisma.variant.create({
        data: {
          productId: createdProduct.id,
          sku: v.sku,
          size: v.size,
          color: v.color,
          price: v.price,
          availableStock: v.stock,
          isActive: true,
        }
      });
    }
  }

  console.log(`✅ Created ${categories.length} categories`);
  console.log(`✅ Created ${products.length} products`);
  console.log('🌱 Seed completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
