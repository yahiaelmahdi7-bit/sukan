import { setRequestLocale, getTranslations } from "next-intl/server";
import Pill from "@/components/pill";
import NumberedStep from "@/components/numbered-step";
import DiasporaCallout from "@/components/diaspora-callout";
import WaveDivider from "@/components/wave-divider";
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
      {/* ─── Hero band ─── */}
      <section className="relative bg-earth overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 end-0 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.15) 0%, transparent 70%)",
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

      {/* ─── Why we exist ─── */}
      <section className="bg-earth-soft py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-parchment mb-10 leading-tight">
            {t("whyTitle")}
          </h2>
          <div className="space-y-6 text-mute-soft text-base leading-[1.9]">
            <p>{t("whyP1")}</p>
            <p>{t("whyP2")}</p>
            <p>{t("whyP3")}</p>
          </div>
        </div>
      </section>

      <WaveDivider flip intensity="subtle" />

      {/* ─── What we believe ─── */}
      <section className="bg-parchment-grain py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-earth mb-12 text-center leading-tight">
            {t("believeTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <NumberedStep
              index={1}
              icon={<ShieldCheck size={40} strokeWidth={1.5} />}
              title={t("believe1Title")}
              body={t("believe1Body")}
            />
            <NumberedStep
              index={2}
              icon={<Languages size={40} strokeWidth={1.5} />}
              title={t("believe2Title")}
              body={t("believe2Body")}
            />
            <NumberedStep
              index={3}
              icon={<Globe size={40} strokeWidth={1.5} />}
              title={t("believe3Title")}
              body={t("believe3Body")}
            />
          </div>
        </div>
      </section>

      <WaveDivider intensity="subtle" />

      {/* ─── The team ─── */}
      <section className="bg-earth py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-parchment mb-8 leading-tight">
            {t("teamTitle")}
          </h2>
          <p className="text-mute-soft text-base leading-[1.9] mb-16">
            {t("teamBody")}
          </p>
          {/* TODO: Replace with real team bios when ready.
              Each bio card should include: photo, name, role, and a one-line blurb.
              Use a 2-3 column grid at md+ breakpoint. */}
          <div className="border border-gold/15 rounded-[var(--radius-card)] p-8 text-center">
            <p className="text-mute-soft text-sm italic">
              Team bios coming soon.
            </p>
          </div>
        </div>
      </section>

      <WaveDivider flip intensity="subtle" />

      {/* ─── Diaspora callout ─── */}
      <section className="bg-earth-soft">
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
      <WaveDivider intensity="subtle" />
    </>
  );
}
