"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";
import type {
  FilterState,
  FilterContextValue,
  FilterProviderProps,
} from "@/entities/types";

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

const FILTERS_STORAGE_KEY = "exefit-filters";

const defaultFilters: FilterState = {
  search: "",
  category: undefined,
  muscle: undefined,
};

// Store para gerenciar filtros
class FiltersStore {
  private listeners = new Set<() => void>();
  private filters: FilterState = defaultFilters;

  constructor() {
    // Carregar do localStorage apenas no cliente
    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(FILTERS_STORAGE_KEY);
      if (stored) {
        this.filters = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading filters from localStorage:", error);
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(this.filters));
    } catch (error) {
      console.error("Error saving filters to localStorage:", error);
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot() {
    return this.filters;
  }

  getServerSnapshot() {
    return defaultFilters;
  }

  setFilters(newFilters: Partial<FilterState>) {
    this.filters = { ...this.filters, ...newFilters };
    this.saveToStorage();
    this.listeners.forEach((listener) => listener());
  }

  clearFilters() {
    this.filters = defaultFilters;
    this.saveToStorage();
    this.listeners.forEach((listener) => listener());
  }
}

const filtersStore = new FiltersStore();

export function FilterProvider({ children }: FilterProviderProps) {
  const filters = useSyncExternalStore(
    filtersStore.subscribe.bind(filtersStore),
    filtersStore.getSnapshot.bind(filtersStore),
    filtersStore.getServerSnapshot.bind(filtersStore)
  );

  const setSearch = useCallback((search: string) => {
    filtersStore.setFilters({ search });
  }, []);

  const setCategory = useCallback((category?: number) => {
    filtersStore.setFilters({ category });
  }, []);

  const setMuscle = useCallback((muscle?: number) => {
    filtersStore.setFilters({ muscle });
  }, []);

  const setFilters = useCallback(
    (newFilters: { category?: number; muscle?: number }) => {
      filtersStore.setFilters(newFilters);
    },
    [],
  );

  const clearFilters = useCallback(() => {
    filtersStore.clearFilters();
  }, []);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setSearch,
        setCategory,
        setMuscle,
        setFilters,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within FilterProvider");
  }
  return context;
}
