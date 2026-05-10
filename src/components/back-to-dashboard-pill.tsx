"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface Props {
  signedIn: boolean;
}

/**
 * Floating "Back to dashboard" pill — appears on every non-dashboard page when
 * the viewer is signed in. Anchors below the navbar (top: 4.75rem) in the
 * inline-end corner; RTL-safe via end-/start- logical positioning and a
 * direction-flipped arrow icon.
 */
export default function BackToDashboardPill({ signedIn }: Props) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const isAr = locale === "ar";

  if (!signedIn) return null;

  const path = pathname ?? "";
  if (path.startsWith("/dashboard") || /^\/[a-z]{2}\/dashboard/.test(path)) {
    return null;
  }

  const label = t("backToDashboard");
  const Arrow = isAr ? ArrowRight : ArrowLeft;

  return (
    <Link
      href="/dashboard"
      aria-label={label}
      className="smooth-fast fixed top-[4.75rem] end-4 z-30 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-white/60 bg-cream/85 px-3.5 py-1.5 text-xs font-medium text-ink backdrop-blur-md hover:border-gold/55 hover:bg-gold/15 hover:text-terracotta"
      style={{ boxShadow: "var(--shadow-warm-sm)" }}
    >
      <Arrow size={12} aria-hidden />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
