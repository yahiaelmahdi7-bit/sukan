import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import SukanMark from "@/components/sukan-mark";

export default async function EmptyState() {
  const t = await getTranslations("browse");

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
      <SukanMark size={80} monochrome="gold" className="opacity-20" />
      <div className="space-y-2">
        <p className="font-display text-3xl text-ink">{t("empty.title")}</p>
        <p className="text-base text-ink-soft">{t("empty.body")}</p>
      </div>
      <Link
        href="/listings"
        className="smooth mt-2 inline-flex items-center justify-center rounded-[var(--radius-pill)] px-7 py-3 text-sm font-semibold uppercase tracking-wider text-cream hover:brightness-[1.05]"
        style={{
          background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
          boxShadow:
            "0 8px 24px rgba(200, 64, 26, 0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
      >
        {t("empty.cta")}
      </Link>
    </div>
  );
}
