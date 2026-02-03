import {
  ExerciseCard,
  ExerciseCardSkeleton,
} from "@/entities/exercise/ui/ExerciseCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination";
import type { ExerciseGridProps } from "@/entities/types";

// Componente de grid de exercícios
export function ExerciseGrid({
  exercises,
  isLoading,
  error,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: ExerciseGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
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
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your filters.
        </p>
      </div>
    );
  }

  // Gerar array de números de página visíveis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Mostrar todas as páginas se forem poucas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sempre mostrar primeira página
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis-start');
      }

      // Mostrar páginas ao redor da página atual
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis-end');
      }

      // Sempre mostrar última página
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isFavorite={false}
            onFavoriteToggle={(id) => {
              console.log("Toggle favorite:", id);
            }}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={`${page}-${index}`}>
                  {typeof page === 'number' ? (
                    <PaginationLink
                      onClick={() => onPageChange?.(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  ) : (
                    <PaginationEllipsis />
                  )}
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
