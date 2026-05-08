import { z } from 'zod';

/**
 * Shared environment variable schema.
 * Each app extends this with app-specific vars.
 */
export const baseEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_SIZE: z.coerce.number().int().positive().default(10),
});

/** Web app environment schema */
export const webEnvSchema = baseEnvSchema.extend({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  TRANSBANK_COMMERCE_CODE: z.string(),
  TRANSBANK_API_KEY: z.string(),
  TRANSBANK_ENVIRONMENT: z.enum(['integration', 'production']).default('integration'),
  PAYMENT_WEBHOOK_SECRET: z.string(),
  SENTRY_DSN: z.string().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
});

/** SAP service environment schema */
export const sapServiceEnvSchema = baseEnvSchema.extend({
  SAP_BASE_URL: z.string().url(),
  SAP_CLIENT_ID: z.string(),
  SAP_CLIENT_SECRET: z.string(),
  SAP_API_KEY: z.string(),
  SENTRY_DSN: z.string().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
});

export type WebEnv = z.infer<typeof webEnvSchema>;
export type SapServiceEnv = z.infer<typeof sapServiceEnvSchema>;
