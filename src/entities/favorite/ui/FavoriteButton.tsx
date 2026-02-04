"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/shared/hooks/useAuth";
import { addFavorite, removeFavorite, isFavorite } from "@/entities/favorite/api/favoriteApi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

interface FavoriteButtonProps {
  exerciseId: number;
  exerciseName: string;
  categoryId: number;
  className?: string;
}

/**
 * Botão de favorito com animação e tooltip
 * - Se não autenticado: desabilitado com tooltip "Please log in"
 * - Se autenticado: ativo com estado (favorito/não favorito)
 * - Animação scale ao clicar
 */
export function FavoriteButton({
  exerciseId,
  exerciseName,
  categoryId,
  className = "",
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Verificar se é favorito ao montar
  useEffect(() => {
    if (user) {
      checkFavorite();
    } else {
      setIsFav(false);
    }
  }, [user, exerciseId]);

  const checkFavorite = async () => {
    if (!user) return;
    const result = await isFavorite(user.uid, exerciseId);
    setIsFav(result);
  };

  const handleToggle = async () => {
    if (!user || loading) return;

    setLoading(true);
    setIsAnimating(true);

    try {
      if (isFav) {
        await removeFavorite(user.uid, exerciseId);
        setIsFav(false);
      } else {
        await addFavorite(user.uid, {
          id: exerciseId,
          name: exerciseName,
          category: categoryId,
        });
        setIsFav(true);
      }
    } catch (error) {
      console.error("[FavoriteButton] Error:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const buttonContent = (
    <Button
      variant="outline"
      size="lg"
      onClick={handleToggle}
      disabled={!user || loading}
      className={`
        ${className}
        ${isFav ? "border-red-500 bg-red-50 hover:bg-red-100" : "hover:border-red-300"}
        ${isAnimating ? "animate-pulse scale-110" : ""}
        transition-all duration-200
      `}
    >
      <Heart
        className={`h-5 w-5 mr-2 transition-all ${
          isFav ? "fill-red-500 text-red-500" : "text-gray-600"
        }`}
      />
      {isFav ? "Remove from Favorites" : "Add to Favorites"}
    </Button>
  );

  if (!user) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent>
            <p>Please log in to add favorites</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
}
