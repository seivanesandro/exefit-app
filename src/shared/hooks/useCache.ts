"use client";

import { useState, useCallback, useEffect } from "react";
import { CacheItem } from "@/entities/types";

/**
 * Configuração padrão do cache
 */
const DEFAULT_EXPIRATION = 1000 * 60 * 60; // 1 hora em ms

/**
 * Hook customizado para gerir cache no localStorage de forma reativa
 */
export function useCache<T>(
  key: string,
  expirationTime: number = DEFAULT_EXPIRATION,
) {
  const [cachedData, setCachedData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Verifica se está no ambiente do browser (SSR-safe)
   */
  const isBrowser = typeof window !== "undefined";

  /**
   * Verifica se o cache ainda é válido baseado no timestamp
   */
  const isCacheValid = useCallback((cacheItem: CacheItem<T>): boolean => {
    const now = Date.now();
    return now - cacheItem.timestamp < cacheItem.expiresIn;
  }, []);

  /**
   * Recupera dados do cache
   */
  const getCache = useCallback((): T | null => {
    if (!isBrowser) return null;

    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);

      if (!isCacheValid(cacheItem)) {
        // Cache expirado
        localStorage.removeItem(key);
        return null;
      }

      setCachedData(cacheItem.data);
      return cacheItem.data;
    } catch (err) {
      console.error(`[useCache] Error reading cache for key "${key}":`, err);
      setError("Failed to read cache");
      return null;
    }
  }, [isBrowser, key, isCacheValid]);

  /**
   * Guarda dados no cache com timestamp e expiração
   */
  const setCache = useCallback(
    (data: T): void => {
      if (!isBrowser) return;

      setIsLoading(true);
      setError(null);

      try {
        const cacheItem: CacheItem<T> = {
          data,
          timestamp: Date.now(),
          expiresIn: expirationTime,
        };

        localStorage.setItem(key, JSON.stringify(cacheItem));
        setCachedData(data);
      } catch (err) {
        console.error(`[useCache] Error setting cache for key "${key}":`, err);
        setError("Failed to set cache");
      } finally {
        setIsLoading(false);
      }
    },
    [isBrowser, key, expirationTime],
  );

  /**
   * Remove cache específico ou limpa todo o cache do ExeFit
   */
  const clearCache = useCallback(
    (specificKey?: string): void => {
      if (!isBrowser) return;

      try {
        if (specificKey) {
          // Remove cache específico
          localStorage.removeItem(specificKey);
          if (specificKey === key) {
            setCachedData(null);
          }
        } else {
          // Remove apenas caches do ExeFit
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const storageKey = localStorage.key(i);
            if (storageKey?.startsWith("exefit_")) {
              keysToRemove.push(storageKey);
            }
          }
          keysToRemove.forEach((k) => localStorage.removeItem(k));
          setCachedData(null);
        }
      } catch (err) {
        console.error("[useCache] Error clearing cache:", err);
        setError("Failed to clear cache");
      }
    },
    [isBrowser, key],
  );

  /**
   * Atualiza o estado inicial ao montar o componente
   */
  useEffect(() => {
    if (isBrowser) {
      const initialCache = getCache();
      if (initialCache) {
        setCachedData(initialCache);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrowser, key]);

  return {
    data: cachedData,
    isLoading,
    error,
    setCache,
    getCache,
    clearCache,
    isCacheValid,
  };
}

/**
 * Função utilitária standalone para limpar todo o cache do ExeFit
 */
export function clearAllExeFitCache(): void {
  if (typeof window === "undefined") return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("exefit_")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    console.log(`[useCache] Cleared ${keysToRemove.length} cache entries`);
  } catch (err) {
    console.error("[useCache] Error clearing all cache:", err);
  }
}
