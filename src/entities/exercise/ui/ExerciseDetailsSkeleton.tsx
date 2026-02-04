import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { Separator } from "@/shared/ui/separator";

/**
 * Skeleton da página de detalhes
 * Exibido durante carregamento da página
 */
export function ExerciseDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Back button skeleton */}
      <Skeleton className="h-10 w-40 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Image Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-video w-full rounded-lg" />
          {/* Gallery thumbnails skeleton */}
          <div className="grid grid-cols-4 gap-2">
            <Skeleton className="aspect-square rounded-md" />
            <Skeleton className="aspect-square rounded-md" />
            <Skeleton className="aspect-square rounded-md" />
            <Skeleton className="aspect-square rounded-md" />
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="space-y-6">
          {/* Title and badges */}
          <div>
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>

          <Separator />

          {/* Description Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>

          {/* Primary Muscles Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardContent>
          </Card>

          {/* Secondary Muscles Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-44" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardContent>
          </Card>

          {/* Equipment Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
