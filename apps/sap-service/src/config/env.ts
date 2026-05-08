import { sapServiceEnvSchema, type SapServiceEnv } from '@stactical/config';

let _env: SapServiceEnv | null = null;

export function validateEnv(): SapServiceEnv {
  if (_env) return _env;

  const result = sapServiceEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    process.exit(1);
  }

  _env = result.data;
  return _env;
}
