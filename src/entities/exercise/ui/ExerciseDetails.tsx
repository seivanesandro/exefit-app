import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { Separator } from '@/shared/ui/separator';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Heart } from 'lucide-react';
import type { ExerciseDetailsProps } from '@/entities/types';
import Image from 'next/image';

/**
 * Componente de detalhes completos do exercício
 */
export function ExerciseDetails({ 
  exercise, 
  onFavorite, 
  isFavorite = false,
  isLoadingFavorite = false 
}: ExerciseDetailsProps) {
  const mainImage = exercise.images?.find((img) => img.is_main)?.image || 
                    exercise.images?.[0]?.image || 
                    '/placeholder-exercise.png';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero image */}
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6 bg-muted">
        <Image
          src={mainImage}
          alt={exercise.name || 'Exercise'}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>

      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold mb-4">
            {exercise.name || 'Unnamed Exercise'}
          </h1>
          <div className="flex gap-2">
            <Badge variant="secondary">Category {exercise.category}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          {exercise.description && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <div
                  className="prose max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: exercise.description }}
                />
              </div>
              <Separator />
            </>
          )}

          {/* Primary muscles */}
          {exercise.muscles && exercise.muscles.length > 0 && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-3">Primary Muscles</h2>
                <div className="flex gap-2 flex-wrap">
                  {exercise.muscles.map((muscleId) => (
                    <Badge key={muscleId} variant="outline">
                      Muscle {muscleId}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Secondary muscles */}
          {exercise.muscles_secondary && exercise.muscles_secondary.length > 0 && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-3">Secondary Muscles</h2>
                <div className="flex gap-2 flex-wrap">
                  {exercise.muscles_secondary.map((muscleId) => (
                    <Badge key={muscleId} variant="outline">
                      Muscle {muscleId}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Equipment */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-3">Equipment</h2>
                <div className="flex gap-2 flex-wrap">
                  {exercise.equipment.map((equipId) => (
                    <Badge key={equipId} variant="outline">
                      Equipment {equipId}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Favorite button */}
          <Button
            onClick={onFavorite}
            disabled={isLoadingFavorite}
            variant={isFavorite ? 'default' : 'outline'}
            className="w-full"
          >
            <Heart className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        </CardContent>
      </Card>

      {/* Image gallery */}
      {exercise.images && exercise.images.length > 1 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {exercise.images.map((image) => (
              <div key={image.id} className="relative h-32 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={image.image}
                  alt={`${exercise.name} - Gallery image`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton da página de detalhes
 */
export function ExerciseDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Skeleton className="w-full h-64 md:h-96 rounded-lg mb-6" />

      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <Skeleton className="h-6 w-32 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Separator />

          <div>
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>

          <Separator />

          <div>
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>

          <Separator />

          <div>
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>

          <Separator />

          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>

      <div className="mt-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}