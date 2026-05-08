import { validateEnv } from './env';

/** SAP connection configuration */
export function getSapConfig() {
  const env = validateEnv();

  return {
    baseUrl: env.SAP_BASE_URL,
    clientId: env.SAP_CLIENT_ID,
    clientSecret: env.SAP_CLIENT_SECRET,
    apiKey: env.SAP_API_KEY,
  };
}
