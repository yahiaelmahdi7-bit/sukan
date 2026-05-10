import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import GlassPanel from "@/components/glass-panel";
import TestimonialCard from "@/components/testimonial-card";
import SectionHeader from "@/components/section-header";
import { DollarSign, ShieldCheck, Users, Search, FileText, Globe, CheckCircle } from "lucide-react";

export default async function DiasporaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("diasporaPage");

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-cream py-24 lg:py-32">
        {/* Gold halo — larger for the featured page */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 end-0 h-[640px] w-[640px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.16) 0%, transparent 70%)",
          }}
        />
        {/* Secondary terracotta halo — start side */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 start-0 h-[400px] w-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 30% 80%, rgba(200,64,26,0.07) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dk">
            {t("eyebrow")}
          </p>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl lg:text-7xl mb-6">
            {t("title")}
          </h1>
          <p className="max-w-2xl text-lg leading-[1.8] text-ink-mid">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* ─── Why diaspora choose Sukan ─── */}
      <section className="bg-cream-deep py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("whyTitle")} align="center" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <GlassPanel
              variant="warm"
              radius="glass"
              shadow
              className="smooth lift flex flex-col items-center gap-4 p-8 text-center"
            >
              <DollarSign size={36} className="text-gold-dk" strokeWidth={1.5} />
              <h3 className="font-display text-xl font-semibold text-ink">
                {t("why1Title")}
              </h3>
              <p className="text-sm leading-relaxed text-ink-mid">
                {t("why1Body")}
              </p>
            </GlassPanel>

            <GlassPanel
              variant="warm"
              radius="glass"
              shadow
              className="smooth lift flex flex-col items-center gap-4 p-8 text-center"
            >
              <ShieldCheck size={36} className="text-gold-dk" strokeWidth={1.5} />
              <h3 className="font-display text-xl font-semibold text-ink">
                {t("why2Title")}
              </h3>
              <p className="text-sm leading-relaxed text-ink-mid">
                {t("why2Body")}
              </p>
            </GlassPanel>

            <GlassPanel
              variant="warm"
              radius="glass"
              shadow
              className="smooth lift flex flex-col items-center gap-4 p-8 text-center"
            >
              <Users size={36} className="text-gold-dk" strokeWidth={1.5} />
              <h3 className="font-display text-xl font-semibold text-ink">
                {t("why3Title")}
              </h3>
              <p className="text-sm leading-relaxed text-ink-mid">
                {t("why3Body")}
              </p>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* ─── How remote investing works ─── */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("howTitle")} align="center" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <GlassPanel
              variant="warm"
              radius="glass"
              shadow
              className="smooth lift relative flex flex-col gap-5 overflow-hidden p-8"
            >
              <span
                aria-hidden
                className="absolute top-3 end-4 font-display text-7xl text-gold/10 leading-none font-bold select-none"
              >
                01
              </span>
              <div className="flex h-11 w-11 items-center justify-center text-gold-dk">
                <Search size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                {t("step1")}
              </h3>
              <p className="text-sm leading-relaxed text-ink-mid">{t("step1Body")}</p>
            </GlassPanel>

            {/* Step 2 */}
            <GlassPanel
              variant="warm"
              radius="glass"
              shadow
              className="smooth lift relative flex flex-col gap-5 overflow-hidden p-8"
            >
              <span
                aria-hidden
                className="absolute top-3 end-4 font-display text-7xl text-gold/10 leading-none font-bold select-none"
              >
                02
              </span>
              <div className="flex h-11 w-11 items-center justify-center text-gold-dk">
                <Users size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                {t("step2")}
              </h3>
              <p className="text-sm leading-relaxed text-ink-mid">{t("step2Body")}</p>
            </GlassPanel>

            {/* Step 3 */}
            <GlassPanel
              variant="warm"
              radius="glass"
              shadow
              className="smooth lift relative flex flex-col gap-5 overflow-hidden p-8"
            >
              <span
                aria-hidden
                className="absolute top-3 end-4 font-display text-7xl text-gold/10 leading-none font-bold select-none"
              >
                03
              </span>
              <div className="flex h-11 w-11 items-center justify-center text-gold-dk">
                <FileText size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                {t("step3")}
              </h3>
              <p className="text-sm leading-relaxed text-ink-mid">{t("step3Body")}</p>
            </GlassPanel>

            {/* Step 4 */}
            <GlassPanel
              variant="warm"
              radius="glass"
              shadow
              className="smooth lift relative flex flex-col gap-5 overflow-hidden p-8"
            >
              <span
                aria-hidden
                className="absolute top-3 end-4 font-display text-7xl text-gold/10 leading-none font-bold select-none"
              >
                04
              </span>
              <div className="flex h-11 w-11 items-center justify-center text-gold-dk">
                <CheckCircle size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                {t("step4")}
              </h3>
              <p className="text-sm leading-relaxed text-ink-mid">{t("step4Body")}</p>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="bg-cream-deep py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("testimonialsTitle")} align="center" />
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            <TestimonialCard
              quote={t("t1Quote")}
              author={t("t1Author")}
              location={t("t1Location")}
              accent="gold"
            />
            <TestimonialCard
              quote={t("t2Quote")}
              author={t("t2Author")}
              location={t("t2Location")}
              accent="terracotta"
            />
          </div>
        </div>
      </section>

      {/* ─── Currencies & payments ─── */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <GlassPanel variant="warm" radius="glass" shadow="lg" className="p-10 md:p-12">
            <div className="mb-6 flex items-start gap-5">
              <Globe
                size={32}
                className="mt-1 shrink-0 text-gold-dk"
                strokeWidth={1.5}
              />
              <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">
                {t("currenciesTitle")}
              </h2>
            </div>
            <p className="text-base leading-[1.9] text-ink-mid">
              {t("currenciesBody")}
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* ─── Closing CTA ─── */}
      <section className="bg-cream-deep py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Sister card to DiasporaCallout — expanded version */}
          <div
            className="glass-warm glass-highlight relative mx-auto flex max-w-2xl flex-col items-center gap-6 overflow-hidden rounded-[var(--radius-glass-lg)] border border-white/60 px-6 py-16 text-center sm:px-12"
            style={{ boxShadow: "var(--shadow-warm-lg)" }}
          >
            {/* Gold halo */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[360px] w-[360px] -translate-x-1/2 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(224,168,87,0.28), transparent 70%)",
              }}
            />
            <Link
              href="/listings?diaspora=true"
              className="smooth inline-flex items-center justify-center rounded-[var(--radius-pill)] px-10 py-4 text-base font-semibold text-earth hover:brightness-[1.05]"
              style={{
                background: "linear-gradient(135deg, #c8873a 0%, #e0a857 100%)",
                boxShadow:
                  "0 8px 24px rgba(200,135,58,0.32), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
