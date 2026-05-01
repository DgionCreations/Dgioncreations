import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

/**
 * useContent — subscribe to a Firestore document at `content/{sectionKey}`.
 *
 * Falls back to `defaults` if Firebase isn't configured OR the doc doesn't
 * exist yet, so the site always renders something even before an admin
 * publishes anything. Updates stream in real-time via onSnapshot.
 */
export function useContent<T extends object>(sectionKey: string, defaults: T) {
  const [data, setData] = useState<T>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const ref = doc(db, "content", sectionKey);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setData({ ...defaults, ...(snap.data() as Partial<T>) });
        } else {
          setData(defaults);
        }
        setLoading(false);
      },
      (err) => {
        // Firestore errors (permissions, offline, etc.) — fall back to defaults
        console.warn(`[useContent] ${sectionKey}:`, err.message);
        setLoading(false);
      }
    );

    return unsub;
    // `defaults` is intentionally excluded from deps — it's only used as initial/fallback value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  return { data, loading };
}

/**
 * saveContent — writes the full document at `content/{sectionKey}`.
 * Overwrites any existing fields (use merge semantics by spreading the old
 * data in the admin form before calling this).
 */
export async function saveContent<T extends object>(sectionKey: string, data: T) {
  if (!isFirebaseConfigured || !db) {
    throw new Error("Firebase is not configured. Set VITE_FIREBASE_* env vars.");
  }
  const ref = doc(db, "content", sectionKey);
  await setDoc(ref, data, { merge: true });
}