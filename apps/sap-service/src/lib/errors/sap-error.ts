/** SAP-specific errors */
export class SapError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly sapResponse?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SapError';
  }
}

export class SapConnectionError extends SapError {
  constructor(message: string) {
    super(message, 'SAP_CONNECTION_ERROR');
    this.name = 'SapConnectionError';
  }
}

export class SapValidationError extends SapError {
  constructor(message: string, sapResponse?: Record<string, unknown>) {
    super(message, 'SAP_VALIDATION_ERROR', 400, sapResponse);
    this.name = 'SapValidationError';
  }
}
