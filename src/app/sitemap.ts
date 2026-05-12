import type { MetadataRoute } from "next";
import { sampleListings, SUDAN_STATES } from "@/lib/sample-listings";
import { getActiveListings } from "@/lib/listings";
import { guides } from "@/lib/guides";
import { insights } from "@/lib/insights";
import { sudanNeighborhoods } from "@/lib/sudan-neighborhoods";
import { stateToUrlSlug } from "@/lib/state-labels";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://sukansd.com";

type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

function entry(
  path: string,
  changeFrequency: ChangeFreq,
  priority: number,
  lastModified?: Date,
): MetadataRoute.Sitemap[number] {
  const cleanPath = path === "/" ? "" : path;
  return {
    url: `${BASE_URL}/en${cleanPath}`,
    lastModified: lastModified ?? new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        en: `${BASE_URL}/en${cleanPath}`,
        ar: `${BASE_URL}/ar${cleanPath}`,
        "x-default": `${BASE_URL}/en${cleanPath}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    entry("/", "daily", 1.0),
    entry("/listings", "daily", 0.9),
    entry("/map", "weekly", 0.8),
    entry("/post", "monthly", 0.7),
    entry("/about", "monthly", 0.6),
    entry("/diaspora", "monthly", 0.7),
    entry("/agents", "weekly", 0.7),
    entry("/privacy", "yearly", 0.3),
    entry("/terms", "yearly", 0.3),
    entry("/contact", "monthly", 0.5),
    // /compare is intentionally excluded — noindex, pure client state, no SEO value
  ];

  // Pull real active listings from Supabase. Fall back to the sample catalog
  // if the DB is unreachable so search engines never get an empty sitemap.
  let realListings: { id: string; createdAt?: string }[] = [];
  try {
    const active = await getActiveListings();
    realListings = active.map((l) => ({ id: l.id, createdAt: l.createdAt }));
  } catch {
    realListings = [];
  }

  const realListingRoutes: MetadataRoute.Sitemap = realListings.map((l) =>
    entry(
      `/listings/${l.id}`,
      "weekly",
      0.85,
      l.createdAt ? new Date(l.createdAt) : undefined,
    ),
  );

  const sampleListingRoutes: MetadataRoute.Sitemap = sampleListings.map(
    (listing) => entry(`/listings/${listing.id}`, "weekly", 0.7),
  );

  const listingRoutes: MetadataRoute.Sitemap = [
    ...realListingRoutes,
    ...sampleListingRoutes,
  ];

  // Guide index pages (one per locale)
  const guideIndexRoutes: MetadataRoute.Sitemap = [
    entry("/guides", "monthly", 0.8),
  ];

  // Per-guide detail pages — evergreen content, no publishedAt on Guide type
  const guideDetailRoutes: MetadataRoute.Sitemap = guides.map((guide) =>
    entry(`/guides/${guide.slug}`, "monthly", 0.7, new Date("2026-04-01")),
  );

  // Insight index pages (one per locale)
  const insightIndexRoutes: MetadataRoute.Sitemap = [
    entry("/insights", "weekly", 0.8),
  ];

  // Per-insight detail pages — timely, use publishedAt
  const insightDetailRoutes: MetadataRoute.Sitemap = insights.map((insight) =>
    entry(
      `/insights/${insight.slug}`,
      "weekly",
      0.6,
      new Date(insight.publishedAt),
    ),
  );

  // Area landing pages — index, per state, per neighborhood. Big SEO surface.
  const areaIndexRoute: MetadataRoute.Sitemap = [
    entry("/areas", "weekly", 0.7),
  ];

  const stateAreaRoutes: MetadataRoute.Sitemap = SUDAN_STATES.map((state) =>
    entry(`/areas/${stateToUrlSlug(state)}`, "weekly", 0.8),
  );

  const neighborhoodAreaRoutes: MetadataRoute.Sitemap = SUDAN_STATES.flatMap(
    (state) => {
      const list = sudanNeighborhoods[state] ?? [];
      return list.map((nb) =>
        entry(
          `/areas/${stateToUrlSlug(state)}/${nb.slug}`,
          "weekly",
          0.7,
        ),
      );
    },
  );

  return [
    ...staticRoutes,
    ...listingRoutes,
    ...guideIndexRoutes,
    ...guideDetailRoutes,
    ...insightIndexRoutes,
    ...insightDetailRoutes,
    ...areaIndexRoute,
    ...stateAreaRoutes,
    ...neighborhoodAreaRoutes,
  ];
}
