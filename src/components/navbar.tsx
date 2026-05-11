import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";
import LocaleToggle from "@/components/locale-toggle";
import SavedNavBadge from "@/components/saved-nav-badge";
import RecentlyViewedDropdown from "@/components/recently-viewed-dropdown";
import CompareTray from "@/components/compare-tray";
import MobileMenu from "@/components/mobile-menu";
import { createClient } from "@/lib/supabase/server";

/**
 * Global site navigation — floating glass pill.
 *
 * IA principles:
 * - LEFT (after brand): Discovery — Browse, For diaspora, About.
 * - RIGHT cluster: Personal — Saved + Dashboard (signed in).
 *   Then utility — Locale toggle. Then primary CTA — Post a property.
 *   Sign in (signed out) takes the same slot as Saved+Dashboard.
 *
 * Sign out lives in the dashboard sidebar, not in the global nav.
 * Post a property is a SINGLE CTA — no duplicate middle link.
 * No icons next to text labels — keeps the row uniform.
 */
export default async function Navbar() {
  const t = await getTranslations("nav");
  const brand = await getTranslations("brand");

  let userInitials: string | null = null;
  let firstName: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const meta = user.user_metadata as { full_name?: string } | undefined;
      const fullName = meta?.full_name?.trim() || "";
      const name = fullName || user.email || "";

      // Derive initials (unchanged logic)
      userInitials =
        name
          .split(/[\s@.]+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((s) => s[0]?.toUpperCase() ?? "")
          .join("") || "U";

      // Derive first name for greeting
      // Priority: full_name first word → email local-part → null (greeting falls back to "Dashboard")
      firstName =
        fullName.split(" ")[0] ||
        user.email?.split("@")[0] ||
        null;
    }
  } catch {
    userInitials = null;
    firstName = null;
  }

  const isSignedIn = userInitials !== null;

  return (
    <header className="sticky top-3 z-40 px-3 sm:px-5">
      <nav
        className="glass-strong glass-highlight mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[var(--radius-pill)] border border-white/60 pe-2 ps-4 sm:ps-5"
        style={{ boxShadow: "var(--shadow-warm)" }}
      >
        {/* Brand — links home */}
        <Link
          href="/"
          className="smooth-fast flex items-center gap-3 py-2 text-ink hover:text-terracotta"
          aria-label="Sukan — home"
        >
          <SukanMark size={34} title={brand("name")} />
          <span className="flex flex-col leading-none">
            <span
              lang="ar"
              className="font-display text-lg tracking-wide text-ink"
              style={{ fontFamily: "var(--font-arabic)" }}
            >
              سوكان
            </span>
            <span className="font-display text-[11px] italic tracking-[0.18em] text-ink-mid" aria-hidden="true">
              SUKAN
            </span>
          </span>
        </Link>

        {/* Discovery links (center)
            md (768px): Browse + For diaspora + Agents visible; Guides + Insights + About hidden (too many links at 768px)
            lg (1024px): all six links visible */}
        <div className="hidden items-center gap-5 md:flex lg:gap-7">
          <Link
            href="/listings"
            className="smooth-fast text-sm text-ink/85 hover:text-terracotta"
          >
            {t("browse")}
          </Link>
          <Link
            href="/diaspora"
            className="smooth-fast text-sm text-ink/85 hover:text-terracotta"
          >
            {t("diaspora")}
          </Link>
          <Link
            href="/agents"
            className="smooth-fast text-sm text-ink/85 hover:text-terracotta"
          >
            {t("agents")}
          </Link>
          {/* Guides, Insights, About hidden at md — too crowded at 768px; shown at lg+ */}
          <Link
            href="/guides"
            className="smooth-fast hidden text-sm text-ink/85 hover:text-terracotta lg:inline"
          >
            {t("guides")}
          </Link>
          <Link
            href="/insights"
            className="smooth-fast hidden text-sm text-ink/85 hover:text-terracotta lg:inline"
          >
            {t("insights")}
          </Link>
          <Link
            href="/about"
            className="smooth-fast hidden text-sm text-ink/85 hover:text-terracotta lg:inline"
          >
            {t("about")}
          </Link>
        </div>

        {/* Right cluster: personal · utility · CTA
            Below md (< 768px): ONLY the MobileMenu hamburger is shown.
            md+ (≥ 768px): full desktop cluster — Saved, Recently viewed, Dashboard, locale, Sign in, Post CTA. */}
        <div className="flex items-center gap-2">
          {/* ── DESKTOP-ONLY items (hidden on mobile) ─────────────────────── */}

          {/* Personal — Saved + Recently viewed + Dashboard (signed in, desktop) */}
          {isSignedIn && (
            <>
              <Link
                href="/saved"
                className="smooth-fast relative hidden items-center gap-1.5 rounded-[var(--radius-pill)] border border-white/60 bg-white/40 px-3.5 py-1.5 text-sm text-ink hover:border-gold/50 hover:bg-gold/10 md:inline-flex"
              >
                {t("saved")}
                <SavedNavBadge />
              </Link>

              {/* Recently viewed dropdown — desktop only */}
              <span className="hidden md:contents">
                <RecentlyViewedDropdown />
              </span>

              <Link
                href="/dashboard"
                aria-label={firstName ? t("greeting", { name: firstName }) : t("dashboard")}
                className="smooth-fast hidden items-center gap-2 rounded-[var(--radius-pill)] border border-white/60 bg-white/50 px-2.5 py-1 text-sm text-ink hover:border-gold/50 hover:bg-gold/10 md:inline-flex"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-earth"
                  style={{
                    background:
                      "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
                  }}
                >
                  {userInitials}
                </span>
                {/* First-name greeting — hidden below lg, falls back gracefully */}
                <span className="hidden lg:inline" aria-hidden="true">
                  {firstName ? (
                    t("greeting", { name: firstName })
                  ) : (
                    t("dashboard")
                  )}
                </span>
              </Link>
            </>
          )}

          {/* Locale toggle — desktop only (also lives in the mobile drawer) */}
          <span className="hidden md:contents">
            <LocaleToggle />
          </span>

          {/* Sign in pill — signed out, desktop only */}
          {!isSignedIn && (
            <Link
              href="/sign-in"
              className="smooth-fast hidden rounded-[var(--radius-pill)] border border-white/60 bg-white/40 px-3.5 py-1.5 text-sm text-ink hover:border-gold/50 hover:bg-gold/10 md:inline-block"
            >
              {t("signIn")}
            </Link>
          )}

          {/* Primary CTA — desktop only; lives in drawer on mobile */}
          <Link
            href="/post"
            className="smooth-fast hidden rounded-[var(--radius-pill)] bg-terracotta px-4 py-1.5 text-sm font-semibold text-cream hover:bg-terracotta-deep md:inline-block"
            style={{ boxShadow: "0 4px 14px rgba(200, 64, 26, 0.28)" }}
          >
            {t("post")}
          </Link>

          {/* ── MOBILE hamburger — triggers the drawer (hidden md+) ────────── */}
          <MobileMenu
            isSignedIn={isSignedIn}
            firstName={firstName}
            userInitials={userInitials}
          />
        </div>
      </nav>

      {/* Floating compare tray — self-hides when empty */}
      <CompareTray />
    </header>
  );
}
