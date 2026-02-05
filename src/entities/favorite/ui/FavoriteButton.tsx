"use client";

import { useState, useEffect } from "react";
import { Heart, WifiOff } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/shared/hooks/useAuth";
import { useOnlineStatus } from "@/shared/hooks/useOnlineStatus";
import { addFavorite, removeFavorite, isFavorite } from "@/entities/favorite/api/favoriteApi";
import { toast } from "sonner";
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
 * - Se offline: desabilitado com tooltip "Internet connection required"
 * - Se autenticado + online: ativo com estado (favorito/não favorito)
 * - Animação scale ao clicar
 */
export function FavoriteButton({
  exerciseId,
  exerciseName,
  categoryId,
  className = "",
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const { isOnline } = useOnlineStatus();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Verificar se é favorito ao montar
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) {
        setIsFav(false);
        return;
      }
      const result = await isFavorite(user.uid, exerciseId);
      setIsFav(result);
    };

    checkFavorite();
  }, [user, exerciseId]);

  const handleToggle = async () => {
    if (!user || loading) return;

    // ✅ FASE 9.9: Desabilitar favoritos quando offline
    if (!isOnline) {
      toast.error("Connect to the internet", {
        description: "Favorites require an internet connection",
        icon: <WifiOff className="h-4 w-4" />,
      });
      return;
    }

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
      disabled={!user || loading || !isOnline}
      className={`
        ${className}
        ${isFav ? "border-red-500 bg-red-50 hover:bg-red-100" : "hover:border-red-300"}
        ${isAnimating ? "animate-pulse scale-110" : ""}
        ${!isOnline ? "opacity-50 cursor-not-allowed" : ""}
        transition-all duration-200
      `}
    >
      <Heart
        className={`h-5 w-5 mr-2 transition-all ${
          isFav ? "fill-red-500 text-red-500" : "text-gray-600"
        }`}
      />
      {!isOnline ? "Offline" : isFav ? "Remove from Favorites" : "Add to Favorites"}
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

  if (!isOnline) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent>
            <p>Internet connection required</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
}
