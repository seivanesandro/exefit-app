"use client";

import { useState, useMemo, useEffect } from "react";
import { Dumbbell } from "lucide-react";
import { Sidebar } from "@/widgets/sidebar/Sidebar";
import { ExerciseGrid } from "@/widgets/exercise-grid/ExerciseGrid";
import { useFilters } from "@/shared/hooks/useFilters";
import { useExercises } from "@/shared/hooks/useExercises";
import {
  fetchCategories,
  fetchMuscles,
} from "@/entities/exercise/api/exerciseApi";
import type { Category, Muscle } from "@/entities/types";

function ExerciseContent() {
  const { filters } = useFilters();
  const [currentPage, setCurrentPage] = useState(1);

  const { exercises, loading, error, totalPages } = useExercises({
    search: filters.search,
    category: filters.category?.toString(),
    muscle: filters.muscle?.toString(),
    page: currentPage,
    limit: 5, // Default: 5 cards per page
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ExerciseGrid
      exercises={exercises}
      isLoading={loading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}

export default function HomePage() {
  const { filters } = useFilters();
  const [categories, setCategories] = useState<Category[]>([]);
  const [muscles, setMuscles] = useState<Muscle[]>([]);

  // Create a key based on filters to reset component state when filters change
  const filterKey = useMemo(
    () => `${filters.category}-${filters.muscle}-${filters.search}`,
    [filters.category, filters.muscle, filters.search],
  );

  // Load categories and muscles for filter names
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [categoriesData, musclesData] = await Promise.all([
          fetchCategories(),
          fetchMuscles(),
        ]);
        setCategories(categoriesData);
        setMuscles(musclesData);
      } catch (error) {
        console.error("Error loading filter data:", error);
      }
    };
    loadFilterData();
  }, []);

  // Get active filter name
  const activeFilterName = useMemo(() => {
    if (filters.search) {
      return `Search: "${filters.search}"`;
    }
    if (filters.category) {
      const category = categories.find((c) => c.id === filters.category);
      return category ? `Category: ${category.name}` : null;
    }
    if (filters.muscle) {
      const muscle = muscles.find((m) => m.id === filters.muscle);
      return muscle ? `Muscle: ${muscle.name}` : null;
    }
    return null;
  }, [filters, categories, muscles]);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <Sidebar />

      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <Dumbbell className="h-8 w-8 mr-2" />
            <h1 className="text-4xl font-bold">ExeFit</h1>
          </div>

          <p className="text-lg text-muted-foreground">
            Pilates & Fitness Exercises Library
          </p>

          {/* Active Filter Badge */}
          {activeFilterName && (
            <div className="mt-4">
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                {activeFilterName}
              </span>
            </div>
          )}
        </div>

        <ExerciseContent key={filterKey} />
      </div>
    </main>
  );
}
