'use client';

import { useState } from 'react';
import { Sidebar } from '@/widgets/sidebar/Sidebar';
import { ExerciseGrid } from '@/widgets/exercise-grid/ExerciseGrid';
import { useFilters } from '@/shared/hooks/useFilters';
import { useExercises } from '@/shared/hooks/useExercises';

export default function HomePage() {
  const { filters } = useFilters();
  const [currentPage, setCurrentPage] = useState(1);

  const { exercises, loading, error, totalPages } = useExercises({
    search: filters.search,
    category: filters.category?.toString(),
    muscle: filters.muscle?.toString(),
    page: currentPage,
    limit: 5, // Default: 5 cards per page
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <Sidebar />
      
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">ExeFit</h1>
          <p className="text-lg text-muted-foreground">
            Pilates & Fitness Exercises Library
          </p>
        </div>

        <ExerciseGrid 
          exercises={exercises} 
          isLoading={loading} 
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
