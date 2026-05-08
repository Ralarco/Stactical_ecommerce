/**
 * OpenTelemetry tracing setup.
 * Spec: Section 16 — distributed tracing.
 *
 * TODO: Configure when OTEL_EXPORTER_OTLP_ENDPOINT is set.
 */
export function initTracing() {
  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

  if (!endpoint) {
    console.warn('[Tracing] OTLP endpoint not configured — tracing disabled.');
    return;
  }

  // Tracing initialization will be added when the observability
  // infrastructure is provisioned.
  console.log(`[Tracing] Configured with endpoint: ${endpoint}`);
}
