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
import {
  sudanNeighborhoods,
  getNeighborhood,
  findNeighborhoodSlug,
} from "@/lib/sudan-neighborhoods";
import {
  getStateLabel,
  stateToUrlSlug,
  urlSlugToState,
} from "@/lib/state-labels";
import { getNeighborhoodCopy } from "@/lib/area-content";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukansd.com"
).replace(/\/$/, "");

export function generateStaticParams() {
  // Generate ({state}, {neighborhood}) pairs — locales come from parent segment.
  const out: { state: string; neighborhood: string }[] = [];
  for (const state of SUDAN_STATES) {
    const list = sudanNeighborhoods[state] ?? [];
    for (const nb of list) {
      out.push({ state: stateToUrlSlug(state), neighborhood: nb.slug });
    }
  }
  return out;
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
  params: Promise<{
    locale: "en" | "ar";
    state: string;
    neighborhood: string;
  }>;
}): Promise<Metadata> {
  const { locale, state: stateSlug, neighborhood: nbSlug } = await params;
  const state = resolveState(stateSlug);
  if (!state) return {};
  const nb = getNeighborhood(state, nbSlug);
  if (!nb) return {};

  const isAr = locale === "ar";
  const stateNameEn = getStateLabel(state, "en");
  const stateNameAr = getStateLabel(state, "ar");
  const nbName = isAr ? nb.ar : nb.en;
  const stateName = isAr ? stateNameAr : stateNameEn;

  const title = isAr
    ? `عقارات ${nbName}، ${stateName} — للإيجار والبيع`
    : `${nb.en}, ${stateNameEn} Property — For Rent and Sale`;
  const description = isAr
    ? `شقق ومنازل وفيلات في ${nbName}، ${stateName}. قوائم حية من ملاك موثقين، مع صور حقيقية وأسعار محدّثة.`
    : `Apartments, houses, and villas in ${nb.en}, ${stateNameEn}. Live listings from verified owners with real photos and current prices.`;

  const path = `/areas/${stateToUrlSlug(state)}/${nb.slug}`;
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

export default async function NeighborhoodAreaPage({
  params,
}: {
  params: Promise<{
    locale: "en" | "ar";
    state: string;
    neighborhood: string;
  }>;
}) {
  const { locale, state: stateSlug, neighborhood: nbSlug } = await params;
  const state = resolveState(stateSlug);
  if (!state) notFound();
  const nb = getNeighborhood(state, nbSlug);
  if (!nb) notFound();
  setRequestLocale(locale);
  const isAr = locale === "ar";

  const stateNameEn = getStateLabel(state, "en");
  const stateName = getStateLabel(state, locale);
  const nbName = isAr ? nb.ar : nb.en;
  const copy = getNeighborhoodCopy(state, nb.en, nb.ar, locale);

  const all = await getListingsWithSample();
  const matched = all
    .filter((l) => l.state === state)
    .filter((l) => {
      if (!l.neighborhood) return false;
      const slug = findNeighborhoodSlug(state, l.neighborhood);
      return slug === nb.slug;
    })
    .slice(0, 12);

  const baseUrl = `${SITE_URL}/${locale}/areas/${stateToUrlSlug(state)}/${nb.slug}`;

  const breadcrumbs = buildBreadcrumbLD({
    items: [
      { name: isAr ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
      {
        name: isAr ? "المناطق" : "Areas",
        url: `${SITE_URL}/${locale}/areas`,
      },
      {
        name: stateName,
        url: `${SITE_URL}/${locale}/areas/${stateToUrlSlug(state)}`,
      },
      { name: nbName, url: baseUrl },
    ],
  });

  const collectionLd = buildCollectionPageLD({
    url: baseUrl,
    name: isAr
      ? `عقارات ${nbName} على Sukan`
      : `${nb.en} property on Sukan`,
    description: copy.intro,
    siteUrl: SITE_URL,
    listings: matched,
    locale,
  });

  const placeLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": baseUrl,
    name: nbName,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: stateName,
      containedInPlace: { "@type": "Country", name: "Sudan" },
    },
  };

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
      <JsonLd data={placeLd} />
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
          <Link
            href={`/areas/${stateToUrlSlug(state)}`}
            className="hover:text-parchment"
          >
            {stateName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-parchment/80">{nbName}</span>
        </nav>

        <header className="mb-10">
          <h1 className="font-serif text-4xl md:text-5xl text-parchment">
            {isAr
              ? `عقارات ${nbName}، ${stateName}`
              : `${nb.en}, ${stateNameEn}`}
          </h1>
          <p className="mt-4 max-w-2xl text-parchment/80 leading-relaxed">
            {copy.intro}
          </p>
          <p className="mt-3 max-w-2xl text-parchment/70 leading-relaxed">
            {copy.context}
          </p>
        </header>

        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif text-xl text-parchment">
              {isAr
                ? `قوائم في ${nbName}`
                : `Listings in ${nb.en}`}
            </h2>
            <Link
              href={`/listings?state=${state}&neighborhood=${nb.slug}`}
              className="text-sm text-parchment/70 hover:text-parchment"
            >
              {isAr ? "عرض الكل ←" : "View all →"}
            </Link>
          </div>
          {matched.length === 0 ? (
            <p className="text-parchment/60">
              {isAr
                ? `لا توجد قوائم نشطة في ${nbName} الآن. تصفح القوائم في ${stateName} أو تحقق قريباً.`
                : `No active listings in ${nb.en} right now. Browse ${stateNameEn} listings or check back soon.`}
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
