"use client";

import { useState, useEffect, useRef, useCallback, useId } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Loader2, X, CheckCircle, AlertCircle } from "lucide-react";

type TouchupState = "idle" | "loading" | "preview" | "error";

interface PhotoTouchupButtonProps {
  /** Public URL of the original photo already in Supabase storage */
  photoUrl: string;
  /** Called with the new URL when the user accepts the enhanced version */
  onEnhanced: (newUrl: string) => void;
}

export function PhotoTouchupButton({
  photoUrl,
  onEnhanced,
}: PhotoTouchupButtonProps) {
  const t = useTranslations("photoTouchup");
  const uid = useId();
  const [state, setState] = useState<TouchupState>("idle");
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close preview on Escape
  useEffect(() => {
    if (state !== "preview") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleKeep();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-clear error after 5 s
  useEffect(() => {
    if (state === "error") {
      errorTimerRef.current = setTimeout(() => {
        setState("idle");
        setErrorMsg(null);
      }, 5000);
    }
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, [state]);

  const handleEnhance = useCallback(async () => {
    setState("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/photos/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl }),
      });

      const data = (await res.json()) as
        | { ok: true; enhancedUrl: string }
        | { ok: false; error: string };

      if (!data.ok) {
        setErrorMsg(data.error);
        setState("error");
        return;
      }

      setEnhancedUrl(data.enhancedUrl);
      setState("preview");
    } catch {
      setErrorMsg(t("errorGeneric"));
      setState("error");
    }
  }, [photoUrl, t]);

  const handleAccept = useCallback(() => {
    if (!enhancedUrl) return;
    onEnhanced(enhancedUrl);
    setState("idle");
    setEnhancedUrl(null);
  }, [enhancedUrl, onEnhanced]);

  const handleKeep = useCallback(() => {
    setState("idle");
    setEnhancedUrl(null);
  }, []);

  // ── idle ────────────────────────────────────────────────────────────────
  if (state === "idle") {
    return (
      <button
        ref={triggerRef}
        type="button"
        onClick={handleEnhance}
        className="
          group flex items-center gap-1.5 rounded-full
          border border-[#C8873A]/40 bg-white/80 px-2.5 py-1
          text-[10px] font-medium text-[#C8873A]
          shadow-sm backdrop-blur-sm
          transition-all duration-200
          hover:border-[#C8873A]/60
          hover:shadow-[0_0_10px_rgba(200,135,58,0.18)]
          active:scale-95
        "
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(200,135,58,0.04), rgba(200,135,58,0.04))",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundImage =
            "linear-gradient(135deg, rgba(200,135,58,0.10), rgba(224,168,87,0.18))";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundImage =
            "linear-gradient(135deg, rgba(200,135,58,0.04), rgba(200,135,58,0.04))";
        }}
      >
        <Sparkles size={11} aria-hidden="true" className="shrink-0" />
        <span>{t("button")}</span>
      </button>
    );
  }

  // ── loading ──────────────────────────────────────────────────────────────
  if (state === "loading") {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-[#C8873A]/10 px-2.5 py-1 text-[10px] font-medium text-[#C8873A]">
        <Loader2
          size={11}
          aria-hidden="true"
          className="shrink-0 animate-spin"
        />
        <span>{t("enhancing")}</span>
      </div>
    );
  }

  // ── error ────────────────────────────────────────────────────────────────
  if (state === "error") {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-medium text-red-600">
        <AlertCircle size={11} aria-hidden="true" className="shrink-0" />
        <span className="max-w-[100px] truncate">{errorMsg ?? t("errorGeneric")}</span>
        <button
          type="button"
          onClick={handleEnhance}
          className="ms-1 underline underline-offset-2"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  // ── preview modal ────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
        onClick={handleKeep}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-preview-title`}
        className="
          fixed inset-0 z-50 flex items-center justify-center p-4
          sm:p-6
        "
      >
        <div
          className="
            relative w-full max-w-3xl overflow-hidden rounded-2xl
            bg-[#FDF8F0] shadow-2xl
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#C8873A]/20 px-5 py-4">
            <div className="flex items-center gap-2">
              <Sparkles
                size={16}
                className="text-[#C8873A]"
                aria-hidden="true"
              />
              <h2 id={`${uid}-preview-title`} className="text-sm font-semibold text-[#12100C]">
                {t("previewTitle")}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleKeep}
              aria-label={t("keepOriginal")}
              className="rounded-full p-1 text-[#12100C]/50 transition hover:bg-black/5 hover:text-[#12100C]"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Before / After */}
          <div className="flex flex-col gap-3 p-5 sm:flex-row">
            {/* Before */}
            <div className="flex-1">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[#12100C]/40">
                {t("before")}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt={t("before")}
                className="h-48 w-full rounded-xl object-cover sm:h-56"
              />
            </div>

            {/* After */}
            <div className="flex-1">
              <p className="mb-2 flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-[#C8873A]">
                <Sparkles size={10} aria-hidden="true" />
                {t("after")}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={enhancedUrl ?? ""}
                alt={t("after")}
                className="h-48 w-full rounded-xl object-cover sm:h-56"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 border-t border-[#C8873A]/20 px-5 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleKeep}
              className="
                order-2 rounded-xl border border-[#12100C]/20 bg-white/60
                px-4 py-2.5 text-sm font-medium text-[#12100C]/70
                transition hover:bg-white sm:order-1
              "
            >
              {t("keepOriginal")}
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="
                order-1 flex items-center justify-center gap-2
                rounded-xl bg-[#C8401A] px-5 py-2.5 text-sm
                font-semibold text-white shadow-md
                transition hover:bg-[#b33516] active:scale-95
                sm:order-2
              "
            >
              <CheckCircle size={15} aria-hidden="true" />
              {t("useEnhanced")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
