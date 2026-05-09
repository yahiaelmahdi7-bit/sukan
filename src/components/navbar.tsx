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
      userInitials = name
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
    <header className="sticky top-0 z-40 border-b border-sand-dk bg-cream/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-ink hover:text-terracotta transition"
          title="Sukan · سُكَن"
        >
          <SukanMark size={40} title={brand("name")} />
          <span className="flex flex-col leading-none">
            <span
              className="font-display text-xl tracking-wide text-ink"
              style={{ fontFamily: "var(--font-arabic)" }}
            >
              سُكَن
            </span>
            <span className="font-display text-sm italic text-ink-mid tracking-wider">
              Sukan
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/listings"
            className="text-sm text-ink hover:text-terracotta transition"
          >
            {t("browse")}
          </Link>
          <Link
            href="/saved"
            className="relative flex items-center gap-1.5 text-sm text-ink hover:text-terracotta transition"
          >
            <Heart size={14} strokeWidth={1.8} aria-hidden />
            {t("saved")}
            <SavedNavBadge />
          </Link>
          <Link
            href="/post"
            className="text-sm text-ink hover:text-terracotta transition"
          >
            {t("post")}
          </Link>
          <Link
            href="/diaspora"
            className="text-sm text-ink hover:text-terracotta transition"
          >
            {t("diaspora")}
          </Link>
          <Link
            href="/about"
            className="text-sm text-ink hover:text-terracotta transition"
          >
            {t("about")}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <LocaleToggle />

          {userInitials ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-2 rounded-pill border border-sand-dk px-3 py-1.5 text-sm text-ink hover:bg-gold/10 transition"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold text-earth text-xs font-semibold">
                  {userInitials}
                </span>
                <span className="hidden lg:inline">Dashboard</span>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="hidden sm:inline-block rounded-pill border border-sand-dk px-3 py-1.5 text-xs text-ink-mid hover:text-ink hover:border-gold/40 transition"
                >
                  {t("signOut") ?? "Sign out"}
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="hidden rounded-pill border border-sand-dk px-4 py-1.5 text-sm text-ink hover:bg-gold/10 transition sm:inline-block"
            >
              {t("signIn")}
            </Link>
          )}

          <Link
            href="/post"
            className="rounded-pill bg-terracotta px-4 py-1.5 text-sm font-semibold text-cream hover:bg-terracotta-deep transition"
          >
            {t("post")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
