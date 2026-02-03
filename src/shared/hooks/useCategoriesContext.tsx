"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchCategories } from "@/entities/exercise/api/exerciseApi";
import type { Category } from "@/entities/types";

interface CategoriesContextValue {
  categories: Category[];
  loading: boolean;
  getCategoryName: (id: number) => string;
}

const CategoriesContext = createContext<CategoriesContextValue | undefined>(
  undefined,
);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const getCategoryName = (id: number): string => {
    const category = categories.find((c) => c.id === id);
    return category?.name || `Category ${id}`;
  };

  return (
    <CategoriesContext.Provider
      value={{ categories, loading, getCategoryName }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within CategoriesProvider");
  }
  return context;
}
