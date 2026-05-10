import { setRequestLocale, getTranslations } from "next-intl/server";
import GlassPanel from "@/components/glass-panel";
import DiasporaCallout from "@/components/diaspora-callout";
import { ShieldCheck, Globe, Languages } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const diaspora = await getTranslations("diaspora");

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-cream py-24 lg:py-32">
        {/* Warm gold halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 end-0 h-[560px] w-[560px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.13) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dk">
            {t("eyebrow")}
          </p>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl mb-6">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-lg leading-[1.8] text-ink-mid">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* ─── Why we exist ─── */}
      <section className="bg-cream-deep py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <GlassPanel variant="warm" radius="glass" shadow="lg" className="p-10 md:p-14">
            <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl mb-8">
              {t("whyTitle")}
            </h2>
            <div className="space-y-5 text-base leading-[1.9] text-ink-mid">
              <p>{t("whyP1")}</p>
              <p>{t("whyP2")}</p>
              <p>{t("whyP3")}</p>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* ─── What we believe ─── */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dk">
              {t("believeTitle")}
            </p>
            <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl mx-auto max-w-2xl">
              {t("believeTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Belief 1 */}
            <GlassPanel
              variant="warm"
              radius="glass"
              shadow
              className="smooth lift flex flex-col gap-5 p-8 overflow-hidden relative"
            >
              <span
                aria-hidden
                className="absolute top-3 end-4 font-display text-7xl text-gold/10 leading-none font-bold select-none"
              >
                01
              </span>
              <div className="flex h-11 w-11 items-center justify-center text-gold-dk">
                <ShieldCheck size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                {t("believe1Title")}
              </h3>
              <p className="text-sm leading-relaxed text-ink-mid">
                {t("believe1Body")}
              </p>
            </GlassPanel>

            {/* Belief 2 */}
            <GlassPanel
              variant="warm"
              radius="glass"
              shadow
              className="smooth lift flex flex-col gap-5 p-8 overflow-hidden relative"
            >
              <span
                aria-hidden
                className="absolute top-3 end-4 font-display text-7xl text-gold/10 leading-none font-bold select-none"
              >
                02
              </span>
              <div className="flex h-11 w-11 items-center justify-center text-gold-dk">
                <Languages size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                {t("believe2Title")}
              </h3>
              <p className="text-sm leading-relaxed text-ink-mid">
                {t("believe2Body")}
              </p>
            </GlassPanel>

            {/* Belief 3 */}
            <GlassPanel
              variant="warm"
              radius="glass"
              shadow
              className="smooth lift flex flex-col gap-5 p-8 overflow-hidden relative"
            >
              <span
                aria-hidden
                className="absolute top-3 end-4 font-display text-7xl text-gold/10 leading-none font-bold select-none"
              >
                03
              </span>
              <div className="flex h-11 w-11 items-center justify-center text-gold-dk">
                <Globe size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                {t("believe3Title")}
              </h3>
              <p className="text-sm leading-relaxed text-ink-mid">
                {t("believe3Body")}
              </p>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* ─── The team ─── */}
      <section className="bg-cream-deep py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <GlassPanel variant="warm" radius="glass" shadow="lg" className="p-10 md:p-14">
            <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl mb-6">
              {t("teamTitle")}
            </h2>
            <p className="text-base leading-[1.9] text-ink-mid mb-12">
              {t("teamBody")}
            </p>
            {/* TODO: Replace with real team bios when ready.
                Each bio card should include: photo, name, role, and a one-line blurb.
                Use a 2-3 column grid at md+ breakpoint. */}
            <div className="rounded-[var(--radius-card)] border border-gold/20 p-8 text-center">
              <p className="text-sm italic text-ink-mid">
                Team bios coming soon.
              </p>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* ─── Diaspora callout ─── */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DiasporaCallout
            eyebrow={diaspora("eyebrow")}
            title={diaspora("title")}
            subtitle={diaspora("subtitle")}
            browseCta={diaspora("browseCta")}
            matchCta={diaspora("matchCta")}
          />
        </div>
      </section>
    </>
  );
}
