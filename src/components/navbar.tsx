import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";
import SukanMark from "@/components/sukan-mark";
import LocaleToggle from "@/components/locale-toggle";
import SavedNavBadge from "@/components/saved-nav-badge";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/[locale]/(auth)/actions";

export default async function Navbar() {
  const t = await getTranslations("nav");
  const brand = await getTranslations("brand");

  let userInitials: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const meta = user.user_metadata as { full_name?: string } | undefined;
      const name = meta?.full_name?.trim() || user.email || "";
      userInitials =
        name
          .split(/[\s@.]+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((s) => s[0]?.toUpperCase() ?? "")
          .join("") || "U";
    }
  } catch {
    userInitials = null;
  }

  return (
    <header className="sticky top-3 z-40 px-3 sm:px-5">
      <nav
        className="glass-strong glass-highlight mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[var(--radius-pill)] border border-white/60 pe-2 ps-4 sm:ps-5"
        style={{ boxShadow: "var(--shadow-warm)" }}
      >
        {/* Brand */}
        <Link
          href="/"
          className="smooth-fast flex items-center gap-3 py-2 text-ink hover:text-terracotta"
          title="Sukan · سُكَن"
        >
          <SukanMark size={34} title={brand("name")} />
          <span className="flex flex-col leading-none">
            <span
              className="font-display text-lg tracking-wide text-ink"
              style={{ fontFamily: "var(--font-arabic)" }}
            >
              سُكَن
            </span>
            <span className="font-display text-[11px] italic tracking-[0.18em] text-ink-mid">
              SUKAN
            </span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden items-center gap-7 md:flex">
          <Link
            href="/listings"
            className="smooth-fast text-sm text-ink/85 hover:text-terracotta"
          >
            {t("browse")}
          </Link>
          <Link
            href="/saved"
            className="smooth-fast relative flex items-center gap-1.5 text-sm text-ink/85 hover:text-terracotta"
          >
            <Heart size={14} strokeWidth={1.8} aria-hidden />
            {t("saved")}
            <SavedNavBadge />
          </Link>
          <Link
            href="/post"
            className="smooth-fast text-sm text-ink/85 hover:text-terracotta"
          >
            {t("post")}
          </Link>
          <Link
            href="/diaspora"
            className="smooth-fast text-sm text-ink/85 hover:text-terracotta"
          >
            {t("diaspora")}
          </Link>
          <Link
            href="/about"
            className="smooth-fast text-sm text-ink/85 hover:text-terracotta"
          >
            {t("about")}
          </Link>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <LocaleToggle />

          {userInitials ? (
            <>
              <Link
                href="/dashboard"
                className="smooth-fast hidden items-center gap-2 rounded-[var(--radius-pill)] border border-white/60 bg-white/50 px-2.5 py-1 text-sm text-ink hover:border-gold/50 hover:bg-gold/10 sm:inline-flex"
              >
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-earth"
                  style={{
                    background:
                      "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
                  }}
                >
                  {userInitials}
                </span>
                <span className="hidden lg:inline">Dashboard</span>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="smooth-fast hidden rounded-[var(--radius-pill)] border border-white/60 bg-white/40 px-3 py-1.5 text-xs text-ink-mid hover:border-gold/50 hover:text-ink sm:inline-block"
                >
                  {t("signOut") ?? "Sign out"}
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="smooth-fast hidden rounded-[var(--radius-pill)] border border-white/60 bg-white/40 px-3.5 py-1.5 text-sm text-ink hover:border-gold/50 hover:bg-gold/10 sm:inline-block"
            >
              {t("signIn")}
            </Link>
          )}

          <Link
            href="/post"
            className="smooth-fast rounded-[var(--radius-pill)] bg-terracotta px-4 py-1.5 text-sm font-semibold text-cream hover:bg-terracotta-deep"
            style={{ boxShadow: "0 4px 14px rgba(200, 64, 26, 0.28)" }}
          >
            {t("post")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
