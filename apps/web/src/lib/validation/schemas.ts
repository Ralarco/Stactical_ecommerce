import { z } from 'zod';

/** Reusable address validation schema */
export const addressSchema = z.object({
  street: z.string().min(1, 'Calle es requerida'),
  number: z.string().min(1, 'Número es requerido'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'Ciudad es requerida'),
  region: z.string().min(1, 'Región es requerida'),
  postalCode: z.string().min(1, 'Código postal es requerido'),
  country: z.string().default('CL'),
});

/** Checkout form validation */
export const checkoutSchema = z.object({
  cartId: z.string().cuid2(),
  customerName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  customerEmail: z.string().email('Email inválido'),
  customerPhone: z.string().optional(),
  billingAddress: addressSchema,
  shippingAddress: addressSchema,
});

/** Pagination params validation */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

/** Search params validation */
export const searchSchema = z.object({
  query: z.string().optional(),
  categorySlug: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy: z.enum(['name', 'price', 'newest']).default('newest'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
