import { doc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type { User } from "@/entities/types";

/**
 * Cria ou actualiza o documento do utilizador no Firestore.
 *
 * Usa setDoc com { merge: true } para que:
 * - Novos utilizadores: o documento é criado com todos os campos.
 * - Utilizadores existentes: apenas os campos fornecidos são actualizados
 *   (os restantes mantêm-se intactos).
 *
 * O campo `createdAt` usa o `creationTime` do Firebase Auth, que é
 * imutável e reflecte sempre a data de criação real da conta.
 */
export async function upsertUser(userData: User & { firebaseCreationTime?: string }): Promise<void> {
  try {
    const userRef = doc(db, "users", userData.uid);

    // Determina createdAt a partir do metadata do Firebase Auth (imutável)
    const createdAt = userData.firebaseCreationTime
      ? Timestamp.fromDate(new Date(userData.firebaseCreationTime))
      : serverTimestamp();

    await setDoc(
      userRef,
      {
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        createdAt,
        lastLogin: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    throw new Error(`Failed to upsert user: ${err.message}`);
  }
}

/**
 * @deprecated Use `upsertUser` instead.
 * Mantido para retrocompatibilidade.
 */
export async function createUser(userData: User): Promise<void> {
  return upsertUser(userData);
}

/**
 * @deprecated Use `upsertUser` instead.
 * Mantido para retrocompatibilidade.
 */
export async function updateLastLogin(uid: string): Promise<void> {
  return upsertUser({ uid, email: "", displayName: "", photoURL: "", createdAt: { seconds: 0, nanoseconds: 0 }, lastLogin: { seconds: 0, nanoseconds: 0 } });
}
