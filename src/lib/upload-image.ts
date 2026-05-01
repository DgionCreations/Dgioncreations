import { ref, uploadBytesResumable, getDownloadURL, type StorageError } from "firebase/storage";
import { storage, isFirebaseConfigured } from "./firebase";

/**
 * Upload a file to Firebase Storage and return the public download URL.
 *
 * Files land at `images/{folder}/{timestamp}-{safeName}` so multiple uploads
 * with the same filename don't collide. Caller passes the folder to keep the
 * bucket tidy (e.g. "clients", "cards", "hero").
 *
 * Throws a readable Error if Firebase is not configured, the file is too big,
 * or the SDK rejects the upload. Callers surface the message to the UI.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!isFirebaseConfigured || !storage) {
    throw new Error(
      "Firebase Storage is not configured. Add VITE_FIREBASE_STORAGE_BUCKET to .env.local."
    );
  }

  // 5 MB cap — logo/hero images should be well under this. Caller can tighten.
  const MAX_BYTES = 5 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 5 MB.`);
  }

  if (!file.type.startsWith("image/")) {
    throw new Error(`Not an image file (${file.type || "unknown type"}).`);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `images/${folder}/${Date.now()}-${safeName}`;
  const objectRef = ref(storage, path);

  // Resumable upload gives us progress events + a clear error path. The plain
  // uploadBytes() can hang silently when CORS or auth fails; the resumable
  // variant errors out immediately with a code we can surface.
  return new Promise<string>((resolve, reject) => {
    const task = uploadBytesResumable(objectRef, file, { contentType: file.type });

    // 60 s safety net — if the SDK never reports state_changed (e.g. CORS
    // preflight stalls), kill the task so the UI doesn't sit on "Uploading…"
    const timeoutId = window.setTimeout(() => {
      try { task.cancel(); } catch { /* task already settled */ }
      reject(
        new Error(
          "Upload timed out after 60 seconds. Likely causes: Firebase Storage rules block writes, " +
          "CORS isn't configured on the bucket, or your network blocked the request. Check the browser console."
        )
      );
    }, 60_000);

    task.on(
      "state_changed",
      (snap) => {
        console.debug(
          `[upload-image] ${snap.bytesTransferred}/${snap.totalBytes} bytes`
        );
      },
      (err: StorageError) => {
        window.clearTimeout(timeoutId);
        console.error("[upload-image] Firebase Storage error:", err.code, err.message, err.serverResponse);
        const friendly =
          err.code === "storage/unauthorized"
            ? "Upload blocked by Firebase Storage rules. Open Firebase console → Storage → Rules and allow writes (or sign in as an authorised admin)."
            : err.code === "storage/canceled"
            ? "Upload was canceled."
            : err.code === "storage/retry-limit-exceeded"
            ? "Upload kept retrying. Check your network or the storage bucket name."
            : `Upload failed: ${err.message}`;
        reject(new Error(friendly));
      },
      async () => {
        window.clearTimeout(timeoutId);
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          console.error("[upload-image] getDownloadURL failed:", err);
          reject(err instanceof Error ? err : new Error("Could not read uploaded file URL."));
        }
      }
    );
  });
}
