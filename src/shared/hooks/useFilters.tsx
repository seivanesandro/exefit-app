"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";

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

const FILTERS_STORAGE_KEY = "exefit-filters";

// Função para carregar filtros do localStorage
const loadFiltersFromStorage = (): FilterState => {
  if (typeof window === "undefined") {
    return {
      search: "",
      category: undefined,
      muscle: undefined,
    };
  }

  try {
    const stored = localStorage.getItem(FILTERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading filters from localStorage:", error);
  }

  return {
    search: "",
    category: undefined,
    muscle: undefined,
  };
};

// Função para guardar filtros no localStorage
const saveFiltersToStorage = (filters: FilterState) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error("Error saving filters to localStorage:", error);
  }
};

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>(
    loadFiltersFromStorage,
  );

  // Guardar filtros no localStorage sempre que mudarem
  useEffect(() => {
    saveFiltersToStorage(filters);
  }, [filters]);

  const setSearch = useCallback((search: string) => {
    setFiltersState((prev) => ({ ...prev, search }));
  }, []);

  const setCategory = useCallback((category?: number) => {
    setFiltersState((prev) => ({ ...prev, category }));
  }, []);

  const setMuscle = useCallback((muscle?: number) => {
    setFiltersState((prev) => ({ ...prev, muscle }));
  }, []);

  const setFilters = useCallback(
    (newFilters: { category?: number; muscle?: number }) => {
      setFiltersState((prev) => ({ ...prev, ...newFilters }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFiltersState({
      search: "",
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
    throw new Error("useFilters must be used within FilterProvider");
  }
  return context;
}
