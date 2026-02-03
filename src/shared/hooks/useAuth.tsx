"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  loginWithGoogle,
  logout as firebaseLogout,
} from "@/features/auth/model/authService";
import type {
  User,
  AuthContextValue,
  AuthProviderProps,
} from "@/entities/types";

/**
 * Context de autenticação
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Provider de autenticação
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Faz login com Google OAuth
   */
  const handleLogin = useCallback<() => Promise<void>>(async () => {
    try {
      const userData = await loginWithGoogle();
      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  /**
   * Faz logout
   */
  const handleLogout = useCallback<() => Promise<void>>(async () => {
    try {
      await firebaseLogout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      loading,
      login: handleLogin,
      logout: handleLogout,
      isAuthenticated: user !== null,
    }),
    [user, loading, handleLogin, handleLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar contexto de autenticação
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
