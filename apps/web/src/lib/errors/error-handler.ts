import { createLogger } from '@/lib/logger';
import { AppError } from './app-error';

const log = createLogger('error-handler');

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

/**
 * Wraps a Server Action with error handling.
 * Returns a serializable ActionResult instead of throwing.
 */
export async function handleAction<T>(
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    if (error instanceof AppError) {
      log.warn({ code: error.code, statusCode: error.statusCode }, error.message);
      return { success: false, error: error.message, code: error.code };
    }

    log.error({ err: error }, 'Unhandled error in action');
    return {
      success: false,
      error: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
    };
  }
}
