/**
 * Sentry initialization for Next.js.
 * Spec: Section 16 — Sentry for error tracking.
 */
export function initSentry() {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    console.warn('[Sentry] DSN not configured — error tracking disabled.');
    return;
  }

  // Dynamic import to avoid bundling Sentry when not configured
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: process.env.NODE_ENV === 'development',
    });
  });
}
