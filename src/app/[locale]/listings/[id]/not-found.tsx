import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SukanMark from "@/components/sukan-mark";
import GlassPanel from "@/components/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import ListingCard from "@/components/listing-card";
import WaveDivider from "@/components/wave-divider";
import { sampleListings } from "@/lib/sample-listings";

// Show 3 featured/standard listings as alternatives
const alternativeListings = sampleListings
  .filter((l) => l.tier === "featured")
  .slice(0, 3);

export default async function ListingNotFound() {
  const t = await getTranslations("errors");

  return (
    <>
      <Navbar />

      <main className="flex flex-1 flex-col items-center py-24 px-4">
        {/* Header panel */}
        <div className="relative flex flex-col items-center text-center gap-5 max-w-lg mb-16">
          {/* Watermark */}
          <div
            className="pointer-events-none select-none absolute opacity-[0.05]"
            aria-hidden
          >
            <SukanMark size={240} monochrome="parchment" />
          </div>

          {/* Mark */}
          <div className="relative opacity-50">
            <SukanMark size={48} monochrome="gold" />
          </div>

          <h1 className="relative font-display text-4xl text-parchment sm:text-5xl leading-tight">
            {t("listingNotFoundTitle")}
          </h1>

          <p className="relative max-w-sm text-base text-mute-soft leading-relaxed">
            {t("listingNotFoundBody")}
          </p>

          <div className="w-28 opacity-40">
            <WaveDivider intensity="subtle" />
          </div>
        </div>

        {/* Alternative listings */}
        {alternativeListings.length > 0 && (
          <section
            className="w-full max-w-5xl"
            aria-label="Alternative listings"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {alternativeListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* Browse CTA */}
        <div className="mt-12">
          <Link href="/listings">
            <GlassButton variant="terracotta" size="md">
              {t("listingNotFoundBrowse")}
            </GlassButton>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
