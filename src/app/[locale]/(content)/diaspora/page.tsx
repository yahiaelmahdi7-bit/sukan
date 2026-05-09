import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Pill from "@/components/pill";
import NumberedStep from "@/components/numbered-step";
import TestimonialCard from "@/components/testimonial-card";
import WaveDivider from "@/components/wave-divider";
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
      <section className="relative bg-earth overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 end-0 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="mb-5">
            <Pill variant="gold" size="sm">
              {t("eyebrow")}
            </Pill>
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-tight text-parchment mb-6">
            {t("title")}
          </h1>
          <p className="text-lg text-mute-soft max-w-2xl leading-[1.8]">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <WaveDivider intensity="subtle" />

      {/* ─── Why diaspora choose Sukan ─── */}
      <section className="bg-earth-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t("whyTitle")}
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-4 p-8 bg-earth border border-gold/15 rounded-[var(--radius-card)]">
              <DollarSign size={36} className="text-gold" strokeWidth={1.5} />
              <h3 className="font-display text-xl text-parchment font-semibold">{t("why1Title")}</h3>
              <p className="text-mute-soft text-sm leading-relaxed">{t("why1Body")}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 p-8 bg-earth border border-gold/15 rounded-[var(--radius-card)]">
              <ShieldCheck size={36} className="text-gold" strokeWidth={1.5} />
              <h3 className="font-display text-xl text-parchment font-semibold">{t("why2Title")}</h3>
              <p className="text-mute-soft text-sm leading-relaxed">{t("why2Body")}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4 p-8 bg-earth border border-gold/15 rounded-[var(--radius-card)]">
              <Users size={36} className="text-gold" strokeWidth={1.5} />
              <h3 className="font-display text-xl text-parchment font-semibold">{t("why3Title")}</h3>
              <p className="text-mute-soft text-sm leading-relaxed">{t("why3Body")}</p>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider flip intensity="subtle" />

      {/* ─── How remote investing works ─── */}
      <section className="bg-parchment-grain py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t("howTitle")}
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <NumberedStep
              index={1}
              icon={<Search size={40} strokeWidth={1.5} />}
              title={t("step1")}
              body={t("step1Body")}
            />
            <NumberedStep
              index={2}
              icon={<Users size={40} strokeWidth={1.5} />}
              title={t("step2")}
              body={t("step2Body")}
            />
            <NumberedStep
              index={3}
              icon={<FileText size={40} strokeWidth={1.5} />}
              title={t("step3")}
              body={t("step3Body")}
            />
            <NumberedStep
              index={4}
              icon={<CheckCircle size={40} strokeWidth={1.5} />}
              title={t("step4")}
              body={t("step4Body")}
            />
          </div>
        </div>
      </section>

      <WaveDivider intensity="subtle" />

      {/* ─── Testimonials ─── */}
      <section className="bg-earth py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t("testimonialsTitle")}
            align="center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
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

      <WaveDivider flip intensity="subtle" />

      {/* ─── Currencies & payments ─── */}
      <section className="bg-earth-soft py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-5 mb-6">
            <Globe size={32} className="text-gold mt-1 shrink-0" strokeWidth={1.5} />
            <h2 className="font-display text-3xl md:text-4xl text-parchment leading-tight">
              {t("currenciesTitle")}
            </h2>
          </div>
          <p className="text-mute-soft text-base leading-[1.9]">
            {t("currenciesBody")}
          </p>
        </div>
      </section>

      <WaveDivider intensity="subtle" />

      {/* ─── Closing CTA ─── */}
      <section className="bg-earth py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/listings?diaspora=true"
            className="inline-flex items-center justify-center rounded-[var(--radius-pill)] px-10 py-4 text-base font-semibold text-earth transition-colors hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #c8873a 0%, #e0a857 100%)",
            }}
          >
            {t("cta")}
          </Link>
        </div>
      </section>
    </>
  );
}
