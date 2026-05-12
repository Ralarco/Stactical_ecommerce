import { prisma } from '@/lib/db/prisma';
import { createLogger } from '@/lib/logger';
import {
  fetchMaterials,
  fetchStockLevels,
  type SapMaterial,
  type SapSyncResult,
} from './sap-client';

const log = createLogger('sap-sync');

// ─── Helper: slugify ───

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── Sync Materials (Products) from SAP ───

/**
 * Pulls the material master from SAP and upserts into the local database.
 * Products imported from SAP start with isActive = false (unpublished)
 * so the admin must manually publish them.
 */
export async function syncMaterials(): Promise<SapSyncResult> {
  log.info('Starting SAP material sync');
  const result: SapSyncResult = { total: 0, created: 0, updated: 0, failed: 0, errors: [] };

  try {
    // Fetch all materials (paginated)
    let allMaterials: SapMaterial[] = [];
    let skip = 0;
    const pageSize = 500;
    let hasMore = true;

    while (hasMore) {
      const batch = await fetchMaterials(pageSize, skip);
      allMaterials = allMaterials.concat(batch);
      skip += pageSize;
      hasMore = batch.length === pageSize;
    }

    result.total = allMaterials.length;
    log.info({ total: result.total }, 'Fetched materials from SAP');

    // Get or create a default "SAP Import" category
    let defaultCategory = await prisma.category.findFirst({
      where: { slug: 'sap-import' },
    });

    if (!defaultCategory) {
      defaultCategory = await prisma.category.create({
        data: {
          name: 'Importación SAP',
          slug: 'sap-import',
          isActive: true,
        },
      });
    }

    // Process each material
    for (const material of allMaterials) {
      try {
        const sapCode = material.ItemCode;
        const name = material.ItemName || sapCode;
        const slug = slugify(name);
        const price = material.ItemPrices?.[0]?.Price ?? 0;
        const stock = material.QuantityOnStock ?? 0;
        const incomingStock = material.QuantityOrderedFromVendors ?? 0;

        // Check if a variant with this SAP code already exists
        const existingVariant = await prisma.variant.findFirst({
          where: { sapMaterialCode: sapCode },
          include: { product: true },
        });

        if (existingVariant) {
          // Update existing product + variant
          await prisma.$transaction([
            prisma.product.update({
              where: { id: existingVariant.productId },
              data: {
                name,
                sapSyncStatus: 'SUCCESS',
              },
            }),
            prisma.variant.update({
              where: { id: existingVariant.id },
              data: {
                price,
                availableStock: stock,
                incomingStock,
                barcode: material.BarCode || existingVariant.barcode,
                color: material.U_Color || existingVariant.color,
                size: material.U_Size || existingVariant.size,
              },
            }),
          ]);
          result.updated++;
        } else {
          // Create new product + variant — unpublished by default
          const uniqueSlug = `${slug}-${sapCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
          await prisma.product.create({
            data: {
              name,
              slug: uniqueSlug,
              categoryId: defaultCategory.id,
              isActive: false, // SAP imports start unpublished
              sapSyncStatus: 'SUCCESS',
              variants: {
                create: {
                  sku: sapCode,
                  sapMaterialCode: sapCode,
                  price,
                  availableStock: stock,
                  incomingStock,
                  barcode: material.BarCode || null,
                  color: material.U_Color || null,
                  size: material.U_Size || null,
                },
              },
            },
          });
          result.created++;
        }
      } catch (itemErr: any) {
        result.failed++;
        const msg = `Error processing ${material.ItemCode}: ${itemErr.message}`;
        result.errors.push(msg);
        log.error({ err: itemErr, itemCode: material.ItemCode }, msg);
      }
    }

    // Log integration event
    await prisma.integrationEvent.create({
      data: {
        type: 'STOCK_SYNC',
        payload: {
          total: result.total,
          created: result.created,
          updated: result.updated,
          failed: result.failed,
        },
        status: result.failed > 0 ? 'FAILED' : 'SUCCESS',
        processedAt: new Date(),
      },
    });

    log.info(result, 'SAP material sync complete');
  } catch (err: any) {
    log.error({ err: err.message }, 'SAP material sync failed');
    result.errors.push(err.message);

    await prisma.integrationEvent.create({
      data: {
        type: 'STOCK_SYNC',
        payload: { error: err.message },
        status: 'FAILED',
        lastError: err.message,
      },
    });
  }

  return result;
}

// ─── Sync Stock Only (lightweight) ───

/**
 * Pulls only stock quantities from SAP and updates variant records.
 * Faster than a full material sync.
 */
export async function syncStock(): Promise<SapSyncResult> {
  log.info('Starting SAP stock sync');
  const result: SapSyncResult = { total: 0, created: 0, updated: 0, failed: 0, errors: [] };

  try {
    let allStock: Awaited<ReturnType<typeof fetchStockLevels>> = [];
    let skip = 0;
    const pageSize = 500;
    let hasMore = true;

    while (hasMore) {
      const batch = await fetchStockLevels(pageSize, skip);
      allStock = allStock.concat(batch);
      skip += pageSize;
      hasMore = batch.length === pageSize;
    }

    result.total = allStock.length;

    for (const entry of allStock) {
      try {
        const variant = await prisma.variant.findFirst({
          where: { sapMaterialCode: entry.ItemCode },
        });

        if (variant) {
          await prisma.variant.update({
            where: { id: variant.id },
            data: {
              availableStock: entry.InStock,
              incomingStock: entry.Ordered,
              reservedStock: entry.Committed,
            },
          });
          result.updated++;
        }
      } catch (itemErr: any) {
        result.failed++;
        result.errors.push(`Stock update failed for ${entry.ItemCode}: ${itemErr.message}`);
      }
    }

    await prisma.integrationEvent.create({
      data: {
        type: 'STOCK_SYNC',
        payload: { updated: result.updated, failed: result.failed },
        status: result.failed > 0 ? 'FAILED' : 'SUCCESS',
        processedAt: new Date(),
      },
    });

    log.info(result, 'SAP stock sync complete');
  } catch (err: any) {
    log.error({ err: err.message }, 'SAP stock sync failed');
    result.errors.push(err.message);
  }

  return result;
}

// ─── Sync a single product to SAP ───

/**
 * Marks a product's sapSyncStatus and logs the event.
 * In a real scenario this would push data to SAP.
 */
export async function syncProductToSap(productId: string): Promise<void> {
  await prisma.product.update({
    where: { id: productId },
    data: { sapSyncStatus: 'PROCESSING' },
  });

  try {
    // Here you would call createSalesOrder or a custom SAP endpoint.
    // For now we just mark as SUCCESS since we're pulling from SAP, not pushing.
    await prisma.product.update({
      where: { id: productId },
      data: { sapSyncStatus: 'SUCCESS' },
    });
  } catch (err: any) {
    await prisma.product.update({
      where: { id: productId },
      data: { sapSyncStatus: 'FAILED' },
    });
    throw err;
  }
}
