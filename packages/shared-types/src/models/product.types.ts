export type Product = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  categoryId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Variant = {
  id: string;
  productId: string;
  sku: string;
  sapMaterialCode: string | null;
  size: string | null;
  color: string | null;
  barcode: string | null;
  /** Always use Decimal in domain logic; string for serialization */
  price: string;
  availableStock: number;
  reservedStock: number;
  incomingStock: number;
  weight: string | null;
  dimensions: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
