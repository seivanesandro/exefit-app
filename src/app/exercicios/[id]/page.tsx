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

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return {}; // Retorna objeto vazio se o ID for inválido

    const exercise = await fetchExerciseById(id);

    // Se o exercício existir e tiver nome, define o título. Senão, não define nada.
    if (exercise?.name) {
      return {
        title: exercise.name,
      };
    }
  } catch (error) {
    console.error("Failed to generate metadata:", error);
  }

  return {}; // Retorna um objeto vazio em caso de erro ou se não houver nome
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
  // Se não encontrou o exercício
  if (!exercise) {
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


