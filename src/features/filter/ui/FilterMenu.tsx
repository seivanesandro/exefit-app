"use client";

import { useState, useEffect, memo } from "react";
import {
  Dumbbell,
  Target,
  Zap,
  Activity,
  Heart,
  TrendingUp,
  Bike,
  Weight,
  Waves,
  Loader2,
  FunnelX,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import {
  fetchCategories,
  fetchMuscles,
} from "@/entities/exercise/api/exerciseApi";
import type { Category, Muscle, FilterMenuProps } from "@/entities/types";
import { useFilters } from "@/shared/hooks/useFilters";

const categoryIcons: Record<number, React.ReactNode> = {
  8: <Dumbbell className="h-4 w-4" />,
  9: <Target className="h-4 w-4" />,
  10: <Zap className="h-4 w-4" />,
  11: <Activity className="h-4 w-4" />,
  12: <Heart className="h-4 w-4" />,
  13: <TrendingUp className="h-4 w-4" />,
  14: <Bike className="h-4 w-4" />,
  15: <Weight className="h-4 w-4" />,
};

const muscleIcons: Record<number, React.ReactNode> = {
  1: <Dumbbell className="h-4 w-4" />,
  2: <Activity className="h-4 w-4" />,
  3: <Target className="h-4 w-4" />,
  4: <Zap className="h-4 w-4" />,
  5: <Heart className="h-4 w-4" />,
  6: <Weight className="h-4 w-4" />,
  7: <TrendingUp className="h-4 w-4" />,
  8: <Waves className="h-4 w-4" />,
};

export const FilterMenu = memo(function FilterMenu({ onFilterChange }: FilterMenuProps) {
  const { filters, clearFilters: clearGlobalFilters } = useFilters();
  const [categories, setCategories] = useState<Category[]>([]);
  const [muscles, setMuscles] = useState<Muscle[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      setLoading(true);
      const [categoriesData, musclesData] = await Promise.all([
        fetchCategories(),
        fetchMuscles(),
      ]);
      setCategories(categoriesData);
      setMuscles(musclesData);
      setError(null);
    } catch (err) {
      console.error("Error loading filters:", err);
      setError("Failed to load filters");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    const newCategory =
      filters.category === categoryId ? undefined : categoryId;
    // ⭐ Quando seleciona categoria, LIMPA o músculo
    onFilterChange({ category: newCategory, muscle: undefined });
  };

  const handleMuscleClick = (muscleId: number) => {
    const newMuscle = filters.muscle === muscleId ? undefined : muscleId;
    // ⭐ Quando seleciona músculo, LIMPA a categoria
    onFilterChange({ category: undefined, muscle: newMuscle });
  };

  const clearFilters = async () => {
    setClearing(true);
    clearGlobalFilters();
    onFilterChange({});
    await new Promise((resolve) => setTimeout(resolve, 500));
    setClearing(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive text-center py-4">{error}</p>
        <Button onClick={loadFilters} variant="outline" className="w-full">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Clear Filters Button */}
      {(filters.category || filters.muscle) && (
        <Button
          onClick={clearFilters}
          disabled={clearing}
          className=" w-auto px-3 text-white bg-[var(--destructive)] hover:bg-[var(--destructive-b)] font-semibold cursor-pointer"
        >
          {clearing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            <FunnelX className="w-5 h-5" />
          )}
        </Button>
      )}

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Categories</h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              variant={filters.category === category.id ? "default" : "ghost"}
              className="w-full justify-start cursor-pointer"
            >
              {categoryIcons[category.id] || <Dumbbell className="h-4 w-4" />}
              <span className="ml-2">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Muscles */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Muscle Groups</h3>
        <div className="space-y-1">
          {muscles.map((muscle) => (
            <Button
              key={muscle.id}
              onClick={() => handleMuscleClick(muscle.id)}
              variant={filters.muscle === muscle.id ? "default" : "ghost"}
              className="w-full justify-start cursor-pointer"
            >
              {muscleIcons[muscle.id] || <Activity className="h-4 w-4" />}
              <span className="ml-2">{muscle.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
});
