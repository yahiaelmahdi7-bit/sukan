import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";
import LocaleToggle from "@/components/locale-toggle";

export default function Navbar() {
  const t = useTranslations("nav");
  const brand = useTranslations("brand");

  return (
    <header className="sticky top-0 z-40 border-b border-gold/10 bg-earth/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-parchment hover:text-gold-bright transition"
        >
          <SukanMark size={36} title={brand("name")} />
          <span className="font-display text-2xl tracking-wide">
            {brand("name")}
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm text-parchment hover:text-gold-bright transition"
          >
            {t("browse")}
          </Link>
          <Link
            href="/post"
            className="text-sm text-parchment hover:text-gold-bright transition"
          >
            {t("post")}
          </Link>
          <Link
            href="/diaspora"
            className="text-sm text-parchment hover:text-gold-bright transition"
          >
            {t("diaspora")}
          </Link>
          <Link
            href="/about"
            className="text-sm text-parchment hover:text-gold-bright transition"
          >
            {t("about")}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <LocaleToggle />
          <Link
            href="/sign-in"
            className="hidden rounded-pill border border-gold/40 px-4 py-1.5 text-sm text-parchment hover:bg-gold/10 transition sm:inline-block"
          >
            {t("signIn")}
          </Link>
          <Link
            href="/post"
            className="rounded-pill bg-terracotta px-4 py-1.5 text-sm font-semibold text-parchment hover:bg-terracotta-deep transition"
          >
            {t("post")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
