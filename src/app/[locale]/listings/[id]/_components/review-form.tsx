"use client";

import { useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { StarRating } from "@/components/star-rating";
import { GlassTextarea } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";

interface ReviewFormProps {
  listingId: string;
  landlordId: string;
  trigger: ReactNode;
}

export function ReviewForm({ listingId, landlordId, trigger }: ReviewFormProps) {
  const t = useTranslations("reviews");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [commentAr, setCommentAr] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
    // reset on close
    setRating(0);
    setComment("");
    setCommentAr("");
    setStatus("idle");
    setErrorMsg(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setStatus("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landlord_id: landlordId,
          listing_id: listingId,
          rating,
          comment: comment.trim() || undefined,
          comment_ar: commentAr.trim() || undefined,
        }),
      });

      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
        setErrorMsg(json.error ?? "error");
      }
    } catch {
      setStatus("error");
      setErrorMsg("error");
    }
  }

  return (
    <>
      {/* Trigger slot — whatever the parent passes */}
      <button
        type="button"
        onClick={openDialog}
        aria-haspopup="dialog"
        className="contents"
      >
        {trigger}
      </button>

      {/* Native dialog */}
      <dialog
        ref={dialogRef}
        aria-labelledby="review-dialog-title"
        onClick={(e) => {
          // Close when clicking the backdrop
          if (e.target === dialogRef.current) closeDialog();
        }}
        className="m-auto max-w-md w-full rounded-[var(--radius-glass-lg)] border-0 p-0 backdrop:bg-earth/40 backdrop:backdrop-blur-sm"
        style={{
          background: "linear-gradient(135deg, rgba(255,252,246,0.97), rgba(244,234,215,0.95))",
          boxShadow: "var(--shadow-warm-lg)",
        }}
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 id="review-dialog-title" className="font-display text-2xl text-ink tracking-tight">
              {t("leaveReview")}
            </h2>
            <button
              type="button"
              onClick={closeDialog}
              aria-label={t("close")}
              className="smooth rounded-full w-8 h-8 flex items-center justify-center text-ink-mid hover:bg-sand-dk/30 transition-colors"
            >
              ✕
            </button>
          </div>

          {status === "sent" ? (
            /* Success state */
            <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="text-3xl" aria-hidden="true">✓</span>
              <p className="font-sans text-ink text-sm">{t("successMessage")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Star rating */}
              <div role="group" aria-labelledby="review-rating-label" className="flex flex-col gap-1.5">
                <p id="review-rating-label" className="text-xs font-semibold uppercase tracking-wider text-gold-dk">
                  {t("ratingLabel")}
                </p>
                <StarRating
                  value={rating}
                  interactive
                  size="lg"
                  onChange={setRating}
                />
              </div>

              {/* English comment */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="review-comment" className="text-xs font-semibold uppercase tracking-wider text-gold-dk">
                  {t("commentLabel")}
                </label>
                <GlassTextarea
                  id="review-comment"
                  tone="light"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("commentLabel")}
                />
              </div>

              {/* Arabic comment */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="review-comment-ar" className="text-xs font-semibold uppercase tracking-wider text-gold-dk">
                  {t("commentArLabel")}
                </label>
                <GlassTextarea
                  id="review-comment-ar"
                  tone="light"
                  rows={3}
                  value={commentAr}
                  onChange={(e) => setCommentAr(e.target.value)}
                  placeholder={t("commentArLabel")}
                  dir="rtl"
                  lang="ar"
                />
              </div>

              {/* Error message */}
              {status === "error" && (
                <p className="text-sm text-terracotta" role="alert" id="review-error">
                  {errorMsg ?? t("errorGeneric")}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-1">
                <GlassButton
                  type="button"
                  variant="ghost-light"
                  size="sm"
                  onClick={closeDialog}
                >
                  {t("cancel")}
                </GlassButton>
                <GlassButton
                  type="submit"
                  variant="terracotta"
                  size="md"
                  disabled={rating === 0 || status === "loading"}
                >
                  {status === "loading" ? "…" : t("submit")}
                </GlassButton>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
