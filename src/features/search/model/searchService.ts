import { Exercise } from "@/entities/types";

/**
 * Filtra exercícios por termo de busca
 * Busca por nome e descrição do exercício
 */
export function searchExercises(
  exercises: Exercise[],
  searchTerm: string
): Exercise[] {
  if (!searchTerm.trim()) {
    return exercises;
  }

  const term = searchTerm.toLowerCase();

  return exercises.filter((exercise) => {
    const name = exercise.name?.toLowerCase() || "";
    const description = exercise.description?.toLowerCase() || "";

    return name.includes(term) || description.includes(term);
  });
}

/**
 * Filtra exercícios por categoria
 */
export function filterByCategory(
  exercises: Exercise[],
  categoryId: number | null
): Exercise[] {
  if (!categoryId) {
    return exercises;
  }

  return exercises.filter((exercise) => exercise.category === categoryId);
}

/**
 * Filtra exercícios por músculo
 */
export function filterByMuscle(
  exercises: Exercise[],
  muscleId: number | null
): Exercise[] {
  if (!muscleId) {
    return exercises;
  }

  return exercises.filter((exercise) => exercise.muscles?.includes(muscleId));
}

/**
 * Filtra exercícios por equipamento
 */
export function filterByEquipment(
  exercises: Exercise[],
  equipmentId: number | null
): Exercise[] {
  if (!equipmentId) {
    return exercises;
  }

  return exercises.filter((exercise) =>
    exercise.equipment?.includes(equipmentId)
  );
}

/**
 * Aplica múltiplos filtros em sequência
 */
export function applyFilters(
  exercises: Exercise[],
  filters: {
    search?: string;
    category?: number | null;
    muscle?: number | null;
    equipment?: number | null;
  }
): Exercise[] {
  let filtered = exercises;

  if (filters.search) {
    filtered = searchExercises(filtered, filters.search);
  }

  if (filters.category) {
    filtered = filterByCategory(filtered, filters.category);
  }

  if (filters.muscle) {
    filtered = filterByMuscle(filtered, filters.muscle);
  }

  if (filters.equipment) {
    filtered = filterByEquipment(filtered, filters.equipment);
  }

  return filtered;
}
