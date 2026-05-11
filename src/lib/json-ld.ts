/**
 * json-ld.ts — Type-safe schema.org structured-data builders for Sukan.
 *
 * All functions return plain objects ready for JSON.stringify.
 * "unknown" return type keeps callers free of verbose schema imports while
 * still guaranteeing the shape at the builder level.
 */

import type { Listing } from "@/lib/sample-listings";

// ─── Shared helpers ───────────────────────────────────────────────────────────

const ORG_NAME = "Sukan";
const ORG_NAME_AR = "سُكَن";
const ORG_LOGO = "https://sukansd.com/icon.png";

function truncate(text: string, max = 200): string {
  if (!text) return "";
  return text.length <= max ? text : text.slice(0, max - 1) + "…";
}

function absoluteImage(url: string, siteUrl: string): string {
  if (!url) return `${siteUrl}/opengraph-image.png`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${siteUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

// Property-type → schema.org @type mapping
// schema.org does not have a generic RealEstateListing @type (it's under Intangible/Offer).
// We model the physical property as Residence/Apartment/House/etc, and
// wrap the commercial aspects in an Offer.
const PROPERTY_TYPE_MAP: Record<string, string> = {
  apartment: "Apartment",
  studio: "Apartment",
  house: "House",
  villa: "House",
  shop: "LocalBusiness",
  office: "OfficeBuilding",
  land: "LandForm",
  warehouse: "WarehouseSpace",
};

// ─── Organization ─────────────────────────────────────────────────────────────

export interface OrganizationLDInput {
  siteUrl: string;
}

export function buildOrganizationLD(input: OrganizationLDInput): unknown {
  const { siteUrl } = input;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: ORG_NAME,
    alternateName: ORG_NAME_AR,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: ORG_LOGO,
      width: 512,
      height: 512,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic"],
      url: `${siteUrl}/en/contact`,
    },
    // TODO: replace placeholder sameAs URLs with verified social profiles
    sameAs: [
      "https://twitter.com/sukanapp",
      "https://www.facebook.com/sukanapp",
      "https://www.linkedin.com/company/sukanapp",
      "https://www.instagram.com/sukanapp",
    ],
  };
}

// ─── WebSite with SearchAction ────────────────────────────────────────────────

export interface WebSiteLDInput {
  siteUrl: string;
}

export function buildWebSiteLD(input: WebSiteLDInput): unknown {
  const { siteUrl } = input;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: ORG_NAME,
    alternateName: ORG_NAME_AR,
    url: siteUrl,
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: ["en", "ar"],
    // Enables Google Sitelinks Searchbox for the domain
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/en/listings?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

export interface BreadcrumbLDInput {
  items: { name: string; url: string }[];
}

export function buildBreadcrumbLD(input: BreadcrumbLDInput): unknown {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── Residence (physical property) ───────────────────────────────────────────

export interface ResidenceLDInput {
  listing: Listing;
  locale: "en" | "ar";
  siteUrl: string;
}

export function buildResidenceLD(input: ResidenceLDInput): unknown {
  const { listing, locale, siteUrl } = input;
  const isAr = locale === "ar";

  const name = isAr ? listing.titleAr : listing.titleEn;
  const description = truncate(isAr ? listing.descriptionAr : listing.descriptionEn);
  const propertySchemaType = PROPERTY_TYPE_MAP[listing.propertyType] ?? "Residence";
  const url = `${siteUrl}/${locale}/listings/${listing.id}`;
  const image = absoluteImage(listing.imageUrl ?? listing.photos?.[0] ?? "", siteUrl);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": propertySchemaType,
    "@id": url,
    name,
    description,
    url,
    image,
    address: {
      "@type": "PostalAddress",
      addressLocality: isAr ? (listing.cityAr ?? listing.city) : listing.city,
      addressRegion: listing.state.replace(/_/g, " "),
      addressCountry: "SD",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: listing.latitude,
      longitude: listing.longitude,
    },
  };

  if (listing.bedrooms != null) {
    schema.numberOfRooms = listing.bedrooms;
  }
  if (listing.bathrooms != null) {
    schema.numberOfBathroomsTotal = listing.bathrooms;
  }
  if (listing.areaSqm != null) {
    schema.floorSize = {
      "@type": "QuantitativeValue",
      value: listing.areaSqm,
      unitCode: "MTK", // ISO UN/CEFACT square metres
    };
  }
  if (listing.amenities.length > 0) {
    schema.amenityFeature = listing.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a.replace(/_/g, " "),
      value: true,
    }));
  }

  return schema;
}

