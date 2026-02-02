import { Card, CardContent, CardFooter } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Heart } from 'lucide-react';
import type { ExerciseCardProps } from '@/entities/types';
import Image from 'next/image';

/**
 * Card de exercício para o grid da página principal
 */
export function ExerciseCard({ exercise, isFavorite, onFavoriteToggle }: ExerciseCardProps) {
  const mainImage = exercise.images?.find((img) => img.is_main)?.image || 
                    exercise.images?.[0]?.image || 
                    '/placeholder-exercise.png';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-muted">
        <Image 
          src={mainImage} 
          alt={exercise.name || 'Exercise'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {exercise.name || 'Unnamed Exercise'}
        </h3>
        <Badge variant="secondary">
          Category {exercise.category}
        </Badge>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => {
            console.log('Navigate to:', `/exercicios/${exercise.id}`);
          }}
        >
          View Details
        </Button>
        
        <Button
          variant={isFavorite ? 'default' : 'outline'}
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.(exercise.id);
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
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
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  );
}