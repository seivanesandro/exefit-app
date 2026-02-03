import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type { User } from "@/entities/types";

/**
 * Cria novo utilizador no Firestore
 */
export async function createUser(userData: User): Promise<void> {
  try {
    const userRef = doc(db, "users", userData.uid);

    await setDoc(userRef, {
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    throw new Error(`Failed to create user: ${err.message}`);
  }
}

/**
 * Atualiza timestamp de último login
 */
export async function updateLastLogin(uid: string): Promise<void> {
  try {
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    throw new Error(`Failed to update last login: ${err.message}`);
  }
}
