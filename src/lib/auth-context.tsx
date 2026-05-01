import {
  createContext, useContext, useEffect, useState, type ReactNode,
} from "react";
import {
  onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut,
  GoogleAuthProvider, signInWithPopup,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  /** True if VITE_FIREBASE_* env vars were provided at build time */
  ready: boolean;
  /** True if the signed-in user's Firestore profile has role === "admin" */
  isAdmin: boolean;
  /** True while we're checking the user's role */
  checkingAdmin: boolean;
  /** Populated when the Firestore users/{email} upsert fails (usually rules) */
  profileError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

/**
 * Every sign-in creates a `users/{email}` doc if it doesn't already exist,
 * with role="pending". The owner then goes to Firebase Console and flips
 * that field to "admin" to grant access — no code changes needed.
 *
 * Returns true if the user's current role is "admin".
 */
async function upsertUserAndCheckRole(u: User): Promise<boolean> {
  if (!db || !u.email) return false;
  const email = u.email.toLowerCase();
  const ref = doc(db, "users", email);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // First time this email has signed in — create the profile doc.
    // Default role is "pending" so that the admin has to explicitly promote.
    await setDoc(ref, {
      email,
      displayName: u.displayName ?? null,
      photoURL: u.photoURL ?? null,
      provider: u.providerData[0]?.providerId ?? null,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      role: "pending",
    });
    return false;
  }

  // Existing user — touch lastLoginAt and read the role
  const data = snap.data() as { role?: string };
  await setDoc(ref, { lastLoginAt: serverTimestamp() }, { merge: true });
  return data.role === "admin";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      setProfileError(null);

      if (!u) {
        setIsAdmin(false);
        return;
      }
      setCheckingAdmin(true);
      try {
        const ok = await upsertUserAndCheckRole(u);
        setIsAdmin(ok);
      } catch (err) {
        // Surface the error so the UI can show the user exactly what's wrong
        // (almost always Firestore security rules blocking the write).
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[auth] Firestore users/{email} upsert failed:", err);
        setProfileError(msg);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    });
    return unsub;
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase is not configured.");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Firebase is not configured.");
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    if (!auth) return;
    await fbSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        ready: isFirebaseConfigured,
        isAdmin,
        checkingAdmin,
        profileError,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}