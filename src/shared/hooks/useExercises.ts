import { useState, useEffect, useCallback } from "react";
import { fetchExercises } from "@/entities/exercise/api/exerciseApi";
import type { Exercise } from "@/entities/types";

interface UseExercisesParams {
  search?: string;
  category?: string;
  muscle?: string;
  page?: number;
  limit?: number;
}

interface UseExercisesReturn {
  exercises: Exercise[];
  loading: boolean;
  error: string | undefined;
  totalPages: number;
  currentPage: number;
  refetch: () => Promise<void>;
}

/**
 * Custom hook para buscar exercícios com suporte a filtros e paginação
 * @param filters - Filtros de pesquisa (search, category, muscle)
 * @param page - Página atual (default: 1)
 * @param limit - Quantidade de cards por página (default: 5)
 */
export function useExercises({
  search,
  category,
  muscle,
  page = 1,
  limit = 5,
}: UseExercisesParams): UseExercisesReturn {
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [totalPages, setTotalPages] = useState(1);

  const loadExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const params: Record<string, string | number> = {
        language: 2, // English
        limit: 50, // Buscar 50 exercícios para balance entre performance e ordenação
        offset: 0,
      };

      if (category && category !== "undefined") {
        params.category = category;
      }
      if (muscle && muscle !== "undefined") {
        params.muscles = muscle;
      }

      const response = await fetchExercises(params);

      if (!response || !response.results) {
        setAllExercises([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      // Filtrar exercícios localmente por nome se search existir
      let finalExercises = response.results;
      if (search && search.trim()) {
        const searchLower = search.toLowerCase();
        finalExercises = finalExercises.filter((exercise) => {
          const name = exercise.name?.toLowerCase() || "";
          return name.includes(searchLower);
        });
      }

      // Ordenar: exercícios COM imagens primeiro, SEM imagens depois
      const sortedExercises = [...finalExercises].sort((a, b) => {
        const aHasImages = a.images && a.images.length > 0;
        const bHasImages = b.images && b.images.length > 0;

        if (aHasImages && !bHasImages) return -1;
        if (!aHasImages && bHasImages) return 1;
        return 0;
      });

      setAllExercises(sortedExercises);

      // Calcular total de páginas baseado nos resultados filtrados e ordenados
      const totalCount = sortedExercises.length;
      const calculatedTotalPages = Math.ceil(totalCount / limit) || 1; // Garante que é no mínimo 1
      setTotalPages(calculatedTotalPages);
    } catch (err) {
      console.error("Error loading exercises:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load exercises. Please try again.";
      setError(errorMessage);
      setAllExercises([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, category, muscle, limit]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  // Paginação local (client-side)
  const paginatedExercises = allExercises.slice(
    (page - 1) * limit,
    page * limit,
  );

  return {
    exercises: paginatedExercises,
    loading,
    error,
    totalPages,
    currentPage: page,
    refetch: loadExercises,
  };
}
