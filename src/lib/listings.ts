// Real-listing data layer. Bridges Supabase `listings` rows to the `Listing`
// shape used by the UI components (which were originally written against
// `sampleListings`). Keeps sample listings as a fallback so the site still
// looks populated while real volume builds up.

import { createClient } from "@/lib/supabase/server";
import {
  sampleListings,
  type Listing,
  type SudanState,
  type PropertyType,
  type Purpose,
  type PricePeriod,
  type Tier,
  type Amenity,
} from "@/lib/sample-listings";

// Approximate SDG → USD rate. Used only to display SDG-priced listings on
// USD-sorted pages until a real FX feed is added.
const SDG_PER_USD = 600;

// Shape of a Supabase listings row, scoped to the columns we actually read.
// Defined inline because the project's database.types.ts is stale.
type DbListing = {
  id: string;
  owner_id: string;
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  property_type: PropertyType;
  purpose: Purpose;
  state: SudanState;
  city: string;
  neighborhood: string | null;
  latitude: number;
  longitude: number;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | string | null;
  price: number | string;
  currency: "USD" | "SDG";
  price_period: PricePeriod | null;
  amenities: string[];
  tier: Tier;
  status: "draft" | "pending_payment" | "active" | "expired" | "archived";
  whatsapp_contact: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    created_at: string;
  } | null;
};

const LISTING_SELECT = `
  id, owner_id, title_en, title_ar, description_en, description_ar,
  property_type, purpose, state, city, neighborhood, latitude, longitude,
  bedrooms, bathrooms, area_sqm, price, currency, price_period, amenities,
  tier, status, whatsapp_contact, created_at,
  profiles!owner_id(full_name, created_at)
`;

function toNumber(v: number | string | null | undefined): number | undefined {
  if (v === null || v === undefined) return undefined;
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : undefined;
}

function mapDbListing(row: DbListing): Listing {
  const priceRaw = toNumber(row.price) ?? 0;
  const priceUsd =
    row.currency === "USD" ? priceRaw : priceRaw / SDG_PER_USD;
  const priceSdg =
    row.currency === "SDG" ? priceRaw : undefined;

  const ownerName =
    row.profiles?.full_name?.trim() ?? "Owner";
  const ownerJoinedYear = row.profiles?.created_at
    ? new Date(row.profiles.created_at).getFullYear()
    : new Date().getFullYear();

  return {
    id: row.id,
    titleEn: row.title_en,
    titleAr: row.title_ar,
    descriptionEn: row.description_en ?? "",
    descriptionAr: row.description_ar ?? "",
    propertyType: row.property_type,
    purpose: row.purpose,
    state: row.state,
    city: row.city,
    cityAr: row.city,
    neighborhood: row.neighborhood ?? undefined,
    neighborhoodAr: row.neighborhood ?? undefined,
    latitude: row.latitude,
    longitude: row.longitude,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    areaSqm: toNumber(row.area_sqm),
    priceUsd: Math.round(priceUsd),
    priceSdg,
    period: row.price_period ?? "month",
    amenities: (row.amenities ?? []) as Amenity[],
    tier: row.tier,
    whatsappContact: row.whatsapp_contact ?? "",
    ownerName,
    ownerNameAr: ownerName,
    ownerJoinedYear,
    photoSlots: 0,
  };
}

/**
 * Fetch all active listings, newest first. Swallows errors so a transient
 * Supabase outage falls back to sample listings rather than breaking the page.
 */
export async function getActiveListings(): Promise<Listing[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return (data as unknown as DbListing[]).map(mapDbListing);
  } catch {
    return [];
  }
}

/**
 * Real listings merged with the curated sample catalog. Real listings come
 * first so the user sees their newly-posted listing at the top of /listings.
 */
export async function getListingsWithSample(): Promise<Listing[]> {
  const real = await getActiveListings();
  return [...real, ...sampleListings];
}

/**
 * Fetch listings owned by `userId`, regardless of status. Used by the
 * dashboard so an owner sees drafts and pending listings too.
 */
export async function getMyListings(userId: string): Promise<Listing[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return (data as unknown as DbListing[]).map(mapDbListing);
  } catch {
    return [];
  }
}

/**
 * Resolve a listing by id. Tries the DB first, then the sample catalog so
 * old hard-coded ids still resolve.
 */
export async function getListingByIdAsync(id: string): Promise<Listing | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return mapDbListing(data as unknown as DbListing);
    }
  } catch {
    // fall through to sample
  }
  return sampleListings.find((l) => l.id === id);
}
