import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/**
 * Firebase configuration — values come from env vars at build time.
 *
 * Create a .env.local in project root (same folder as vite.config.ts) with:
 *
 *   VITE_FIREBASE_API_KEY=...
 *   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
 *   VITE_FIREBASE_PROJECT_ID=your-project
 *   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
 *   VITE_FIREBASE_MESSAGING_SENDER_ID=...
 *   VITE_FIREBASE_APP_ID=...
 *
 * Get these from Firebase Console → Project settings → General → Your apps.
 * Restart `npm run dev` after editing .env.local.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * True only when API key + project ID are BOTH present. We gate every Firebase
 * call on this so the site renders normally (with defaults) before admins
 * configure Firebase — no blank screen, no console errors.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

// Initialize Firebase only when configured. Otherwise the SDK throws
// "auth/invalid-api-key" the moment anything touches `auth` / `db`.
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  app = getApps()[0] ?? initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
  storageInstance = getStorage(app);
} else if (import.meta.env.DEV) {
  // Friendly nudge in dev so the developer knows why admin features are inert.
  console.info(
    "[firebase] Not configured — add VITE_FIREBASE_* keys to .env.local to enable the admin panel."
  );
}

export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;
export default app;