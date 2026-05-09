import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SukanMark from "@/components/sukan-mark";
import WaveDivider from "@/components/wave-divider";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <>
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center py-32 px-4 text-center">
        {/* Muted large brand mark */}
        <div className="pointer-events-none select-none opacity-[0.06]" aria-hidden>
          <SukanMark size={240} monochrome="parchment" />
        </div>

        <div className="-mt-16 flex flex-col items-center gap-6">
          {/* Headline */}
          <h1 className="font-display text-5xl text-parchment sm:text-6xl">
            {t("notFoundTitle")}
          </h1>

          {/* Body */}
          <p className="max-w-md text-base text-mute-soft leading-relaxed">
            {t("notFoundBody")}
          </p>

          {/* Wave divider */}
          <div className="my-2 w-48 opacity-50">
            <WaveDivider intensity="subtle" />
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/listings"
              className="rounded-pill bg-gold/10 border border-gold/30 px-6 py-2.5 text-sm font-medium text-parchment hover:bg-gold/20 transition"
            >
              {t("notFoundBrowse")}
            </Link>
            <Link
              href="/"
              className="rounded-pill border border-parchment/20 px-6 py-2.5 text-sm font-medium text-parchment/70 hover:text-parchment hover:border-parchment/40 transition"
            >
              {t("notFoundHome")}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
