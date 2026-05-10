"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export default function LocaleToggle() {
  const t = useTranslations("brand");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const next: Locale = locale === "en" ? "ar" : "en";

  function flip() {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <button
      type="button"
      onClick={flip}
      disabled={pending}
      aria-label={`Switch language to ${routing.locales.find((l) => l !== locale)}`}
      className="smooth-fast rounded-[var(--radius-pill)] border border-white/60 bg-white/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink-mid hover:border-gold/50 hover:bg-gold/10 hover:text-ink disabled:opacity-50"
    >
      {t("languageToggle")}
    </button>
  );
}
