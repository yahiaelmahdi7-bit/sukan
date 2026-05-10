"use client";

import { useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { X, Sparkles } from "lucide-react";
import { PhotoTouchupButton } from "@/components/photo-touchup-button";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif";

interface PhotoUploadProps {
  userId: string;
  listingId: string;
  max?: number;
  onChange: (urls: string[]) => void;
  initial?: string[];
}

interface UploadedPhoto {
  url: string;
  path: string;
}

export function PhotoUpload({
  userId,
  listingId,
  max = 5,
  onChange,
  initial = [],
}: PhotoUploadProps) {
  const t = useTranslations("photos");
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<UploadedPhoto[]>(
    initial.map((url) => ({ url, path: "" })),
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  // Track which photo URLs have been AI-enhanced (by their current URL)
  const [enhancedUrls, setEnhancedUrls] = useState<Set<string>>(new Set());

  async function uploadFiles(files: FileList) {
    setError(null);
    const supabase = createClient();
    const remaining = max - photos.length;
    const toUpload = Array.from(files).slice(0, remaining);

    if (toUpload.length === 0) return;

    // Validate sizes
    for (const file of toUpload) {
      if (file.size > MAX_SIZE_BYTES) {
        setError(t("maxSize"));
        return;
      }
    }

    setUploading(true);
    const newPhotos: UploadedPhoto[] = [];

    for (const file of toUpload) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `${userId}/${listingId}/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-photos")
        .upload(path, file, { upsert: false });

      if (uploadError) {
        setError(t("uploadFailed"));
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("listing-photos")
        .getPublicUrl(path);

      newPhotos.push({ url: publicUrlData.publicUrl, path });
    }

    const updated = [...photos, ...newPhotos];
    setPhotos(updated);
    onChange(updated.map((p) => p.url));
    setUploading(false);
  }

  async function removePhoto(index: number) {
    const supabase = createClient();
    const photo = photos[index];

    if (photo.path) {
      await supabase.storage.from("listing-photos").remove([photo.path]);
    }

    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    onChange(updated.map((p) => p.url));
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      void uploadFiles(e.dataTransfer.files);
    }
  }

  const handlePhotoEnhanced = useCallback(
    (originalUrl: string, newUrl: string) => {
      setPhotos((prev) => {
        const updated = prev.map((p) =>
          p.url === originalUrl ? { ...p, url: newUrl } : p,
        );
        onChange(updated.map((p) => p.url));
        return updated;
      });
      setEnhancedUrls((prev) => {
        const next = new Set(prev);
        // Remove the old URL from the enhanced set (if it was previously enhanced)
        next.delete(originalUrl);
        next.add(newUrl);
        return next;
      });
    },
    [onChange],
  );

  const canUploadMore = photos.length < max;

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      {canUploadMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={[
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition smooth-fast",
            dragging
              ? "border-[#C8401A] bg-[#C8401A]/5"
              : "border-[#C8873A]/40 bg-white/40 hover:bg-[#C8873A]/5",
          ].join(" ")}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C8873A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="text-sm text-[#12100C]/70">
            {uploading ? t("uploading") : t("dropHere")}{" "}
            <span className="font-medium text-[#C8401A]">{t("browse")}</span>
          </p>
          <p className="text-xs text-[#12100C]/40">
            {t("max5")} &middot; {t("maxSize")}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) {
            void uploadFiles(e.target.files);
            // Reset input so same file can be re-selected
            e.target.value = "";
          }
        }}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Thumbnails */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((photo, i) => {
            const isEnhanced = enhancedUrls.has(photo.url);
            return (
              <div
                key={photo.url}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={t("photoOf", { index: i + 1 })}
                  className="h-full w-full object-cover"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => void removePhoto(i)}
                  aria-label={t("remove")}
                  className="absolute end-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <X size={12} aria-hidden="true" />
                </button>

                {/* AI-enhanced badge */}
                {isEnhanced && (
                  <div className="absolute start-1 top-1 flex items-center gap-0.5 rounded-full bg-[#C8873A]/90 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
                    <Sparkles size={8} aria-hidden="true" />
                    {t("aiEnhanced")}
                  </div>
                )}

                {/* Touch up button — visible on hover */}
                {!isEnhanced && (
                  <div className="absolute bottom-1 start-1 end-1 flex justify-center opacity-0 transition group-hover:opacity-100">
                    <PhotoTouchupButton
                      photoUrl={photo.url}
                      onEnhanced={(newUrl) =>
                        handlePhotoEnhanced(photo.url, newUrl)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
