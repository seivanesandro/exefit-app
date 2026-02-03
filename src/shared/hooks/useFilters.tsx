'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface FilterState {
  search: string;
  category?: number;
  muscle?: number;
}

interface FilterContextValue {
  filters: FilterState;
  setSearch: (search: string) => void;
  setCategory: (category?: number) => void;
  setMuscle: (muscle?: number) => void;
  setFilters: (filters: { category?: number; muscle?: number }) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>({
    search: '',
    category: undefined,
    muscle: undefined,
  });

  const setSearch = useCallback((search: string) => {
    setFiltersState((prev) => ({ ...prev, search }));
  }, []);

  const setCategory = useCallback((category?: number) => {
    setFiltersState((prev) => ({ ...prev, category }));
  }, []);

  const setMuscle = useCallback((muscle?: number) => {
    setFiltersState((prev) => ({ ...prev, muscle }));
  }, []);

  const setFilters = useCallback((newFilters: { category?: number; muscle?: number }) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({
      search: '',
      category: undefined,
      muscle: undefined,
    });
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
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
}
