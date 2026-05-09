import type { MetadataRoute } from "next";
import { sampleListings } from "@/lib/sample-listings";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

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
    entry("/privacy", "yearly", 0.3),
    entry("/terms", "yearly", 0.3),
    entry("/contact", "monthly", 0.5),
  ];

  const listingRoutes: MetadataRoute.Sitemap = sampleListings.map((listing) =>
    entry(`/listings/${listing.id}`, "weekly", 0.8),
  );

  return [...staticRoutes, ...listingRoutes];
}
