import type { IPaymentProvider } from '../domain/payment-provider.interface';
import { TransbankWebpayProvider } from './providers/transbank-webpay.provider';

/** Registry of available payment providers */
const providers: Record<string, () => IPaymentProvider> = {
  'transbank-webpay-plus': () => new TransbankWebpayProvider(),
  // Future: 'stripe': () => new StripeProvider(),
  // Future: 'mercadopago': () => new MercadoPagoProvider(),
};

/**
 * Factory for creating payment provider instances.
 * Decouples business logic from specific provider implementations.
 */
export function createPaymentProvider(name?: string): IPaymentProvider {
  const providerName = name ?? 'transbank-webpay-plus';
  const factory = providers[providerName];

  if (!factory) {
    throw new Error(`Unknown payment provider: ${providerName}`);
  }

  return factory();
}
