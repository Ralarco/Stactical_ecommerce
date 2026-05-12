'use server';

import { prisma } from '@/lib/db/prisma';
import { handleAction } from '@/lib/errors/error-handler';
import {
  testConnection,
  isSapConfigured,
  syncMaterials,
  syncStock,
} from '@/lib/sap';

// ─── Test Connection ───

export async function testSapConnectionAction() {
  return handleAction(async () => {
    const result = await testConnection();
    return result;
  });
}

// ─── Check if SAP is configured ───

export async function checkSapConfigAction() {
  return handleAction(async () => {
    return {
      configured: isSapConfigured(),
      baseUrl: process.env.SAP_BASE_URL || '',
      hasCredentials: !!(process.env.SAP_CLIENT_ID && process.env.SAP_CLIENT_SECRET),
    };
  });
}

// ─── Full Material Sync ───

export async function syncMaterialsAction() {
  return handleAction(async () => {
    const result = await syncMaterials();
    return result;
  });
}

// ─── Stock-only Sync ───

export async function syncStockAction() {
  return handleAction(async () => {
    const result = await syncStock();
    return result;
  });
}

// ─── Get Integration Events (log) ───

export async function getIntegrationEventsAction(limit = 20) {
  return handleAction(async () => {
    const events = await prisma.integrationEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return JSON.parse(JSON.stringify(events));
  });
}

// ─── Get sync stats ───

export async function getSapStatsAction() {
  return handleAction(async () => {
    const [totalProducts, syncedProducts, pendingProducts, failedProducts, lastEvent] = await Promise.all([
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.product.count({ where: { sapSyncStatus: 'SUCCESS', deletedAt: null } }),
      prisma.product.count({ where: { sapSyncStatus: 'PENDING', deletedAt: null } }),
      prisma.product.count({ where: { sapSyncStatus: 'FAILED', deletedAt: null } }),
      prisma.integrationEvent.findFirst({
        where: { type: 'STOCK_SYNC', status: 'SUCCESS' },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      totalProducts,
      syncedProducts,
      pendingProducts,
      failedProducts,
      lastSyncAt: lastEvent?.processedAt?.toISOString() || null,
    };
  });
}
