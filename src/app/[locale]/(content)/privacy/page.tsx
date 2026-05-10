import { setRequestLocale, getTranslations } from "next-intl/server";
import GlassPanel from "@/components/glass-panel";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("privacy");

  const sections = [
    { title: t("introTitle"), body: t("introBody") },
    { title: t("collectTitle"), body: t("collectBody") },
    { title: t("useTitle"), body: t("useBody") },
    { title: t("sharingTitle"), body: t("sharingBody") },
    { title: t("retentionTitle"), body: t("retentionBody") },
    { title: t("rightsTitle"), body: t("rightsBody") },
    { title: t("cookiesTitle"), body: t("cookiesBody") },
    { title: t("changesTitle"), body: t("changesBody") },
    { title: t("contactTitle"), body: t("contactBody") },
  ] as const;

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Document header */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dk">
          {t("lastUpdated", { date: "2026-05-10" })}
        </p>
        <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl mb-16">
          {t("title")}
        </h1>

        {/* Divider line */}
        <div
          className="mb-16 h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(200,135,58,0.35), transparent)",
          }}
        />

        {/* Legal sections */}
        <div className="space-y-6">
          {sections.map(({ title, body }) => (
            <GlassPanel
              key={title}
              variant="warm"
              radius="glass"
              shadow
              className="p-8 md:p-10"
            >
              <h2 className="font-display text-2xl leading-snug text-gold-dk mb-5">
                {title}
              </h2>
              <div className="text-base leading-[1.9] text-ink-mid">
                <p>{body}</p>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
