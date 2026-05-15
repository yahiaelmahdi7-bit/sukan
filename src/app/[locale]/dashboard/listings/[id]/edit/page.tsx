import { notFound, redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import EditWizard from "./_components/edit-wizard";
import type { PostFormShape } from "@/app/[locale]/post/_components/post-wizard";

export const dynamic = "force-dynamic";

// Supabase listing row shape (only what we need for edit pre-fill)
type DbListingForEdit = {
  id: string;
  owner_id: string;
  title_en: string | null;
  title_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  property_type: string;
  purpose: string;
  state: string;
  city: string;
  neighborhood: string | null;
  address_line: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | string | null;
  price: number | string;
  currency: string;
  price_period: string | null;
  amenities: string[] | null;
  tier: string;
  status: string;
  updated_at: string | null;
};

type DbListingPhoto = {
  id: string;
  url: string | null;
  position: number;
};

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-SD" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("post");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth guard — redirect to sign-in if not authenticated
  if (!user) {
    redirect(`/${locale}/auth/sign-in`);
  }

  // Fetch the listing
  const { data: listing, error } = await supabase
    .from("listings")
    .select(
      "id, owner_id, title_en, title_ar, description_en, description_ar, property_type, purpose, state, city, neighborhood, address_line, latitude, longitude, bedrooms, bathrooms, area_sqm, price, currency, price_period, amenities, tier, status, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !listing) {
    notFound();
  }

  const row = listing as unknown as DbListingForEdit;

  // Ownership guard
  if (row.owner_id !== user.id) {
    // Return 404 so the listing id is not enumerable by other users
    notFound();
  }

  // Fetch existing photos ordered by position
  const { data: photosData } = await supabase
    .from("listing_photos")
    .select("id, url, position")
    .eq("listing_id", id)
    .order("position", { ascending: true });

  const photoUrls = ((photosData ?? []) as DbListingPhoto[])
    .filter((p) => typeof p.url === "string" && p.url.length > 0)
    .map((p) => p.url as string);

  // Map DB row → PostFormShape (the wizard's draft shape)
  const initialValues: PostFormShape = {
    propertyType: (row.property_type as PostFormShape["propertyType"]) || "",
    purpose: (row.purpose as PostFormShape["purpose"]) || "",
    bedrooms:
      typeof row.bedrooms === "number" ? row.bedrooms : 1,
    bathrooms:
      typeof row.bathrooms === "number" ? row.bathrooms : 1,
    area:
      row.area_sqm !== null && row.area_sqm !== undefined
        ? String(row.area_sqm)
        : "",
    price:
      row.price !== null && row.price !== undefined ? String(row.price) : "",
    currency:
      (row.currency as PostFormShape["currency"]) || "USD",
    period:
      (row.price_period as PostFormShape["period"]) || "month",
    descriptionEn: row.description_en ?? "",
    descriptionAr: row.description_ar ?? "",
    amenities: (row.amenities ?? []) as PostFormShape["amenities"],
    state: (row.state as PostFormShape["state"]) || "",
    city: row.city ?? "",
    neighborhood: row.neighborhood ?? "",
    address: row.address_line ?? "",
    pinLat: row.latitude ?? null,
    pinLng: row.longitude ?? null,
    photoUrls,
    // tier and payment are immutable once set — use defaults so the wizard
    // renders the Step 4 UI, but updateListing ignores them.
    tier: (row.tier as PostFormShape["tier"]) ?? "standard",
    payment: "stripe",
    termsAccepted: false,
  };

  const displayTitle = row.title_en ?? row.title_ar ?? id;
  const lastEdited = row.updated_at
    ? formatDate(row.updated_at, locale)
    : null;

  // Status label (localised)
  const statusKey =
    row.status === "active"
      ? "statusActive"
      : row.status === "pending_payment"
      ? "statusPending"
      : row.status === "featured"
      ? "statusFeatured"
      : "statusDraft";

  return (
    <>
      <Navbar />

      <main className="min-h-screen pb-24">
        {/* Header band */}
        <div className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 end-0 h-[500px] w-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 70% 30%, rgba(200,135,58,0.16) 0%, transparent 65%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 start-0 h-[300px] w-[300px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 20% 80%, rgba(200,64,26,0.08) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-14 sm:px-6">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-dk">
              {t("editMode.pageEyebrow")}
            </p>

            {/* Title + status pill row */}
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
                {t("editMode.pageTitle", { title: displayTitle })}
              </h1>
              <StatusPillServer status={row.status} statusKey={statusKey} />
            </div>

            {/* Last-edited timestamp */}
            {lastEdited && (
              <p className="text-xs text-ink-mid mt-1">
                {t("editMode.lastEdited", { date: lastEdited })}
              </p>
            )}
          </div>
        </div>

        <div className="wave-divider opacity-30" />

        {/* Edit wizard */}
        <div className="mx-auto mt-10 max-w-3xl px-4 sm:px-6">
          <EditWizard
            userId={user.id}
            listingId={id}
            initialValues={initialValues}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}

// ─── Status pill (server component, no client JS needed) ──────────────────────

function StatusPillServer({
  status,
  statusKey,
}: {
  status: string;
  statusKey: string;
}) {
  if (status === "active" || statusKey === "statusActive") {
    return (
      <span className="mt-1 inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-green-400/40 bg-green-50/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-green-700 shrink-0">
        <span className="h-1 w-1 rounded-full bg-green-500" />
        Active
      </span>
    );
  }
  if (status === "pending_payment" || statusKey === "statusPending") {
    return (
      <span className="mt-1 inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-amber-400/40 bg-amber-50/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-700 shrink-0">
        Pending payment
      </span>
    );
  }
  if (status === "featured" || statusKey === "statusFeatured") {
    return (
      <span
        className="mt-1 inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-900 shrink-0"
        style={{
          background: "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
          boxShadow: "0 2px 8px rgba(200,135,58,0.30)",
        }}
      >
        Featured
      </span>
    );
  }
  return (
    <span className="mt-1 inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-ink/20 bg-sand px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-mid shrink-0">
      Draft
    </span>
  );
}
