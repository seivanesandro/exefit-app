import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExerciseDetails } from "@/entities/exercise/ui/ExerciseDetails";
import {
  fetchExerciseById,
  fetchCategories,
  fetchMuscles,
  fetchEquipment,
} from "@/entities/exercise/api/exerciseApi";

type PageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Gera metadata dinâmico para SEO
 * Permite indexação individual de cada exercício
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return {
        title: "Exercise Not Found | ExeFit",
        description: "The requested exercise could not be found.",
      };
    }

    const exercise = await fetchExerciseById(id);

    return {
      title: `${exercise.name} | ExeFit`,
      description: exercise.description
        ? exercise.description.substring(0, 160)
        : `Learn how to perform ${exercise.name} with proper form and technique.`,
      openGraph: {
        title: `${exercise.name} | ExeFit`,
        description: exercise.description
          ? exercise.description.substring(0, 160)
          : `Learn how to perform ${exercise.name}`,
        images: exercise.images.length > 0 ? [exercise.images[0].image] : [],
      },
    };
  } catch {
    return {
      title: "Exercise Not Found | ExeFit",
      description: "The requested exercise could not be found.",
    };
  }
}

export default async function ExercisePage(props: PageProps) {
  const params = await props.params;
  const id = parseInt(params.id, 10);

  console.log("[ExercisePage] Loading exercise with ID:", id);

  // Validar ID
  if (isNaN(id) || id <= 0) {
    console.error("[ExercisePage] Invalid ID:", params.id);
    notFound();
  }

  // Buscar dados em paralelo (sem try/catch no JSX)
  const [exercise, categories, muscles, equipment] = await Promise.all([
    fetchExerciseById(id).catch((err) => {
      console.error("[ExercisePage] Error fetching exercise:", err);
      return null;
    }),
    fetchCategories().catch(() => []),
    fetchMuscles().catch(() => []),
    fetchEquipment().catch(() => []),
  ]);

  console.log("[ExercisePage] Exercise loaded:", exercise ? exercise.name : "NULL");

  // Se não encontrou o exercício
  if (!exercise) {
    console.error("[ExercisePage] Exercise not found, calling notFound()");
    notFound();
  }

  return (
    <ExerciseDetails
      exercise={exercise}
      categories={categories}
      muscles={muscles}
      equipment={equipment}
    />
  );
}


