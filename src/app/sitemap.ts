import type { MetadataRoute } from "next";
import { sampleListings } from "@/lib/sample-listings";
import { guides } from "@/lib/guides";
import { insights } from "@/lib/insights";

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
      },
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
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

  const listingRoutes: MetadataRoute.Sitemap = sampleListings.map((listing) =>
    entry(`/listings/${listing.id}`, "weekly", 0.8),
  );

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

  return [
    ...staticRoutes,
    ...listingRoutes,
    ...guideIndexRoutes,
    ...guideDetailRoutes,
    ...insightIndexRoutes,
    ...insightDetailRoutes,
  ];
}
