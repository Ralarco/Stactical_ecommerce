import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { createLogger } from '@/lib/logger';

const log = createLogger('sap-webhook');

/**
 * SAP Webhook endpoint.
 *
 * Receives product/stock updates pushed from SAP Business One.
 * New products from SAP are created with isActive = false (unpublished).
 *
 * Expected payload:
 * {
 *   event: "MATERIAL_UPDATE" | "STOCK_UPDATE" | "PRICE_UPDATE",
 *   apiKey: "<SAP_API_KEY from .env>",
 *   items: [
 *     {
 *       ItemCode: "MAT-001",
 *       ItemName: "Product Name",
 *       Price: 29990,
 *       QuantityOnStock: 100,
 *       QuantityOrderedFromVendors: 50,
 *       BarCode: "123456789",
 *       Color: "Negro",
 *       Size: "L"
 *     }
 *   ]
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ─── Validate API Key ───
    const expectedKey = process.env.SAP_API_KEY;
    if (expectedKey && body.apiKey !== expectedKey) {
      log.warn('SAP webhook: invalid API key');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { event, items } = body;

    if (!event || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid payload: event and items[] required' }, { status: 400 });
    }

    log.info({ event, itemCount: items.length }, 'SAP webhook received');

    let created = 0;
    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    // Get or create default import category
    let defaultCategory = await prisma.category.findFirst({
      where: { slug: 'sap-import' },
    });

    if (!defaultCategory) {
      defaultCategory = await prisma.category.create({
        data: { name: 'Importación SAP', slug: 'sap-import', isActive: true },
      });
    }

    for (const item of items) {
      try {
        const sapCode = item.ItemCode;
        if (!sapCode) {
          failed++;
          errors.push('Item missing ItemCode');
          continue;
        }

        const existingVariant = await prisma.variant.findFirst({
          where: { sapMaterialCode: sapCode },
          include: { product: true },
        });

        if (existingVariant) {
          // Update existing
          const updateData: any = {};
          if (item.QuantityOnStock !== undefined) updateData.availableStock = item.QuantityOnStock;
          if (item.QuantityOrderedFromVendors !== undefined) updateData.incomingStock = item.QuantityOrderedFromVendors;
          if (item.Price !== undefined) updateData.price = item.Price;
          if (item.BarCode) updateData.barcode = item.BarCode;
          if (item.Color) updateData.color = item.Color;
          if (item.Size) updateData.size = item.Size;

          await prisma.$transaction([
            prisma.variant.update({
              where: { id: existingVariant.id },
              data: updateData,
            }),
            prisma.product.update({
              where: { id: existingVariant.productId },
              data: {
                name: item.ItemName || existingVariant.product.name,
                sapSyncStatus: 'SUCCESS',
              },
            }),
          ]);
          updated++;
        } else {
          // Create new product — unpublished by default
          const name = item.ItemName || sapCode;
          const slug = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

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
                  price: item.Price ?? 0,
                  availableStock: item.QuantityOnStock ?? 0,
                  incomingStock: item.QuantityOrderedFromVendors ?? 0,
                  barcode: item.BarCode || null,
                  color: item.Color || null,
                  size: item.Size || null,
                },
              },
            },
          });
          created++;
        }
      } catch (err: any) {
        failed++;
        errors.push(`${item.ItemCode}: ${err.message}`);
        log.error({ err, itemCode: item.ItemCode }, 'SAP webhook item processing failed');
      }
    }

    // Log integration event
    await prisma.integrationEvent.create({
      data: {
        type: 'STOCK_SYNC',
        payload: { event, total: items.length, created, updated, failed },
        status: failed > 0 && updated === 0 && created === 0 ? 'FAILED' : 'SUCCESS',
        processedAt: new Date(),
        ...(errors.length > 0 ? { lastError: errors.join('; ') } : {}),
      },
    });

    log.info({ event, created, updated, failed }, 'SAP webhook processed');

    return NextResponse.json({
      success: true,
      total: items.length,
      created,
      updated,
      failed,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err: any) {
    log.error({ err: err.message }, 'SAP webhook unhandled error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
