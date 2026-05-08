import pino from 'pino';

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  base: { service: 'stactical-sap-service', env: process.env.NODE_ENV },
});

export function createLogger(domain: string) {
  return logger.child({ domain });
}
