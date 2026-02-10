import {
  signInWithPopup,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  GoogleAuthProvider,
  User as FirebaseUser,
} from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { auth } from "@/shared/lib/firebase";
import { createUser, updateLastLogin } from "@/entities/user/api/userApi";
import type { User, FirebaseTimestamp } from "@/entities/types";

/**
 * Converte Date para FirebaseTimestamp
 */
function dateToFirebaseTimestamp(date: Date): FirebaseTimestamp {
  const timestamp = Timestamp.fromDate(date);
  return {
    seconds: timestamp.seconds,
    nanoseconds: timestamp.nanoseconds,
  };
}

/**
 * Google Auth Provider instance
 */
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

/**
 * Faz login com Google OAuth (popup)
 * NOTA: O login funciona mesmo que a gravação no Firestore falhe (por permissões)
 */
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    const now = dateToFirebaseTimestamp(new Date());

    const userData: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || "User",
      photoURL: firebaseUser.photoURL || "",
      createdAt: now,
      lastLogin: now,
    };

    // Tenta gravar no Firestore, mas NÃO bloqueia o login se falhar
    // (útil se as regras do Firestore não permitirem escrita)
    try {
      const isNewUser =
        result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

      if (isNewUser) {
        await createUser(userData);
        console.log("[Auth] Novo utilizador criado no Firestore");
      } else {
        await updateLastLogin(firebaseUser.uid);
        console.log("[Auth] Last login actualizado no Firestore");
      }
    } catch (firestoreError) {
      // Log do erro mas NÃO impede o login
      console.warn("[Auth] Não foi possível gravar no Firestore (permissões?):", firestoreError);
      // O login ainda é bem-sucedido porque o Firebase Auth já autenticou
    }

    return userData;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    if (firebaseError.code === "auth/popup-closed-by-user") {
      throw new Error("Login cancelled by user");
    }
    if (firebaseError.code === "auth/popup-blocked") {
      throw new Error(
        "Popup blocked by browser. Please allow popups for this site.",
      );
    }
    if (firebaseError.code === "auth/network-request-failed") {
      throw new Error("Network error. Please check your internet connection.");
    }

    throw new Error(firebaseError.message || "Login failed. Please try again.");
  }
}

/**
 * Faz logout do utilizador atual
 */
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    const firebaseError = error as { message?: string };
    throw new Error(
      firebaseError.message || "Logout failed. Please try again.",
    );
  }
}

/**
 * Listener para mudanças no estado de autenticação
 */
export function onAuthStateChanged(
  callback: (user: User | null) => void,
): () => void {
  return firebaseOnAuthStateChanged(
    auth,
    (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const now = dateToFirebaseTimestamp(new Date());

        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "User",
          photoURL: firebaseUser.photoURL || "",
          createdAt: now,
          lastLogin: now,
        };
        callback(user);
      } else {
        callback(null);
      }
    },
  );
}
