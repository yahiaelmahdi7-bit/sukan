import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ListingCard from "@/components/listing-card";
import JsonLd from "@/components/json-ld";
import {
  buildBreadcrumbLD,
  buildCollectionPageLD,
} from "@/lib/json-ld";
import { SUDAN_STATES, type SudanState } from "@/lib/sample-listings";
import { getListingsWithSample } from "@/lib/listings";
import { sudanNeighborhoods } from "@/lib/sudan-neighborhoods";
import {
  getStateLabel,
  stateToUrlSlug,
  urlSlugToState,
} from "@/lib/state-labels";
import { getStateCopy } from "@/lib/area-content";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukansd.com"
).replace(/\/$/, "");

export function generateStaticParams() {
  // Generate (state) only — locales come from the parent [locale] segment.
  return SUDAN_STATES.map((state) => ({ state: stateToUrlSlug(state) }));
}

function resolveState(slug: string): SudanState | null {
  const candidate = urlSlugToState(slug);
  return (SUDAN_STATES as readonly string[]).includes(candidate)
    ? (candidate as SudanState)
    : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: "en" | "ar"; state: string }>;
}): Promise<Metadata> {
  const { locale, state: stateSlug } = await params;
  const state = resolveState(stateSlug);
  if (!state) return {};

  const isAr = locale === "ar";
  const stateNameEn = getStateLabel(state, "en");
  const stateNameAr = getStateLabel(state, "ar");
  const stateName = isAr ? stateNameAr : stateNameEn;

  const title = isAr
    ? `عقارات ${stateName} — شقق ومنازل وفيلات للإيجار والبيع`
    : `${stateName} Property — Apartments, Houses & Villas for Rent and Sale`;
  const description = isAr
    ? `استعرض القوائم العقارية الحية في ولاية ${stateNameAr}. شقق ومنازل وفيلات وأراضٍ موثقة من ملاكها، مرتبة حسب الحي والسعر.`
    : `Live property listings across ${stateNameEn} state — apartments, houses, villas, and land posted directly by verified owners, sorted by neighborhood and price.`;

  const path = `/areas/${stateToUrlSlug(state)}`;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages: {
        en: `${SITE_URL}/en${path}`,
        ar: `${SITE_URL}/ar${path}`,
        "x-default": `${SITE_URL}/en${path}`,
      },
    },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function StateAreaPage({
  params,
}: {
  params: Promise<{ locale: "en" | "ar"; state: string }>;
}) {
  const { locale, state: stateSlug } = await params;
  const state = resolveState(stateSlug);
  if (!state) notFound();
  setRequestLocale(locale);
  const isAr = locale === "ar";

  const stateNameEn = getStateLabel(state, "en");
  const stateName = getStateLabel(state, locale);
  const neighborhoods = sudanNeighborhoods[state] ?? [];
  const copy = getStateCopy(state, locale);

  const all = await getListingsWithSample();
  const matched = all.filter((l) => l.state === state).slice(0, 12);

  const baseUrl = `${SITE_URL}/${locale}/areas/${stateToUrlSlug(state)}`;

  const breadcrumbs = buildBreadcrumbLD({
    items: [
      { name: isAr ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
      {
        name: isAr ? "المناطق" : "Areas",
        url: `${SITE_URL}/${locale}/areas`,
      },
      { name: stateName, url: baseUrl },
    ],
  });

  const collectionLd = buildCollectionPageLD({
    url: baseUrl,
    name: isAr
      ? `عقارات ${stateName} على Sukan`
      : `${stateNameEn} property on Sukan`,
    description: copy.intro,
    siteUrl: SITE_URL,
    listings: matched,
    locale,
  });

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={collectionLd} />
      <JsonLd data={faqLd} />
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-parchment/60 mb-6"
        >
          <Link href="/areas" className="hover:text-parchment">
            {isAr ? "المناطق" : "Areas"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-parchment/80">{stateName}</span>
        </nav>

        <header className="mb-10">
          <h1 className="font-serif text-4xl md:text-5xl text-parchment">
            {isAr
              ? `عقارات ${stateName}`
              : `Property in ${stateNameEn}`}
          </h1>
          <p className="mt-4 max-w-2xl text-parchment/80 leading-relaxed">
            {copy.intro}
          </p>
          <p className="mt-3 max-w-2xl text-parchment/70 leading-relaxed">
            {copy.context}
          </p>
        </header>

        {neighborhoods.length > 0 && (
          <section className="mb-12">
            <h2 className="font-serif text-xl text-parchment mb-4">
              {isAr
                ? `الأحياء في ${stateName}`
                : `Neighborhoods in ${stateNameEn}`}
            </h2>
            <div className="flex flex-wrap gap-2">
              {neighborhoods.map((nb) => (
                <Link
                  key={nb.slug}
                  href={`/areas/${stateToUrlSlug(state)}/${nb.slug}`}
                  className="rounded-full border border-parchment/15 px-4 py-2 text-sm text-parchment/80 hover:border-parchment/40 hover:bg-earth/60 transition"
                >
                  {isAr ? nb.ar : nb.en}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif text-xl text-parchment">
              {isAr
                ? `قوائم مختارة في ${stateName}`
                : `Featured listings in ${stateNameEn}`}
            </h2>
            <Link
              href={`/listings?state=${state}`}
              className="text-sm text-parchment/70 hover:text-parchment"
            >
              {isAr ? "عرض الكل ←" : "View all →"}
            </Link>
          </div>
          {matched.length === 0 ? (
            <p className="text-parchment/60">
              {isAr
                ? "لا توجد قوائم نشطة الآن في هذه الولاية. تحقق قريباً."
                : "No active listings here yet. Check back soon."}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matched.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-serif text-xl text-parchment mb-4">
            {isAr ? "أسئلة شائعة" : "Frequently asked"}
          </h2>
          <dl className="space-y-5">
            {copy.faqs.map((f) => (
              <div key={f.q}>
                <dt className="text-parchment font-medium">{f.q}</dt>
                <dd className="mt-1 text-parchment/75 leading-relaxed">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}

