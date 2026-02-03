import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Heart, Dumbbell } from "lucide-react";
import type { ExerciseCardProps } from "@/entities/types";
import Image from "next/image";
import { useAuth } from "@/shared/hooks/useAuth";
import { useCategories } from "@/shared/hooks/useCategoriesContext";

/**
 * Card de exercício para o grid da página principal
 */
export function ExerciseCard({
  exercise,
  isFavorite,
  onFavoriteToggle,
}: ExerciseCardProps) {
  const { user } = useAuth();
  const { getCategoryName } = useCategories();
  const mainImage =
    exercise.images?.find((img) => img.is_main)?.image ||
    exercise.images?.[0]?.image;

  const isGif = mainImage?.toLowerCase().endsWith(".gif");

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={exercise.name || "Exercise"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={isGif}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <Dumbbell className="h-12 w-12 text-slate-400" strokeWidth={1.5} />
            <p className="text-xs text-slate-500 font-medium tracking-wider">
              NO IMAGE YET
            </p>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {exercise.name?.trim() || "Unnamed Exercise"}
        </h3>
        <Badge variant="secondary">{getCategoryName(exercise.category)}</Badge>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          className="flex-1 bg-black text-white hover:bg-gray-800 font-semibold cursor-pointer"
          onClick={() => {
            console.log("Navigate to:", `/exercicios/${exercise.id}`);
          }}
        >
          View Details
        </Button>

        {user && (
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle?.(exercise.id);
            }}
            className={`cursor-pointer ${isFavorite ? "border-red-500" : ""}`}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

/**
 * Skeleton do ExerciseCard
 */
export function ExerciseCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 w-full bg-slate-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="h-6 w-3/4 mb-2 bg-slate-200 rounded animate-pulse" />
        <div className="h-5 w-20 rounded-full bg-slate-200 animate-pulse" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <div className="h-10 flex-1 bg-slate-200 rounded animate-pulse" />
        <div className="h-10 w-10 bg-slate-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
}
