import pino from 'pino';

/**
 * Application logger using Pino.
 * Spec: Section 17 — mandatory logging for SAP requests,
 * payment callbacks, checkout failures, stock sync failures.
 */
export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  base: {
    service: 'stactical-web',
    env: process.env.NODE_ENV,
  },
});

/** Create a child logger scoped to a specific domain */
export function createLogger(domain: string) {
  return logger.child({ domain });
}
