import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SukanMark from "@/components/sukan-mark";
import WaveDivider from "@/components/wave-divider";
import GlassPanel from "@/components/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { MapPin, BookOpen, LayoutGrid } from "lucide-react";

export default async function NotFound() {
  const t = await getTranslations("errors");

  const helpLinks = [
    {
      href: "/listings" as const,
      icon: LayoutGrid,
      label: t("notFoundBrowse"),
    },
    {
      href: "/map" as const,
      icon: MapPin,
      label: t("notFoundMap"),
    },
    {
      href: "/guides" as const,
      icon: BookOpen,
      label: t("notFoundGuides"),
    },
  ];

  return (
    <>
      <Navbar />

      <main className="relative flex flex-1 flex-col items-center justify-center py-32 px-4 text-center">
        {/* Large muted watermark — sits behind the glass card */}
        <div
          className="pointer-events-none select-none absolute opacity-[0.05]"
          aria-hidden
        >
          <SukanMark size={300} monochrome="parchment" />
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
          <h1 className="font-display text-5xl text-parchment sm:text-6xl leading-tight">
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

          {/* 3 helpful links */}
          <div className="flex flex-col w-full gap-2">
            {helpLinks.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}>
                <GlassPanel
                  variant="warm"
                  radius="card"
                  highlight
                  shadow={false}
                  className="flex items-center gap-3 px-4 py-3 text-start hover:bg-sand/10 transition-colors"
                >
                  <Icon
                    size={16}
                    className="shrink-0 text-gold"
                    aria-hidden
                  />
                  <span className="text-sm text-parchment font-medium">
                    {label}
                  </span>
                </GlassPanel>
              </Link>
            ))}
          </div>

          {/* Home link */}
          <Link href="/">
            <GlassButton variant="ghost-dark" size="sm">
              {t("notFoundHome")}
            </GlassButton>
          </Link>

          {/* Small SukanMark watermark */}
          <div className="opacity-20 mt-2">
            <SukanMark size={28} monochrome="gold" />
          </div>
        </GlassPanel>
      </main>

      <Footer />
    </>
  );
}
