"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X, Home, Users, BookOpen, TrendingUp, Info, Heart, Clock, LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import LocaleToggle from "@/components/locale-toggle";

/**
 * Mobile navigation drawer — right-side slide-in (left in RTL).
 *
 * Breakpoints: visible hamburger trigger below md (< 768px).
 * All primary + secondary nav items live here on mobile.
 * Body scroll is NOT locked in v1 — keep it simple.
 */
export default function MobileMenu({
  isSignedIn,
  firstName,
  userInitials,
}: {
  isSignedIn: boolean;
  firstName: string | null;
  userInitials: string | null;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* ── Hamburger trigger — only visible below md ────────────────────── */}
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen(true)}
        className="smooth-fast md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/40 text-ink hover:border-gold/50 hover:bg-gold/10"
      >
        <Menu size={18} strokeWidth={1.8} />
      </button>

      {/* ── Overlay + drawer portal ──────────────────────────────────────── */}
      {open && (
        <>
          {/* Dimmer */}
          <div
            aria-hidden
            onClick={close}
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
            style={{
              animation: "sk_fade_in 200ms cubic-bezier(0.16,1,0.3,1) both",
            }}
          />

          {/* Drawer card — slides in from end edge */}
          <div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-y-0 end-0 z-50 flex w-[min(320px,88vw)] flex-col overflow-y-auto rounded-s-[var(--radius-glass)] border-s border-white/60"
            style={{
              background: "rgba(253,248,240,0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "var(--shadow-warm, -8px 0 40px rgba(18,16,12,0.12))",
              animation: "sk_drawer_in 260ms cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-sand/60 px-5 py-4">
              <span className="font-display text-base tracking-wide text-ink">
                {/* TODO: i18n */}
                Menu
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="smooth-fast flex h-8 w-8 items-center justify-center rounded-full text-ink/50 hover:bg-ink/8 hover:text-ink"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Primary nav items */}
            <nav className="flex flex-col px-3 py-4">
              <DrawerLink href="/listings" icon={<Home size={17} strokeWidth={1.8} />} onClick={close}>
                {t("browse")}
              </DrawerLink>
              <DrawerLink href="/diaspora" icon={<Users size={17} strokeWidth={1.8} />} onClick={close}>
                {t("diaspora")}
              </DrawerLink>
              <DrawerLink href="/agents" icon={<Users size={17} strokeWidth={1.8} />} onClick={close}>
                {t("agents")}
              </DrawerLink>
              <DrawerLink href="/guides" icon={<BookOpen size={17} strokeWidth={1.8} />} onClick={close}>
                {/* TODO: i18n */}
                Guides
              </DrawerLink>
              <DrawerLink href="/insights" icon={<TrendingUp size={17} strokeWidth={1.8} />} onClick={close}>
                {/* TODO: i18n */}
                Insights
              </DrawerLink>
              <DrawerLink href="/about" icon={<Info size={17} strokeWidth={1.8} />} onClick={close}>
                {t("about")}
              </DrawerLink>
            </nav>

            {/* Divider */}
            <div className="mx-5 border-t border-sand/70" />

            {/* Secondary items */}
            <div className="flex flex-col px-3 py-4">
              {isSignedIn ? (
                <>
                  <DrawerLink href="/saved" icon={<Heart size={17} strokeWidth={1.8} />} onClick={close}>
                    {t("saved")}
                  </DrawerLink>
                  <DrawerLink href="/saved?tab=recent" icon={<Clock size={17} strokeWidth={1.8} />} onClick={close}>
                    {/* TODO: i18n */}
                    Recently viewed
                  </DrawerLink>
                  {/* Dashboard row with avatar */}
                  <Link
                    href="/dashboard"
                    onClick={close}
                    className="smooth-fast flex items-center gap-3 rounded-[var(--radius-pill)] px-3 py-3 text-base text-ink hover:bg-gold/10"
                  >
                    <span
                      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-earth"
                      style={{
                        background: "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
                      }}
                    >
                      {userInitials}
                    </span>
                    <span className="font-medium">
                      {firstName ? `Hi, ${firstName}` : "Dashboard"}
                      {/* TODO: i18n */}
                    </span>
                  </Link>
                </>
              ) : (
                <DrawerLink href="/sign-in" icon={<LogIn size={17} strokeWidth={1.8} />} onClick={close}>
                  {t("signIn")}
                </DrawerLink>
              )}

              {/* Locale toggle row */}
              <div className="flex items-center gap-3 px-3 py-2.5">
                <span className="text-sm text-ink/50">
                  {/* TODO: i18n */}
                  Language
                </span>
                <LocaleToggle />
              </div>
            </div>

            {/* Spacer pushes CTA to bottom */}
            <div className="flex-1" />

            {/* Primary CTA */}
            <div className="px-5 pb-6 pt-3">
              <Link
                href="/post"
                onClick={close}
                className="smooth-fast flex w-full items-center justify-center rounded-[var(--radius-pill)] bg-terracotta py-3 text-sm font-semibold text-cream hover:bg-terracotta-deep"
                style={{ boxShadow: "0 4px 14px rgba(200, 64, 26, 0.28)" }}
              >
                {t("post")}
              </Link>
            </div>
          </div>

          {/* Keyframe animations — scoped to the drawer; avoids globals.css edits */}
          <style>{`
            @keyframes sk_fade_in {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            @keyframes sk_drawer_in {
              from { transform: translateX(100%); opacity: 0.6; }
              to   { transform: translateX(0);    opacity: 1; }
            }
            /* RTL: drawer slides in from the left */
            [dir="rtl"] #mobile-drawer {
              animation-name: sk_drawer_in_rtl;
            }
            @keyframes sk_drawer_in_rtl {
              from { transform: translateX(-100%); opacity: 0.6; }
              to   { transform: translateX(0);     opacity: 1; }
            }
          `}</style>
        </>
      )}
    </>
  );
}

// ─── Helper: tappable drawer row ────────────────────────────────────────────

function DrawerLink({
  href,
  icon,
  onClick,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="smooth-fast flex items-center gap-3 rounded-[var(--radius-pill)] px-3 py-3 text-base text-ink hover:bg-gold/10"
    >
      <span className="text-terracotta/70">{icon}</span>
      {children}
    </Link>
  );
}
