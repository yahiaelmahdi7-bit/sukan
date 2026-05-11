"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { uploadAvatar } from "../actions";

interface AvatarUploaderProps {
  /** Current avatar URL (may be null — falls back to initials) */
  avatarUrl: string | null;
  /** Display initials when no avatar is available */
  initials: string;
  /** Called with the new public URL after a successful upload */
  onUploaded: (url: string) => void;
  labels: {
    upload: string;
    dragDrop: string;
    hint: string;
    uploading: string;
    error: string;
  };
}

export function AvatarUploader({
  avatarUrl,
  initials,
  onUploaded,
  labels,
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) {
        setError(labels.error);
        return;
      }

      // Optimistic local preview
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      setError(null);
      setUploading(true);

      const fd = new FormData();
      fd.append("avatar", file);

      try {
        const result = await uploadAvatar(fd);
        if (result.ok) {
          onUploaded(result.url);
          // Replace blob URL with the real persisted URL
          setPreview(result.url);
        } else {
          setError(labels.error);
          // Revert preview on failure
          setPreview(avatarUrl);
        }
      } catch {
        setError(labels.error);
        setPreview(avatarUrl);
      } finally {
        setUploading(false);
        URL.revokeObjectURL(localUrl);
      }
    },
    [avatarUrl, labels.error, onUploaded],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) void handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar circle */}
      <div
        className={[
          "relative w-24 h-24 rounded-full overflow-hidden border-2 smooth",
          dragging
            ? "border-terracotta scale-105"
            : "border-white/70 hover:border-gold/60",
          uploading ? "opacity-70" : "",
        ].join(" ")}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={labels.upload}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        style={{
          boxShadow: "var(--shadow-glass)",
          cursor: uploading ? "wait" : "pointer",
        }}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Avatar"
            fill
            className="object-cover"
            sizes="96px"
            unoptimized={preview.startsWith("blob:")}
          />
        ) : (
          // Initials fallback
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-terracotta/20 to-gold/20">
            <span className="font-display text-2xl text-ink font-semibold select-none">
              {initials}
            </span>
          </div>
        )}

        {/* Uploading overlay */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/30 backdrop-blur-sm">
            <span className="text-xs text-cream font-semibold">{labels.uploading}</span>
          </div>
        )}

        {/* Hover camera icon */}
        {!uploading && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 smooth bg-ink/25 backdrop-blur-sm">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cream"
              aria-hidden="true"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        )}
      </div>

      {/* Upload CTA + hint */}
      <div className="flex flex-col items-center gap-1 text-center">
        <button
          type="button"
          onClick={() => !uploading && inputRef.current?.click()}
          disabled={uploading}
          className="text-xs font-semibold text-gold-dk hover:text-terracotta smooth disabled:opacity-50"
        >
          {labels.upload}
        </button>
        <span className="text-[11px] text-ink-mid">{labels.hint}</span>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-terracotta text-center">{error}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleChange}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
