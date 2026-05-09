"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("errors");

  const excerpt = error.message
    ? error.message.slice(0, 200)
    : "Unknown error";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-32 px-4 text-center bg-earth">
      {/* Brand mark */}
      <div className="opacity-60">
        <SukanMark size={72} />
      </div>

      {/* Headline */}
      <h1 className="mt-8 font-display text-4xl text-parchment sm:text-5xl">
        {t("genericTitle")}
      </h1>

      {/* Body */}
      <p className="mt-4 max-w-sm text-sm text-mute-soft leading-relaxed">
        {t("genericBody")}
      </p>

      {/* Error excerpt */}
      {excerpt && (
        <pre className="mt-6 max-w-md rounded-card border border-gold/10 bg-sand px-4 py-3 text-left font-mono text-xs text-mute-soft whitespace-pre-wrap break-all">
          {excerpt}
        </pre>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="rounded-pill bg-terracotta px-6 py-2.5 text-sm font-semibold text-parchment hover:bg-terracotta-deep transition"
        >
          {t("tryAgain")}
        </button>
        <Link
          href="/"
          className="rounded-pill border border-parchment/20 px-6 py-2.5 text-sm font-medium text-parchment/70 hover:text-parchment hover:border-parchment/40 transition"
        >
          {t("notFoundHome")}
        </Link>
      </div>
    </main>
  );
}
