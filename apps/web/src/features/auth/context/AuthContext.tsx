'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

/**
 * Auth Context — Client-side session state.
 * TODO: Replace with BetterAuth session management.
 *
 * This is a temporary mock that persists state in memory only.
 * It will be replaced when BetterAuth is fully integrated.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load session from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('stactical_mock_session');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored session');
      }
    }
    setIsLoaded(true);
  }, []);

  const login = useCallback((userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('stactical_mock_session', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('stactical_mock_session');
  }, []);

  // Avoid hydration mismatch by not rendering authenticated UI until client is loaded
  if (!isLoaded) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          isAuthenticated: false,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Default value for SSR / outside provider */
const defaultAuthValue: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  // Return safe default during SSR or if provider is not yet mounted
  return context ?? defaultAuthValue;
}
