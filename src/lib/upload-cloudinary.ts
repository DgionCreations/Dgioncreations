/**
 * Upload an image or video to Cloudinary using an unsigned upload preset.
 *
 * Why Cloudinary alongside Firebase Storage:
 *  - Single API for images AND videos (Firebase only handles raw bytes).
 *  - Automatic format/quality optimisation + global CDN delivery.
 *  - No CORS gymnastics — Cloudinary's REST endpoint is public-friendly.
 *
 * Setup (one-time):
 *  1. Create a free Cloudinary account → Settings → Upload → Add upload preset.
 *  2. Set "Signing Mode" to **Unsigned**, give it a name (e.g. "dgion_unsigned").
 *  3. Add to .env.local:
 *
 *       VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
 *       VITE_CLOUDINARY_UPLOAD_PRESET=your-preset-name
 *
 *  4. Restart `npm run dev`.
 *
 * The returned URL is the `secure_url` from Cloudinary, which is HTTPS,
 * cached at the edge, and accepts on-the-fly transformations (e.g. add
 * `/w_400,q_auto/` after `/upload/` to resize + auto-quality).
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export type CloudinaryResourceType = "image" | "video" | "auto" | "raw";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: "image" | "video" | "raw";
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
}

/**
 * Upload a file to Cloudinary. `auto` lets Cloudinary detect images vs videos.
 *
 * Throws a readable Error if Cloudinary is not configured, the file is too big,
 * or the API rejects the upload.
 */
export async function uploadToCloudinary(
  file: File,
  options: {
    folder?: string;
    resourceType?: CloudinaryResourceType;
    /** Max bytes — default 100 MB to allow short video uploads. */
    maxBytes?: number;
  } = {}
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      "Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env.local."
    );
  }

  const { folder, resourceType = "auto", maxBytes = 100 * 1024 * 1024 } = options;

  if (file.size > maxBytes) {
    throw new Error(
      `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max ${(maxBytes / 1024 / 1024).toFixed(0)} MB.`
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET as string);
  if (folder) form.append("folder", folder);

  let res: Response;
  try {
    res = await fetch(endpoint, { method: "POST", body: form });
  } catch (err) {
    console.error("[upload-cloudinary] Network error:", err);
    throw new Error("Network error — check your connection and try again.");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = `Cloudinary rejected the upload (HTTP ${res.status}).`;
    try {
      const parsed = JSON.parse(text);
      if (parsed?.error?.message) message = parsed.error.message;
    } catch {
      if (text) message = text;
    }
    console.error("[upload-cloudinary] Server error:", res.status, text);
    throw new Error(message);
  }

  const data = await res.json();
  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
    resourceType: data.resource_type as "image" | "video" | "raw",
    format: data.format as string,
    bytes: data.bytes as number,
    width: data.width,
    height: data.height,
    duration: data.duration,
  };
}
