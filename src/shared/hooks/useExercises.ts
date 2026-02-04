import { useState, useEffect, useCallback, useRef } from "react";
import { fetchExercises } from "@/entities/exercise/api/exerciseApi";
import type {
  Exercise,
  UseExercisesParams,
  UseExercisesReturn,
} from "@/entities/types";

/**
 * Custom hook para buscar exercícios com suporte a filtros e paginação
 * @param category - ID da categoria para filtrar exercícios (server-side)
 * @param muscle - ID do músculo para filtrar exercícios (server-side)
 * @param page - Página atual para paginação (server-side)
 * @param limit - Quantidade de itens por página (server-side)
 * @note Search is disabled due to API limitations - use category/muscle filters
 */
export function useExercises({
  category,
  muscle,
  page = 1,
  limit = 5,
}: Omit<UseExercisesParams, 'search'>): UseExercisesReturn {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [totalPages, setTotalPages] = useState(1);
  const allExercisesRef = useRef<Exercise[]>([]);
  const lastFiltersRef = useRef<string>("");

  // ⭐ LIMPAR CACHE quando filtro muda (categoria ou músculo)
  useEffect(() => {
    const currentFilterKey = `${category}-${muscle}`;
    if (lastFiltersRef.current !== currentFilterKey) {
      allExercisesRef.current = []; // LIMPA CACHE
      lastFiltersRef.current = currentFilterKey;
    }
  }, [category, muscle]);

  const loadExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);

      // Se já temos exercícios em cache, usa-os (sem buscar API)
      if (allExercisesRef.current.length > 0) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const displayExercises = allExercisesRef.current.slice(startIndex, endIndex);
        setExercises(displayExercises);
        setTotalPages(Math.ceil(allExercisesRef.current.length / limit) || 1);
        setLoading(false);
        return;
      }

      const params: Record<string, string | number> = {
        language: 2, // English
        limit: 50, // Máximo permitido pela API
        offset: 0,
      };

      if (category && category !== "undefined") {
        params.category = category;
      }
      if (muscle && muscle !== "undefined") {
        params.muscles = muscle; // A API usa 'muscles' no plural
      }

      const response = await fetchExercises(params);

      if (!response || !response.results) {
        setExercises([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      const finalExercises = response.results;

      // ⭐ ORDENAR: EXERCÍCIOS COM IMAGENS SEMPRE EM PRIMEIRO ⭐
      const sortedExercises = [...finalExercises].sort((a, b) => {
        const aHasImages = a.images && a.images.length > 0;
        const bHasImages = b.images && b.images.length > 0;

        if (aHasImages && !bHasImages) return -1; // A tem imagem, B não → A vem primeiro
        if (!aHasImages && bHasImages) return 1; // B tem imagem, A não → B vem primeiro
        return 0; // Ambos têm ou não têm → ordem original
      });

      // ⭐ PAGINAÇÃO CLIENT-SIDE: Pega 5 cards da lista ordenada
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const displayExercises = sortedExercises.slice(startIndex, endIndex);
      
      // Guarda TODOS os exercícios ordenados em cache (useRef não causa re-render)
      allExercisesRef.current = sortedExercises;
      setExercises(displayExercises);

      // Calcula total de páginas com base nos exercícios ordenados
      const calculatedTotalPages = Math.ceil(sortedExercises.length / limit) || 1;
      setTotalPages(calculatedTotalPages);
    } catch (err) {
      console.error("[useExercises] Error loading exercises:", err);
      console.error("[useExercises] Error details:", JSON.stringify(err, null, 2));
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load exercises. Please try again.";
      setError(errorMessage);
      setExercises([]);
      allExercisesRef.current = [];
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [category, muscle, limit, page]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  return {
    exercises: exercises,
    loading,
    error,
    totalPages,
    currentPage: page,
    refetch: loadExercises,
  };
}
