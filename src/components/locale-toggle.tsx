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
      className="rounded-pill border border-gold/30 px-4 py-1.5 text-sm text-parchment hover:border-gold hover:bg-gold/10 transition disabled:opacity-50"
    >
      {t("languageToggle")}
    </button>
  );
}
