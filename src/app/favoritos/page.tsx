"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/hooks/useAuth";
import { FavoritesList } from "@/features/favorites/ui/FavoritesList";
import { Loader2, Heart } from "lucide-react";

/**
 * Página de Favoritos
 * - Protegida: Redireciona para "/" se não autenticado
 * - Mostra lista de exercícios favoritos do utilizador
 */
export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redireciona para home se não autenticado
      router.push("/");
    }
  }, [user, loading, router]);

  // Estado de loading durante verificação de autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  // Se não autenticado (redundante, mas seguro)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da página */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-100 rounded-lg">
              <Heart className="h-6 w-6 text-red-600 fill-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600 mt-1">
                Your collection of favorite exercises
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de favoritos */}
      <div className="container mx-auto px-4 py-8">
        <FavoritesList />
      </div>
    </div>
  );
}
