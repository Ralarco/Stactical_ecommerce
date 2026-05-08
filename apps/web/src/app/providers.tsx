'use client';

import { AuthProvider } from '@/features/auth/context/AuthContext';

/**
 * Client-side providers wrapper.
 * Combines all context providers in one place.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
