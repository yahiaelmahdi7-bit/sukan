import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";

export default async function EmptyState() {
  const t = await getTranslations("browse");

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
      <SukanMark size={80} monochrome="gold" className="opacity-20" />
      <div className="space-y-2">
        <p className="font-display text-3xl text-parchment">{t("empty.title")}</p>
        <p className="text-base text-mute-soft">{t("empty.body")}</p>
      </div>
      <Link
        href="/listings"
        className="mt-2 rounded-pill bg-gradient-to-r from-gold to-gold-bright px-7 py-3 text-sm font-semibold uppercase tracking-wider text-earth transition hover:opacity-90 hover:shadow-lg hover:shadow-gold/20"
      >
        {t("empty.cta")}
      </Link>
    </div>
  );
}
