import { setRequestLocale, getTranslations } from "next-intl/server";
import Pill from "@/components/pill";
import WaveDivider from "@/components/wave-divider";
import { MessageCircle, Mail, Send, MapPin, Briefcase } from "lucide-react";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");

  return (
    <>
      {/* ─── Hero ─── */}
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

      {/* ─── Contact methods ─── */}
      <section className="bg-earth-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* WhatsApp */}
            <div className="relative bg-earth border border-gold/15 rounded-[var(--radius-card)] p-8 flex flex-col gap-5 transition hover:-translate-y-0.5 hover:border-gold/30 overflow-hidden">
              <span
                aria-hidden
                className="absolute top-3 end-4 font-display text-7xl text-gold/8 leading-none font-bold select-none"
              >
                01
              </span>
              <div className="text-gold w-11 h-11 flex items-center justify-center">
                <MessageCircle size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl text-parchment font-semibold">
                {t("whatsappTitle")}
              </h3>
              <p className="text-mute-soft text-sm leading-relaxed flex-1">
                {t("whatsappBody")}
              </p>
              <a
                href="https://wa.me/249912345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-5 py-2.5 text-sm font-semibold text-white transition-colors w-fit"
                style={{ backgroundColor: "#25d366" }}
              >
                <MessageCircle size={14} aria-hidden />
                {t("whatsappCta")}
              </a>
            </div>

            {/* Email */}
            <div className="relative bg-earth border border-gold/15 rounded-[var(--radius-card)] p-8 flex flex-col gap-5 transition hover:-translate-y-0.5 hover:border-gold/30 overflow-hidden">
              <span
                aria-hidden
                className="absolute top-3 end-4 font-display text-7xl text-gold/8 leading-none font-bold select-none"
              >
                02
              </span>
              <div className="text-gold w-11 h-11 flex items-center justify-center">
                <Mail size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl text-parchment font-semibold">
                {t("emailTitle")}
              </h3>
              <p className="text-mute-soft text-sm leading-relaxed flex-1">
                {t("emailBody")}
              </p>
              <a
                href="mailto:hello@sukan.app"
                className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10 transition-colors w-fit"
              >
                <Mail size={14} aria-hidden />
                {t("emailCta")}
              </a>
            </div>

            {/* Telegram */}
            <div className="relative bg-earth border border-gold/15 rounded-[var(--radius-card)] p-8 flex flex-col gap-5 transition hover:-translate-y-0.5 hover:border-gold/30 overflow-hidden">
              <span
                aria-hidden
                className="absolute top-3 end-4 font-display text-7xl text-gold/8 leading-none font-bold select-none"
              >
                03
              </span>
              <div className="text-gold w-11 h-11 flex items-center justify-center">
                <Send size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl text-parchment font-semibold">
                {t("telegramTitle")}
              </h3>
              <p className="text-mute-soft text-sm leading-relaxed flex-1">
                {t("telegramBody")}
              </p>
              <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-gold/20 px-5 py-2.5 text-sm font-semibold text-mute-soft w-fit cursor-default">
                <Send size={14} aria-hidden />
                {t("telegramCta")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider flip intensity="subtle" />

      {/* ─── We're hiring ─── */}
      <section className="bg-earth py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-5 mb-6">
            <Briefcase size={32} className="text-gold mt-1 shrink-0" strokeWidth={1.5} />
            <h2 className="font-display text-3xl md:text-4xl text-parchment leading-tight">
              {t("hiringTitle")}
            </h2>
          </div>
          <p className="text-mute-soft text-base leading-[1.9]">
            {t("hiringBody")}
          </p>
        </div>
      </section>

      <WaveDivider intensity="subtle" />

      {/* ─── Office address ─── */}
      <section className="bg-earth-soft py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-5 mb-6">
            <MapPin size={32} className="text-gold mt-1 shrink-0" strokeWidth={1.5} />
            <h2 className="font-display text-3xl md:text-4xl text-parchment leading-tight">
              {t("officeTitle")}
            </h2>
          </div>
          <p className="text-mute-soft text-base leading-[1.9]">
            {t("officeBody")}
          </p>
        </div>
      </section>
    </>
  );
}
