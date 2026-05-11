"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Mail, Check, Loader2 } from "lucide-react";

interface WaitlistFormProps {
  source?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export function WaitlistForm({ source = "whatsapp_bot" }: WaitlistFormProps) {
  const t = useTranslations("waitlist");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "submitting") return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, locale }),
      });
      const data = await res.json();
      setStatus(data.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex items-center gap-2 rounded-[var(--radius-pill)] bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-800"
      >
        <Check size={16} aria-hidden />
        {t("success")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label className="sr-only" htmlFor="waitlist-email">
        {t("emailLabel")}
      </label>
      <div className="relative">
        <Mail
          size={16}
          aria-hidden
          className="absolute top-1/2 ltr:left-3 rtl:right-3 -translate-y-1/2 text-ink-mid"
        />
        <input
          id="waitlist-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          disabled={status === "submitting"}
          className="smooth-fast w-full rounded-[var(--radius-pill)] border border-sand-dk bg-white/85 ltr:pl-9 rtl:pr-9 ltr:pr-4 rtl:pl-4 py-2.5 text-sm text-ink placeholder:text-ink-mid focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="smooth inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-terracotta px-6 py-3 text-sm font-semibold text-white shadow-md hover:brightness-[1.05] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? (
          <Loader2 size={16} className="animate-spin" aria-hidden />
        ) : null}
        {t("submit")}
      </button>
      {status === "error" && (
        <p role="alert" className="text-xs text-rose-700">
          {t("error")}
        </p>
      )}
    </form>
  );
}
