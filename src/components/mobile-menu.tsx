"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Menu,
  X,
  Home,
  Users,
  BookOpen,
  TrendingUp,
  Info,
  Heart,
  Clock,
  LogIn,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import LocaleToggle from "@/components/locale-toggle";

/**
 * Mobile navigation drawer — right-side slide-in (left in RTL).
 *
 * The overlay + drawer are rendered via createPortal to document.body
 * because the navbar's backdrop-filter creates a new containing block
 * which would otherwise clip the fixed-position drawer to the navbar.
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
  const tm = useTranslations("mobileMenu");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape + return focus
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Move focus into drawer on open
  useEffect(() => {
    if (open) {
      const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    }
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Portal target — only available after mount
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const overlay =
    open && portalTarget
      ? createPortal(
          <>
            {/* Dimmer */}
            <div
              aria-hidden
              onClick={close}
              className="fixed inset-0 z-[100] bg-ink/40 backdrop-blur-sm"
              style={{
                animation: "sk_fade_in 200ms cubic-bezier(0.16,1,0.3,1) both",
              }}
            />

            {/* Drawer */}
            <div
              ref={drawerRef}
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={tm("label")}
              className="fixed inset-y-0 end-0 z-[101] flex w-[min(320px,88vw)] flex-col overflow-y-auto rounded-s-[var(--radius-glass)] border-s border-white/60"
              style={{
                background: "rgba(253,248,240,0.98)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow:
                  "var(--shadow-warm, -8px 0 40px rgba(18,16,12,0.18))",
                animation:
                  "sk_drawer_in 260ms cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-sand/60 px-5 py-4">
                <span className="font-display text-base tracking-wide text-ink">
                  {tm("header")}
                </span>
                <button
                  type="button"
                  aria-label={tm("close")}
                  onClick={close}
                  className="smooth-fast flex h-8 w-8 items-center justify-center rounded-full text-ink/50 hover:bg-ink/8 hover:text-ink"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>

              {/* Primary nav items */}
              <nav className="flex flex-col px-3 py-4">
                <DrawerLink
                  href="/listings"
                  icon={<Home size={17} strokeWidth={1.8} />}
                  onClick={close}
                >
                  {t("browse")}
                </DrawerLink>
                <DrawerLink
                  href="/diaspora"
                  icon={<Users size={17} strokeWidth={1.8} />}
                  onClick={close}
                >
                  {t("diaspora")}
                </DrawerLink>
                <DrawerLink
                  href="/agents"
                  icon={<Users size={17} strokeWidth={1.8} />}
                  onClick={close}
                >
                  {t("agents")}
                </DrawerLink>
                <DrawerLink
                  href="/guides"
                  icon={<BookOpen size={17} strokeWidth={1.8} />}
                  onClick={close}
                >
                  {t("guides")}
                </DrawerLink>
                <DrawerLink
                  href="/insights"
                  icon={<TrendingUp size={17} strokeWidth={1.8} />}
                  onClick={close}
                >
                  {t("insights")}
                </DrawerLink>
                <DrawerLink
                  href="/about"
                  icon={<Info size={17} strokeWidth={1.8} />}
                  onClick={close}
                >
                  {t("about")}
                </DrawerLink>
              </nav>

              <div className="mx-5 border-t border-sand/70" />

              {/* Secondary items */}
              <div className="flex flex-col px-3 py-4">
                {isSignedIn ? (
                  <>
                    <DrawerLink
                      href="/saved"
                      icon={<Heart size={17} strokeWidth={1.8} />}
                      onClick={close}
                    >
                      {t("saved")}
                    </DrawerLink>
                    <DrawerLink
                      href="/saved?tab=recent"
                      icon={<Clock size={17} strokeWidth={1.8} />}
                      onClick={close}
                    >
                      {tm("recentlyViewed")}
                    </DrawerLink>
                    <Link
                      href="/dashboard"
                      onClick={close}
                      className="smooth-fast flex items-center gap-3 rounded-[var(--radius-pill)] px-3 py-3 text-base text-ink hover:bg-gold/10"
                    >
                      <span
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-earth"
                        style={{
                          background:
                            "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
                        }}
                      >
                        {userInitials}
                      </span>
                      <span className="font-medium">
                        {firstName
                          ? tm("signedInAs", { name: firstName })
                          : t("dashboard")}
                      </span>
                    </Link>
                  </>
                ) : (
                  <DrawerLink
                    href="/sign-in"
                    icon={<LogIn size={17} strokeWidth={1.8} />}
                    onClick={close}
                  >
                    {t("signIn")}
                  </DrawerLink>
                )}

                {/* Locale toggle row */}
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <span className="text-sm text-ink/50">{tm("language")}</span>
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

            {/* Scoped keyframes */}
            <style>{`
              @keyframes sk_fade_in { from { opacity: 0 } to { opacity: 1 } }
              @keyframes sk_drawer_in {
                from { transform: translateX(100%); opacity: 0.6 }
                to   { transform: translateX(0);    opacity: 1 }
              }
              [dir="rtl"] #mobile-drawer {
                animation-name: sk_drawer_in_rtl;
              }
              @keyframes sk_drawer_in_rtl {
                from { transform: translateX(-100%); opacity: 0.6 }
                to   { transform: translateX(0);     opacity: 1 }
              }
              @media (prefers-reduced-motion: reduce) {
                #mobile-drawer, [aria-hidden="true"] {
                  animation: none !important;
                }
              }
            `}</style>
          </>,
          portalTarget,
        )
      : null;

  return (
    <>
      {/* Hamburger trigger — only visible below md */}
      <button
        ref={triggerRef}
        type="button"
        aria-label={tm("open")}
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen(true)}
        className="smooth-fast md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/40 text-ink hover:border-gold/50 hover:bg-gold/10"
      >
        <Menu size={18} strokeWidth={1.8} />
      </button>

      {overlay}
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
