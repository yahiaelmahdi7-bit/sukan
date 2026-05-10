"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { useLocale } from "next-intl";

/**
 * Floating "Back to home" pill — anchors below the navbar at the inline-START
 * corner (so it doesn't collide with the listing-detail TOC, which lives at
 * end). Shown on every page EXCEPT the landing page itself.
 *
 * File still named back-to-dashboard-pill.tsx for import compatibility; the
 * pill now routes to "/" (landing), not "/dashboard".
 */
export default function BackToDashboardPill() {
  const pathname = usePathname();
  const locale = useLocale();
  const isAr = locale === "ar";

  const path = pathname ?? "";
  const isHome = path === "/" || /^\/[a-z]{2}\/?$/.test(path);
  if (isHome) return null;

  const label = isAr ? "العودة إلى الرئيسية" : "Back to home";
  // Arrow points "backwards" relative to reading direction: left in LTR, right in RTL.
  const Arrow = isAr ? ArrowRight : ArrowLeft;

  return (
    <Link
      href="/"
      aria-label={label}
      className="smooth-fast fixed top-[4.75rem] start-5 z-30 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-white/60 bg-cream/90 px-4 py-2 text-xs font-medium text-ink backdrop-blur-md hover:border-gold/55 hover:bg-gold/15 hover:text-terracotta"
      style={{ boxShadow: "var(--shadow-warm-sm)" }}
    >
      <Arrow size={14} aria-hidden />
      <Home size={12} aria-hidden className="opacity-70" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
