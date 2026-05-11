import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const brand = useTranslations("brand");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-sand-dk bg-cream-deep">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <SukanMark size={40} title={brand("name")} />
              <span lang="ar" className="font-display text-2xl text-ink">
                {brand("name")}
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm text-ink-mid">
              {brand("tagline")}
            </p>
            <p className="mt-6 text-xs uppercase tracking-widest text-gold-dk">
              {t("madeIn")}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-dk">
              {nav("browse")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li>
                <Link href="/" className="hover:text-terracotta transition">
                  {nav("browse")}
                </Link>
              </li>
              <li>
                <Link
                  href="/post"
                  className="hover:text-terracotta transition"
                >
                  {nav("post")}
                </Link>
              </li>
              <li>
                <Link
                  href="/diaspora"
                  className="hover:text-terracotta transition"
                >
                  {nav("diaspora")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-terracotta transition"
                >
                  {nav("about")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-dk">
              {t("contact")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-terracotta transition"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-terracotta transition"
                >
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-terracotta transition"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-sand-dk pt-6 text-xs text-ink-mid sm:flex-row sm:items-center">
          <span>
            © {year} {brand("name")}. {t("rights")}.
          </span>
          <span aria-hidden="true" className="wave-divider w-32 opacity-60" />
        </div>
      </div>
    </footer>
  );
}
