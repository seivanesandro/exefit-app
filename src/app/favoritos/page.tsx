"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { subscribeFavorites, removeFavorite } from "@/entities/favorite/api/favoriteApi";
import { ExerciseCard, ExerciseCardSkeleton } from "@/entities/exercise/ui/ExerciseCard";
import { fetchExerciseById } from "@/entities/exercise/api/exerciseApi";
import { getCachedExercise } from "@/shared/lib/cache";
import type { Exercise } from "@/entities/types";
import { Heart } from "lucide-react";
import Link from "next/link";

/**
 * Componente para um único card de favorito.
 * Gere o seu próprio estado de carregamento e renderiza-se de forma independente.
 * Optimização: Usa cache local antes de fazer pedidos à API.
 */
function FavoriteItem({ favoriteId, onRemove }: { favoriteId: number; onRemove: (id: number) => void; }) {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Carrega os dados do exercício, priorizando o cache local.
     * Só faz pedido à API WGER se não existir no cache (optimização de performance).
     */
    const loadExercise = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Tenta buscar do cache local primeiro
        let exerciseData = await getCachedExercise(favoriteId);

        // 2. Se não estiver no cache, busca na API remota
        if (!exerciseData) {
          console.log(`[Cache Miss] A buscar exercício ${favoriteId} da API.`);
          exerciseData = await fetchExerciseById(favoriteId);
        } else {
          console.log(`[Cache Hit] Exercício ${favoriteId} carregado do cache.`);
        }

        if (exerciseData) {
          setExercise(exerciseData);
        } else {
          throw new Error("Dados do exercício não encontrados.");
        }
      } catch (err) {
        console.error(`[Favorites] Falha ao carregar exercício ${favoriteId}:`, err);
        setError("Falha ao carregar este exercício. Pode ter sido removido.");
      } finally {
        setIsLoading(false);
      }
    };

    loadExercise();
  }, [favoriteId]);

  // Mostra skeleton enquanto o exercício está a carregar
  if (isLoading) {
    return <ExerciseCardSkeleton />;
  }

  // Tratamento de erro visível: mostra mensagem se o exercício não carregar
  if (error || !exercise) {
    return (
      <div className="flex h-full min-h-[250px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-red-500/50 bg-red-500/10 p-4 text-center text-red-400">
        <p className="font-semibold">Erro ao Carregar Favorito</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // Renderiza o card do exercício quando os dados estão disponíveis
  return (
    <ExerciseCard
      exercise={exercise}
      isFavorite={true}
      onFavoriteToggle={() => onRemove(exercise.id)}
    />
  );
}

/**
 * Página de Favoritos
 * Mostra todos os exercícios marcados como favoritos pelo utilizador.
 * Optimizações implementadas:
 * - Cache local: Verifica cache antes de fazer pedidos à API
 * - Renderização progressiva: Cada card carrega independentemente
 * - Tratamento de erros: Erros visíveis para o utilizador
 */
export default function FavoritesPage() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Se não houver utilizador autenticado, não há nada a carregar
    if (!user) {
      return;
    }

    // Subscreve às alterações nos favoritos em tempo real (Firebase)
    const unsubscribe = subscribeFavorites(user.uid, (updatedFavorites) => {
      const ids = updatedFavorites.map((fav) => fav.exerciseId);
      setFavoriteIds(ids);
      setIsLoading(false);
    });

    // Limpa a subscrição quando o componente é desmontado
    return () => unsubscribe();
  }, [user]);

  /**
   * Remove um exercício dos favoritos do utilizador
   */
  const handleRemoveFavorite = async (exerciseId: number) => {
    if (!user) return;
    try {
      await removeFavorite(user.uid, exerciseId);
    } catch (error) {
      console.error("[FavoritesPage] Erro ao remover favorito:", error);
    }
  };

  // Estado de carregamento: Mostra skeletons enquanto os favoritos são carregados
  // Só mostra loading se houver utilizador autenticado
  if (isLoading && user) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ExerciseCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Utilizador não autenticado: Pede para fazer login
  if (!user) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="container mx-auto max-w-7xl text-center py-20">
          <h1 className="text-3xl font-bold mb-4">Favorites</h1>
          <p className="text-muted-foreground">Please log in to see your favorite exercises.</p>
        </div>
      </main>
    );
  }

  // Sem favoritos: Mostra mensagem e link para explorar exercícios
  if (favoriteIds.length === 0) {
    return (
      <main className="min-h-screen p-4 md:p-8">
        <div className="container mx-auto max-w-7xl flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="mb-6 p-6 bg-gray-100 rounded-full">
            <Heart className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            No favorites yet
          </h2>
          <p className="text-gray-600 max-w-md mb-8">
            You haven&apos;t added any exercises to your favorites. Start exploring and click the heart icon to save them.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold inline-block"
          >
            Browse Exercises
          </Link>
        </div>
      </main>
    );
  }

  // Renderiza a lista de favoritos
  // Cada FavoriteItem carrega-se de forma independente e progressiva
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Your Favorites ({favoriteIds.length})</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteIds.map((id) => (
            <FavoriteItem key={id} favoriteId={id} onRemove={handleRemoveFavorite} />
          ))}
        </div>
      </div>
    </main>
  );
}