// ─── RealEstateListing (the commercial offer wrapping the residence) ───────────
// schema.org/RealEstateListing is typed as Thing > Intangible > Service > LocalBusiness.
// We model it as a top-level entity with an "object" pointing to the Residence above.

export interface RealEstateListingLDInput {
  listing: Listing;
  locale: "en" | "ar";
  siteUrl: string;
}

export function buildRealEstateListingLD(input: RealEstateListingLDInput): unknown {
  const { listing, locale, siteUrl } = input;
  const isAr = locale === "ar";

  const name = isAr ? listing.titleAr : listing.titleEn;
  const description = truncate(isAr ? listing.descriptionAr : listing.descriptionEn);
  const url = `${siteUrl}/${locale}/listings/${listing.id}`;
  const image = absoluteImage(listing.imageUrl ?? listing.photos?.[0] ?? "", siteUrl);

  // Price period → schema.org UnitCode
  const periodMap: Record<string, string> = {
    month: "MON",
    year: "ANN",
    total: "",
  };
  const priceSpecification: Record<string, unknown> = {
    "@type": "UnitPriceSpecification",
    price: listing.priceUsd,
    priceCurrency: "USD",
  };
  const period = listing.period;
  if (period !== "total") {
    priceSpecification.unitCode = periodMap[period] ?? "MON";
    priceSpecification.referenceQuantity = {
      "@type": "QuantitativeValue",
      value: 1,
      unitCode: periodMap[period] ?? "MON",
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    name,
    description,
    url,
    image,
    datePosted: listing.createdAt ?? new Date().toISOString().slice(0, 10),
    offers: {
      "@type": "Offer",
      url,
      name,
      businessFunction: listing.purpose === "rent"
        ? "http://purl.org/goodrelations/v1#LeaseOut"
        : "http://purl.org/goodrelations/v1#Sell",
      priceSpecification,
      seller: {
        "@type": "Person",
        name: listing.ownerName,
      },
      itemCondition: "https://schema.org/UsedCondition",
      availability: "https://schema.org/InStock",
    },
    // Point to the physical Residence entity via sameAs / about
    about: { "@id": url },
  };
}

// ─── Article ──────────────────────────────────────────────────────────────────

export interface ArticleLDInput {
  title: string;
  description: string;
  image: string;
  published: string;
  modified?: string;
  author: string;
  url: string;
  siteUrl: string;
  type?: "Article" | "NewsArticle" | "BlogPosting";
}

export function buildArticleLD(input: ArticleLDInput): unknown {
  const {
    title,
    description,
    image,
    published,
    modified,
    author,
    url,
    siteUrl,
    type = "Article",
  } = input;

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": url,
    headline: truncate(title, 110),
    description: truncate(description),
    image: absoluteImage(image, siteUrl),
    datePublished: published,
    dateModified: modified ?? published,
    inLanguage: url.includes("/ar/") ? "ar" : "en",
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: ORG_NAME,
      logo: {
        "@type": "ImageObject",
        url: ORG_LOGO,
      },
    },
  };
}

// ─── CollectionPage (listings browse) ────────────────────────────────────────

export interface CollectionPageLDInput {
  url: string;
  name: string;
  description: string;
  siteUrl: string;
  listings: Listing[];
  locale: "en" | "ar";
}

export function buildCollectionPageLD(input: CollectionPageLDInput): unknown {
  const { url, name, description, siteUrl, listings, locale } = input;
  const isAr = locale === "ar";

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    name,
    description: truncate(description),
    url,
    hasPart: listings.slice(0, 12).map((l) => ({
      "@type": "RealEstateListing",
      "@id": `${siteUrl}/${locale}/listings/${l.id}#listing`,
      name: isAr ? l.titleAr : l.titleEn,
      url: `${siteUrl}/${locale}/listings/${l.id}`,
    })),
  };
}
