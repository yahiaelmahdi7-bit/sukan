import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SukanMark from "@/components/sukan-mark";
import WaveDivider from "@/components/wave-divider";
import GlassPanel from "@/components/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <>
      <Navbar />

      <main className="relative flex flex-1 flex-col items-center justify-center py-32 px-4 text-center">
        {/* Large muted watermark — sits behind the glass card */}
        <div
          className="pointer-events-none select-none absolute opacity-[0.06]"
          aria-hidden
        >
          <SukanMark size={280} monochrome="parchment" />
        </div>

        <GlassPanel
          variant="deep"
          radius="glass-lg"
          highlight={false}
          shadow={false}
          className="relative z-10 flex flex-col items-center gap-6 px-10 py-14 max-w-lg w-full"
          style={{ boxShadow: "var(--shadow-gold-glow)" }}
        >
          {/* Headline */}
          <h1 className="font-display text-5xl text-parchment sm:text-6xl">
            {t("notFoundTitle")}
          </h1>

          {/* Body */}
          <p className="max-w-sm text-base text-mute-soft leading-relaxed">
            {t("notFoundBody")}
          </p>

          {/* Wave divider */}
          <div className="w-36 opacity-40">
            <WaveDivider intensity="subtle" />
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/listings">
              <GlassButton variant="gold" size="md">
                {t("notFoundBrowse")}
              </GlassButton>
            </Link>
            <Link href="/">
              <GlassButton variant="ghost-dark" size="md">
                {t("notFoundHome")}
              </GlassButton>
            </Link>
          </div>
        </GlassPanel>
      </main>

      <Footer />
    </>
  );
}
