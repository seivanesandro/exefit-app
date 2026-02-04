"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/shared/hooks/useAuth";
import { ExerciseCard, ExerciseCardSkeleton } from "@/entities/exercise/ui/ExerciseCard";
import { fetchExerciseById } from "@/entities/exercise/api/exerciseApi";
import { removeFavorite, subscribeFavorites, type Favorite } from "@/entities/favorite/api/favoriteApi";
import type { Exercise } from "@/entities/types";
import { Heart } from "lucide-react";

/**
 * Componente que lista todos os favoritos do utilizador
 * - Sincronização em tempo real com Firestore
 * - Estado vazio quando não há favoritos
 * - Botão remover em cada card
 */
export function FavoritesList() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  // Listener em tempo real dos favoritos
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setExercises([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeFavorites(user.uid, (updatedFavorites) => {
      setFavorites(updatedFavorites);
      loadExercises(updatedFavorites);
    });

    return () => unsubscribe();
  }, [user]);

  // Carregar detalhes dos exercícios favoritos
  const loadExercises = async (favs: Favorite[]) => {
    setLoading(true);
    try {
      const exercisePromises = favs.map((fav) =>
        fetchExerciseById(fav.exerciseId).catch(() => null)
      );
      const exerciseResults = await Promise.all(exercisePromises);
      const validExercises = exerciseResults.filter(
        (ex): ex is Exercise => ex !== null
      );
      setExercises(validExercises);
    } catch (error) {
      console.error("[FavoritesList] Error loading exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler para remover favorito
  const handleRemoveFavorite = async (exerciseId: number) => {
    if (!user) return;
    try {
      await removeFavorite(user.uid, exerciseId);
    } catch (error) {
      console.error("[FavoritesList] Error removing favorite:", error);
    }
  };

  // Estado de loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ExerciseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Estado vazio
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="mb-6 p-6 bg-gray-100 rounded-full">
          <Heart className="h-16 w-16 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          No favorites yet
        </h2>
        <p className="text-gray-600 max-w-md mb-8">
          You don&apos;t have any favorites yet. Start exploring exercises and add
          them to your favorites by clicking the heart icon.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold inline-block"
        >
          Browse Exercises
        </Link>
      </div>
    );
  }

  // Lista de favoritos
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Your Favorites ({favorites.length})
        </h2>
        <p className="text-gray-600 mt-1">
          Manage your favorite exercises here
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isFavorite={true}
            onFavoriteToggle={() => handleRemoveFavorite(exercise.id)}
          />
        ))}
      </div>
    </div>
  );
}
