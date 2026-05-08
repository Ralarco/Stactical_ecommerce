/**
 * Custom application errors.
 * All errors include a machine-readable code for observability.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier: string) {
    super(
      `${resource} not found: ${identifier}`,
      'NOT_FOUND',
      404
    );
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly details?: Record<string, string[]>) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}

export class InsufficientStockError extends AppError {
  constructor(sku: string, requested: number, available: number) {
    super(
      `Insufficient stock for SKU ${sku}: requested ${requested}, available ${available}`,
      'INSUFFICIENT_STOCK',
      409
    );
    this.name = 'InsufficientStockError';
  }
}

export class PaymentError extends AppError {
  constructor(message: string, public readonly providerError?: string) {
    super(message, 'PAYMENT_ERROR', 402);
    this.name = 'PaymentError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}
