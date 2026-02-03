import { useState, useEffect, useCallback } from 'react';
import { fetchExercises } from '@/entities/exercise/api/exerciseApi';
import type { Exercise } from '@/entities/types';

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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [totalPages, setTotalPages] = useState(1);

  const loadExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      const offset = (page - 1) * limit;
      
      const params: Record<string, string | number> = {
        language: 2, // English
        limit,
        offset,
      };

      if (category) {
        params.category = category;
      }
      if (muscle) {
        params.muscles = muscle;
      }
      if (search) {
        params.name = search;
      }

      const response = await fetchExercises(params);

      // Ordenar: exercícios COM imagens primeiro, SEM imagens depois
      const sortedExercises = response.results.sort((a, b) => {
        const aHasImages = a.images && a.images.length > 0;
        const bHasImages = b.images && b.images.length > 0;

        if (aHasImages && !bHasImages) return -1;
        if (!aHasImages && bHasImages) return 1;
        return 0;
      });

      setExercises(sortedExercises);
      
      // Calcular total de páginas baseado no count da API
      const totalCount = response.count || 0;
      const calculatedTotalPages = Math.ceil(totalCount / limit);
      setTotalPages(calculatedTotalPages);
    } catch (err) {
      console.error('Error loading exercises:', err);
      setError('Failed to load exercises. Please try again.');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, muscle, page, limit]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  return {
    exercises,
    loading,
    error,
    totalPages,
    currentPage: page,
    refetch: loadExercises,
  };
}
