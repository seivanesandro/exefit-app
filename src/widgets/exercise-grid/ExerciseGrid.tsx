import { ExerciseCard, ExerciseCardSkeleton } from '@/entities/exercise/ui/ExerciseCard';
import type { ExerciseGridProps } from '@/entities/types';

// Componente de grid de exercícios
export function ExerciseGrid({ exercises, isLoading, error }: ExerciseGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 20 }).map((_, index) => (
          <ExerciseCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Erro ao carregar exercícios
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive text-lg">{error}</p>
      </div>
    );
  }

  // Nenhum exercício encontrado
  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No exercises found.</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/*  */}
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          isFavorite={false}
          onFavoriteToggle={(id) => {
            console.log('Toggle favorite:', id);
          }}
        />
      ))}
    </div>
  );
}