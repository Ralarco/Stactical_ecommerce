import { createLogger } from '../lib/logger';
import { getSapConfig } from '../config/sap.config';
import { SapConnectionError } from '../lib/errors/sap-error';

const log = createLogger('sap-client');

/**
 * SAP HTTP Client.
 * Handles authentication and request/response logging.
 * Spec: Section 17 — mandatory logging for SAP requests/responses.
 */
export class SapClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    const config = getSapConfig();
    this.baseUrl = config.baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
    };
  }

  async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    log.info({ method, url }, 'SAP request');

    try {
      const response = await fetch(url, {
        method,
        headers: this.headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      log.info(
        { method, url, status: response.status },
        'SAP response'
      );

      if (!response.ok) {
        throw new SapConnectionError(
          `SAP responded with ${response.status}: ${JSON.stringify(data)}`
        );
      }

      return data as T;
    } catch (error) {
      log.error({ method, url, err: error }, 'SAP request failed');
      throw error;
    }
  }
}
