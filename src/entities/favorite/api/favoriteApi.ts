import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { toast } from "sonner";

/**
 * Estrutura de um favorito no Firestore
 */
export interface Favorite {
  id: string;
  userId: string;
  exerciseId: number;
  exerciseName: string;
  categoryId: number;
  createdAt: Date;
}

/**
 * Adiciona um exercício aos favoritos do utilizador
 * @param userId - ID do utilizador autenticado
 * @param exercise - Objeto do exercício { id, name, category }
 */
export async function addFavorite(
  userId: string,
  exercise: { id: number; name: string; category: number }
): Promise<void> {
  try {
    const favoriteId = `${userId}_${exercise.id}`;
    const favoriteRef = doc(db, "favorites", favoriteId);

    await setDoc(favoriteRef, {
      userId,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      categoryId: exercise.category,
      createdAt: Timestamp.now(),
    });

    toast.success("Added to favorites", {
      description: `${exercise.name} has been added to your favorites.`,
    });
  } catch (error) {
    console.error("[addFavorite] Error:", error);
    toast.error("Failed to add favorite", {
      description: "Please try again later.",
    });
    throw error;
  }
}

/**
 * Remove um exercício dos favoritos do utilizador
 * @param userId - ID do utilizador autenticado
 * @param exerciseId - ID do exercício a remover
 */
export async function removeFavorite(
  userId: string,
  exerciseId: number
): Promise<void> {
  try {
    const favoriteId = `${userId}_${exerciseId}`;
    const favoriteRef = doc(db, "favorites", favoriteId);

    await deleteDoc(favoriteRef);

    toast.success("Removed from favorites", {
      description: "Exercise removed successfully.",
    });
  } catch (error) {
    console.error("[removeFavorite] Error:", error);
    toast.error("Failed to remove favorite", {
      description: "Please try again later.",
    });
    throw error;
  }
}

/**
 * Obtem todos os favoritos de um utilizador
 * @param userId - ID do utilizador autenticado
 * @returns Array de favoritos
 */
export async function getFavorites(userId: string): Promise<Favorite[]> {
  try {
    const favoritesRef = collection(db, "favorites");
    const q = query(favoritesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const favorites: Favorite[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      favorites.push({
        id: doc.id,
        userId: data.userId,
        exerciseId: data.exerciseId,
        exerciseName: data.exerciseName,
        categoryId: data.categoryId,
        createdAt: data.createdAt.toDate(),
      });
    });

    return favorites.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error("[getFavorites] Error:", error);
    return [];
  }
}

/**
 * Verifica se um exercício está nos favoritos do utilizador
 * @param userId - ID do utilizador autenticado
 * @param exerciseId - ID do exercício a verificar
 * @returns true se estiver nos favoritos, false caso contrário
 */
export async function isFavorite(
  userId: string,
  exerciseId: number
): Promise<boolean> {
  try {
    const favoritesRef = collection(db, "favorites");
    const q = query(
      favoritesRef,
      where("userId", "==", userId),
      where("exerciseId", "==", exerciseId)
    );
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error("[isFavorite] Error:", error);
    return false;
  }
}

/**
 * Listener em tempo real para favoritos do utilizador
 * @param userId - ID do utilizador autenticado
 * @param callback - Função chamada quando há mudanças
 * @returns Função para unsubscribe do listener
 */
export function subscribeFavorites(
  userId: string,
  callback: (favorites: Favorite[]) => void
): () => void {
  const favoritesRef = collection(db, "favorites");
  const q = query(favoritesRef, where("userId", "==", userId));

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const favorites: Favorite[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        favorites.push({
          id: doc.id,
          userId: data.userId,
          exerciseId: data.exerciseId,
          exerciseName: data.exerciseName,
          categoryId: data.categoryId,
          createdAt: data.createdAt.toDate(),
        });
      });

      const sortedFavorites = favorites.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      callback(sortedFavorites);
    },
    (error) => {
      console.error("[subscribeFavorites] Error:", error);
    }
  );

  return unsubscribe;
}
