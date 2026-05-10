import { setRequestLocale, getTranslations } from "next-intl/server";
import GlassPanel from "@/components/glass-panel";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("terms");

  const sections = [
    { title: t("acceptanceTitle"), body: t("acceptanceBody") },
    { title: t("serviceTitle"), body: t("serviceBody") },
    { title: t("obligationsTitle"), body: t("obligationsBody") },
    { title: t("listingsPolicyTitle"), body: t("listingsPolicyBody") },
    { title: t("paymentsTitle"), body: t("paymentsBody") },
    { title: t("disclaimerTitle"), body: t("disclaimerBody") },
    { title: t("privacyRefTitle"), body: t("privacyRefBody") },
    { title: t("terminationTitle"), body: t("terminationBody") },
    { title: t("disputesTitle"), body: t("disputesBody") },
    {
      title: t("governingLawTitle"),
      body: t("governingLawBody"),
      // TODO: Replace governing law with real jurisdiction once the legal entity
      // (ADGM or Sudanese company) is confirmed.
    },
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
