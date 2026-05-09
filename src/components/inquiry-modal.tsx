"use client";

import { useTransition, useState, useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import SukanMark from "@/components/sukan-mark";
import type { Listing } from "@/lib/sample-listings";

interface InquiryModalProps {
  listing: Listing;
  onClose: () => void;
}

type SubmitState = "idle" | "success" | "error";

export default function InquiryModal({ listing, onClose }: InquiryModalProps) {
  const t = useTranslations("inquiry");
  const locale = useLocale();
  const uid = useId();

  const listingTitle = locale === "ar" ? listing.titleAr : listing.titleEn;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [isPending, startTransition] = useTransition();

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMessage(t("errorValidation"));
      setSubmitState("error");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listingId: listing.id,
            name: name.trim(),
            phone: phone.trim(),
            message: message.trim(),
            locale,
          }),
        });

        const data = (await res.json()) as { ok: boolean; error?: string };

        if (data.ok) {
          setSubmitState("success");
        } else {
          setErrorMessage(data.error ?? t("errorGeneric"));
          setSubmitState("error");
        }
      } catch {
        setErrorMessage(t("errorGeneric"));
        setSubmitState("error");
      }
    });
  }

  const waUrl = `https://wa.me/${listing.whatsappContact.replace(/\D/g, "")}`;
  const telUrl = `tel:${listing.whatsappContact}`;

  const nameId = `${uid}-name`;
  const phoneId = `${uid}-phone`;
  const messageId = `${uid}-message`;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth/80 backdrop-blur-sm"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${uid}-title`}
    >
      {/* Panel */}
      <div className="relative w-full max-w-md bg-earth border border-gold/20 rounded-[var(--radius-card)] shadow-[0_8px_48px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gold/15 px-6 py-4">
          <SukanMark size={28} monochrome="gold" />
          <div className="flex-1 min-w-0">
            <p
              id={`${uid}-title`}
              className="text-parchment font-semibold text-sm leading-snug truncate"
            >
              {t("title")}
            </p>
            <p className="text-mute-soft text-xs truncate mt-0.5">
              {listingTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="flex-none w-8 h-8 flex items-center justify-center rounded-full text-mute-soft hover:text-parchment hover:bg-gold/10 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        {submitState === "success" ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center justify-center gap-5 px-6 py-12 text-center">
            <SukanMark size={48} monochrome="gold" />
            <div className="flex flex-col gap-2">
              <p className="font-display text-2xl text-parchment">
                {t("successTitle")}
              </p>
              <p className="text-mute-soft text-sm leading-relaxed max-w-xs">
                {t("successBody")}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-[var(--radius-pill)] border border-gold/30 text-gold px-8 py-3 text-sm hover:bg-gold/10 transition-colors"
            >
              {t("close")}
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <form onSubmit={handleSubmit} noValidate className="flex flex-col p-6 gap-5">

            {/* Name */}
            <div className="flex flex-col">
              <label
                htmlFor={nameId}
                className="text-xs uppercase tracking-wider text-gold/80 mb-2"
              >
                {t("name")}
              </label>
              <input
                id={nameId}
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (submitState === "error") setSubmitState("idle");
                }}
                autoComplete="name"
                className="py-3.5 px-4 text-base bg-earth-soft border border-gold/20 rounded-md text-parchment placeholder:text-mute-soft focus:outline-none focus:border-gold/50 transition-colors"
                placeholder={t("name")}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label
                htmlFor={phoneId}
                className="text-xs uppercase tracking-wider text-gold/80 mb-2"
              >
                {t("phone")}
              </label>
              <input
                id={phoneId}
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (submitState === "error") setSubmitState("idle");
                }}
                autoComplete="tel"
                inputMode="tel"
                className="py-3.5 px-4 text-base bg-earth-soft border border-gold/20 rounded-md text-parchment placeholder:text-mute-soft focus:outline-none focus:border-gold/50 transition-colors"
                placeholder={t("phone")}
              />
              <p className="mt-1.5 text-xs text-mute-soft">{t("phoneHelp")}</p>
            </div>

            {/* Message */}
            <div className="flex flex-col">
              <label
                htmlFor={messageId}
                className="text-xs uppercase tracking-wider text-gold/80 mb-2"
              >
                {t("message")}
              </label>
              <textarea
                id={messageId}
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (submitState === "error") setSubmitState("idle");
                }}
                className="py-3.5 px-4 text-base bg-earth-soft border border-gold/20 rounded-md text-parchment placeholder:text-mute-soft focus:outline-none focus:border-gold/50 transition-colors resize-none"
                placeholder={t("messagePlaceholder")}
              />
            </div>

            {/* Inline error */}
            {submitState === "error" && errorMessage && (
              <p
                role="alert"
                className="rounded-md bg-terracotta/10 border border-terracotta/30 px-4 py-3 text-sm text-terracotta"
              >
                {errorMessage}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-terracotta hover:bg-terracotta-deep disabled:opacity-60 disabled:cursor-not-allowed text-parchment font-semibold py-3.5 text-base transition-colors"
            >
              {isPending ? (
                <>
                  <SpinnerIcon />
                  {t("sending")}
                </>
              ) : (
                t("send")
              )}
            </button>

            {/* Direct contact links */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-mute-soft hover:text-gold transition-colors underline-offset-2 hover:underline"
              >
                {t("orWhatsapp")}
              </a>
              <span className="text-gold/20" aria-hidden>|</span>
              <a
                href={telUrl}
                className="text-xs text-mute-soft hover:text-gold transition-colors underline-offset-2 hover:underline"
              >
                {t("orPhone")}
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── Micro icons ── */

function CloseIcon() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin"
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
