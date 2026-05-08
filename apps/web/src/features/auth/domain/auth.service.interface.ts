import type { UserRole } from '@stactical/shared-types';

/** Session object returned by the auth service */
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

/** Credentials for authentication */
export interface Credentials {
  email: string;
  password: string;
}

/** Registration input */
export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

/**
 * Auth Service Interface.
 * All auth providers must implement this contract.
 * Initial implementation: BetterAuth.
 */
export interface IAuthService {
  createSession(credentials: Credentials): Promise<Session>;
  validateSession(token: string): Promise<Session | null>;
  destroySession(sessionId: string): Promise<void>;
  getUserRoles(userId: string): Promise<UserRole[]>;
  register(input: RegisterInput): Promise<{ userId: string }>;
}
