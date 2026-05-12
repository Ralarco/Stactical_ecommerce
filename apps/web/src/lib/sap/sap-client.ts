import { createLogger } from '@/lib/logger';

const log = createLogger('sap-client');

// ─── Types ───

export interface SapConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  apiKey: string;
}

export interface SapMaterial {
  ItemCode: string;
  ItemName: string;
  ItemsGroupCode: number;
  ItemType: string;
  BarCode?: string;
  QuantityOnStock: number;
  QuantityOrderedFromVendors: number;
  /** SAP prices come as arrays; we take the first */
  ItemPrices?: Array<{ PriceList: number; Price: number; Currency: string }>;
  U_Weight?: number;
  U_Dimensions?: string;
  U_Color?: string;
  U_Size?: string;
}

export interface SapStockEntry {
  ItemCode: string;
  InStock: number;
  Ordered: number;
  Committed: number;
}

export interface SapConnectionStatus {
  connected: boolean;
  latencyMs: number;
  serverVersion?: string;
  error?: string;
}

export interface SapSyncResult {
  total: number;
  created: number;
  updated: number;
  failed: number;
  errors: string[];
}

// ─── Config loader ───

function getConfig(): SapConfig {
  const baseUrl = process.env.SAP_BASE_URL || '';
  const clientId = process.env.SAP_CLIENT_ID || '';
  const clientSecret = process.env.SAP_CLIENT_SECRET || '';
  const apiKey = process.env.SAP_API_KEY || '';

  return { baseUrl, clientId, clientSecret, apiKey };
}

export function isSapConfigured(): boolean {
  const config = getConfig();
  return !!(config.baseUrl && config.clientId && config.clientSecret);
}

// ─── Token Management ───

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAuthToken(config: SapConfig): Promise<string> {
  // Return cached token if still valid (with 60s margin)
  if (cachedToken && Date.now() < tokenExpiry - 60_000) {
    return cachedToken;
  }

  log.info('Requesting new SAP auth token');

  const res = await fetch(`${config.baseUrl}/b1s/v1/Login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { 'APIKey': config.apiKey } : {}),
    },
    body: JSON.stringify({
      CompanyDB: config.clientId,
      Password: config.clientSecret,
      UserName: config.clientId,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    log.error({ status: res.status, body }, 'SAP login failed');
    throw new Error(`SAP authentication failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  cachedToken = data.SessionId;
  // SAP sessions typically last 30 minutes
  tokenExpiry = Date.now() + 30 * 60 * 1000;

  return cachedToken!;
}

// ─── Base request helper ───

async function sapFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const config = getConfig();

  if (!config.baseUrl) {
    throw new Error('SAP_BASE_URL not configured. Add it to your .env file.');
  }

  const token = await getAuthToken(config);

  const url = `${config.baseUrl}${path}`;
  const start = Date.now();

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Cookie: `B1SESSION=${token}`,
      ...(config.apiKey ? { APIKey: config.apiKey } : {}),
      ...options.headers,
    },
  });

  const latency = Date.now() - start;
  log.debug({ path, status: res.status, latencyMs: latency }, 'SAP request');

  if (!res.ok) {
    const body = await res.text();
    log.error({ path, status: res.status, body, latencyMs: latency }, 'SAP request failed');

    // If session expired, clear cache and retry once
    if (res.status === 401) {
      cachedToken = null;
      tokenExpiry = 0;
      throw new Error(`SAP session expired. Will retry on next request.`);
    }

    throw new Error(`SAP error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ─── Public API ───

/**
 * Test the connection to SAP by performing a login and a lightweight query.
 */
export async function testConnection(): Promise<SapConnectionStatus> {
  const config = getConfig();

  if (!config.baseUrl || !config.clientId || !config.clientSecret) {
    return {
      connected: false,
      latencyMs: 0,
      error: 'SAP credentials not configured. Set SAP_BASE_URL, SAP_CLIENT_ID, and SAP_CLIENT_SECRET in .env',
    };
  }

  const start = Date.now();

  try {
    await getAuthToken(config);
    const latency = Date.now() - start;
    log.info({ latencyMs: latency }, 'SAP connection test successful');
    return { connected: true, latencyMs: latency, serverVersion: 'SAP B1 Service Layer' };
  } catch (err: any) {
    const latency = Date.now() - start;
    log.error({ err: err.message, latencyMs: latency }, 'SAP connection test failed');
    return { connected: false, latencyMs: latency, error: err.message };
  }
}

/**
 * Fetch all materials (products) from SAP's Items endpoint.
 */
export async function fetchMaterials(
  top = 500,
  skip = 0,
): Promise<SapMaterial[]> {
  const data = await sapFetch<{ value: SapMaterial[] }>(
    `/b1s/v1/Items?$top=${top}&$skip=${skip}&$select=ItemCode,ItemName,ItemsGroupCode,ItemType,BarCode,QuantityOnStock,QuantityOrderedFromVendors,ItemPrices,U_Weight,U_Dimensions,U_Color,U_Size`,
  );
  return data.value;
}

/**
 * Fetch stock levels for all items.
 */
export async function fetchStockLevels(
  top = 500,
  skip = 0,
): Promise<SapStockEntry[]> {
  const data = await sapFetch<{ value: SapStockEntry[] }>(
    `/b1s/v1/Items?$top=${top}&$skip=${skip}&$select=ItemCode,QuantityOnStock,QuantityOrderedFromVendors`,
  );
  return data.value.map((item) => ({
    ItemCode: item.ItemCode,
    InStock: (item as any).QuantityOnStock ?? 0,
    Ordered: (item as any).QuantityOrderedFromVendors ?? 0,
    Committed: 0,
  }));
}

/**
 * Push an order to SAP as a Sales Order.
 */
export async function createSalesOrder(order: {
  customerCode: string;
  docDate: string;
  lines: Array<{ itemCode: string; quantity: number; price: number }>;
}): Promise<{ DocEntry: number; DocNum: number }> {
  return sapFetch('/b1s/v1/Orders', {
    method: 'POST',
    body: JSON.stringify({
      CardCode: order.customerCode,
      DocDate: order.docDate,
      DocumentLines: order.lines.map((line) => ({
        ItemCode: line.itemCode,
        Quantity: line.quantity,
        UnitPrice: line.price,
      })),
    }),
  });
}
