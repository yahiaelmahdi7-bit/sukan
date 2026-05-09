import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const brand = useTranslations("brand");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-gold/10 bg-earth-deep">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <SukanMark size={40} title={brand("name")} />
              <span className="font-display text-2xl text-parchment">
                {brand("name")}
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm text-mute-soft">
              {brand("tagline")}
            </p>
            <p className="mt-6 text-xs uppercase tracking-widest text-gold/70">
              {t("madeIn")}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold/70">
              {nav("browse")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-parchment">
              <li>
                <Link href="/" className="hover:text-gold-bright transition">
                  {nav("browse")}
                </Link>
              </li>
              <li>
                <Link
                  href="/post"
                  className="hover:text-gold-bright transition"
                >
                  {nav("post")}
                </Link>
              </li>
              <li>
                <Link
                  href="/diaspora"
                  className="hover:text-gold-bright transition"
                >
                  {nav("diaspora")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-gold-bright transition"
                >
                  {nav("about")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold/70">
              {t("contact")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-parchment">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-gold-bright transition"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-gold-bright transition"
                >
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-gold-bright transition"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-gold/10 pt-6 text-xs text-mute-soft sm:flex-row sm:items-center">
          <span>
            © {year} {brand("name")}. {t("rights")}.
          </span>
          <span aria-hidden className="wave-divider w-32 opacity-60" />
        </div>
      </div>
    </footer>
  );
}
