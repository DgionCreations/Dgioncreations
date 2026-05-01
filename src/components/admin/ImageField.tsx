import { useRef, useState } from "react";
import { Upload, Loader2, X, AlertCircle } from "lucide-react";
import { uploadImage } from "@/lib/upload-image";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/upload-cloudinary";

/**
 * ImageField — a URL input that also accepts drag-and-drop / file picker
 * uploads. Prefers Cloudinary (handles images + video, auto-optimised CDN
 * delivery) and falls back to Firebase Storage if Cloudinary isn't set up.
 * The stored value is always a URL string.
 *
 * Props:
 *  - folder: sub-folder hint sent to the upload provider — keeps assets tidy.
 *  - previewHeight: tailwind height class for the inline preview.
 *  - accept: which media kinds the picker allows. "image" (default), "video",
 *    or "media" for both.
 */
type MediaKind = "image" | "video" | "media";

export default function ImageField({
  label,
  value,
  onChange,
  folder,
  placeholder,
  previewHeight = "h-40",
  hint,
  accept = "image",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  folder: string;
  placeholder?: string;
  previewHeight?: string;
  hint?: string;
  accept?: MediaKind;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileAccept =
    accept === "video" ? "video/*" : accept === "media" ? "image/*,video/*" : "image/*";

  const isVideoUrl = (url: string) =>
    /\.(mp4|webm|mov|m4v|ogv)(\?|$)/i.test(url) ||
    /\/video\/upload\//.test(url);

  const handleFile = async (file: File | null | undefined) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      // Cloudinary preferred — one endpoint, handles images + video, CDN'd.
      // Firebase is the fallback for image-only uploads when Cloudinary
      // isn't configured.
      if (isCloudinaryConfigured) {
        const result = await uploadToCloudinary(file, { folder, resourceType: "auto" });
        onChange(result.url);
      } else {
        if (file.type.startsWith("video/")) {
          throw new Error(
            "Video uploads need Cloudinary. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env.local."
          );
        }
        const url = await uploadImage(file, folder);
        onChange(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onPick = () => inputRef.current?.click();

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-2">
      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
        {label}
      </span>

      {/* URL input + upload button — single row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          placeholder={placeholder ?? "https://... or upload →"}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-white text-sm outline-none focus:ring-2 focus:ring-[#837FFB]/40 placeholder-white/25"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        />
        <button
          type="button"
          onClick={onPick}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 shrink-0"
          style={{
            background: "linear-gradient(135deg, #837FFB, #5B57F5)",
            boxShadow: "0 2px 8px rgba(131,127,251,0.25)",
          }}
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" /> Upload
            </>
          )}
        </button>
        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors shrink-0"
            style={{ border: "1px solid rgba(248, 113, 113, 0.2)" }}
            title="Remove Image"
          >
            <X className="w-3.5 h-3.5" /> Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={fileAccept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {/* Drag-and-drop zone + inline preview */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={onPick}
        className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${previewHeight}`}
        style={{
          background: "#0A0818",
          border: `1px dashed ${isDragging ? "rgba(131,127,251,0.7)" : "rgba(255,255,255,0.15)"}`,
        }}
      >
        {value ? (
          <>
            {isVideoUrl(value) ? (
              <video
                src={value}
                className="w-full h-full object-contain bg-black/20"
                muted
                loop
                playsInline
                autoPlay
                onError={(e) => {
                  (e.currentTarget as HTMLVideoElement).style.opacity = "0.15";
                }}
              />
            ) : (
              <img
                src={value}
                alt=""
                className="w-full h-full object-contain bg-black/20"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0.15";
                }}
              />
            )}
            <div className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 bg-black/55 px-2 py-1 rounded">
              Preview · click or drop to replace
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40">
            <Upload className="w-5 h-5" />
            <span className="text-xs font-semibold tracking-wider uppercase">
              {isDragging
                ? `Drop ${accept === "video" ? "video" : accept === "media" ? "file" : "image"} here`
                : `Click or drag ${accept === "video" ? "video" : accept === "media" ? "image or video" : "image"} to upload`}
            </span>
            <span className="text-[10px] text-white/25">
              {accept === "video"
                ? "MP4 · WebM · MOV · max 100 MB"
                : accept === "media"
                ? "PNG · JPG · WebP · MP4 · WebM · max 100 MB"
                : "PNG · JPG · SVG · WebP · max 5 MB"}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div
          className="flex items-start gap-2 p-2 rounded-md"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span className="text-xs text-red-300">{error}</span>
        </div>
      )}

      {hint && <p className="text-[11px] text-white/35 leading-relaxed">{hint}</p>}
    </div>
  );
}
