"use client";

import { useState, useMemo, useEffect } from "react";
import { Dumbbell } from "lucide-react";
import { Sidebar } from "@/widgets/sidebar/Sidebar";
import { ExerciseGrid } from "@/widgets/exercise-grid/ExerciseGrid";
import { useFilters } from "@/shared/hooks/useFilters";
import { useExercises } from "@/shared/hooks/useExercises";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  fetchCategories,
  fetchMuscles,
} from "@/entities/exercise/api/exerciseApi";
import { addFavorite, removeFavorite, subscribeFavorites, type Favorite } from "@/entities/favorite/api/favoriteApi";
import type { Category, Muscle } from "@/entities/types";

function ExerciseContent() {
  const { filters } = useFilters();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const { exercises, loading, error, totalPages } = useExercises({
    category: filters.category?.toString(),
    muscle: filters.muscle?.toString(),
    page: currentPage,
    limit: 5, // 5 cards por página
  });

  // Listener de favoritos em tempo real
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeFavorites(user.uid, (updatedFavorites) => {
      setFavorites(updatedFavorites);
    });

    return () => unsubscribe();
  }, [user]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFavoriteToggle = async (exerciseId: number) => {
    if (!user) return;

    const isFav = favorites.some((f) => f.exerciseId === exerciseId);
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    try {
      if (isFav) {
        await removeFavorite(user.uid, exerciseId);
      } else {
        await addFavorite(user.uid, {
          id: exercise.id,
          name: exercise.name,
          category: exercise.category,
        });
      }
    } catch (error) {
      console.error("[HomePage] Error toggling favorite:", error);
    }
  };

  return (
    <ExerciseGrid
      exercises={exercises}
      isLoading={loading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      favorites={favorites.map((f) => f.exerciseId)}
      onFavoriteToggle={handleFavoriteToggle}
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
