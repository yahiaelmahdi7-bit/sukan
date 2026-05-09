"use client";

import { useState, useEffect, useTransition, useId, useRef } from "react";
import { useTranslations } from "next-intl";

// ─── Types ────────────────────────────────────────────────────────────────────

type PropertyTypeKey =
  | "apartment"
  | "house"
  | "villa"
  | "studio"
  | "shop"
  | "office"
  | "land"
  | "warehouse";

type StateKey =
  | "khartoum"
  | "al_jazirah"
  | "blue_nile"
  | "sennar"
  | "white_nile"
  | "north_kordofan"
  | "south_kordofan"
  | "west_kordofan"
  | "north_darfur"
  | "south_darfur"
  | "east_darfur"
  | "central_darfur"
  | "west_darfur"
  | "kassala"
  | "red_sea"
  | "gedaref"
  | "river_nile"
  | "northern";

type CurrencyKey = "USD" | "SDG";
type PeriodKey = "month" | "year" | "total";
type PurposeKey = "rent" | "sale";
type TierKey = "standard" | "featured";
type PaymentKey = "stripe" | "bank";

export interface PostDraft {
  // Step 1
  propertyType: PropertyTypeKey | "";
  purpose: PurposeKey | "";
  bedrooms: number;
  bathrooms: number;
  area: string;
  price: string;
  currency: CurrencyKey;
  period: PeriodKey;
  // Step 2
  state: StateKey | "";
  city: string;
  neighborhood: string;
  address: string;
  // Step 3
  photos: string[]; // object URLs (ephemeral, not serialized)
  // Step 4
  tier: TierKey;
  payment: PaymentKey;
  termsAccepted: boolean;
}

const INITIAL_DRAFT: PostDraft = {
  propertyType: "",
  purpose: "",
  bedrooms: 1,
  bathrooms: 1,
  area: "",
  price: "",
  currency: "USD",
  period: "month",
  state: "",
  city: "",
  neighborhood: "",
  address: "",
  photos: [],
  tier: "standard",
  payment: "stripe",
  termsAccepted: false,
};

const SESSION_KEY = "sukan:post-draft";

// ─── Data constants ───────────────────────────────────────────────────────────

const PROPERTY_TYPE_KEYS: PropertyTypeKey[] = [
  "apartment",
  "house",
  "villa",
  "studio",
  "shop",
  "office",
  "land",
  "warehouse",
];

const PROPERTY_TYPE_GLYPHS: Record<PropertyTypeKey, string> = {
  apartment: "🏢",
  house: "🏠",
  villa: "🏡",
  studio: "🛏",
  shop: "🏪",
  office: "🏢",
  land: "🌿",
  warehouse: "🏭",
};

const STATE_KEYS: StateKey[] = [
  "khartoum",
  "al_jazirah",
  "blue_nile",
  "sennar",
  "white_nile",
  "north_kordofan",
  "south_kordofan",
  "west_kordofan",
  "north_darfur",
  "south_darfur",
  "east_darfur",
  "central_darfur",
  "west_darfur",
  "kassala",
  "red_sea",
  "gedaref",
  "river_nile",
  "northern",
];

const STATE_COORDS: Record<StateKey, [number, number]> = {
  khartoum: [15.5007, 32.5599],
  al_jazirah: [14.4012, 33.5199],
  blue_nile: [11.7891, 34.3599],
  sennar: [13.1483, 33.9312],
  white_nile: [13.1809, 32.7399],
  north_kordofan: [13.1842, 30.2167],
  south_kordofan: [11.0167, 29.7167],
  west_kordofan: [11.7329, 28.3579],
  north_darfur: [13.6279, 25.3494],
  south_darfur: [12.0489, 24.8807],
  east_darfur: [11.4619, 26.1258],
  central_darfur: [12.9095, 23.4706],
  west_darfur: [13.4526, 22.4472],
  kassala: [15.451, 36.3999],
  red_sea: [19.6158, 37.2164],
  gedaref: [14.0349, 35.3834],
  river_nile: [17.598, 33.9721],
  northern: [19.1816, 30.4749],
};

const MAX_PHOTOS = 10;

// ─── Style helpers ────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-earth border border-gold/20 rounded-md px-4 py-3 text-parchment placeholder:text-mute focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors";

const labelCls =
  "block text-xs font-semibold uppercase tracking-wider text-mute-soft mb-1.5";

const errorCls =
  "mt-1 text-xs text-terracotta";

// ─── Sub-components ──────────────────────────────────────────────────────────

// Stepper (bedrooms / bathrooms)
function Stepper({
  value,
  min,
  max,
  onChange,
  id,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  id: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="decrease"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-full border border-gold/40 text-gold flex items-center justify-center text-lg leading-none hover:border-gold hover:text-gold-bright transition-colors disabled:opacity-40"
        disabled={value <= min}
      >
        −
      </button>
      <span id={id} className="w-6 text-center text-parchment font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="increase"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-full border border-gold/40 text-gold flex items-center justify-center text-lg leading-none hover:border-gold hover:text-gold-bright transition-colors disabled:opacity-40"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}

// Progress bar (client-interactive version, rendered inside wizard)
function WizardProgress({
  step,
  steps,
}: {
  step: number;
  steps: string[];
}) {
  return (
    <div
      className="flex items-start gap-0 w-full mb-8"
      role="navigation"
      aria-label="Progress"
    >
      {steps.map((label, i) => {
        const done = i < step;
        const active = i === step;

        return (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
            <div className="flex items-center w-full">
              {/* Leading connector */}
              {i > 0 && (
                <div
                  className={[
                    "h-px flex-1 transition-colors",
                    done || active ? "bg-gold/60" : "bg-gold/20",
                  ].join(" ")}
                />
              )}

              {/* Dot */}
              <div
                className={[
                  "relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 transition-colors",
                  active
                    ? "bg-terracotta border-terracotta text-parchment"
                    : done
                    ? "bg-gold border-gold text-earth"
                    : "bg-transparent border-gold/30 text-mute",
                ].join(" ")}
                aria-current={active ? "step" : undefined}
              >
                {done ? (
                  // Checkmark SVG for completed steps
                  <svg
                    viewBox="0 0 12 12"
                    width="12"
                    height="12"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>

              {/* Trailing connector */}
              {i < steps.length - 1 && (
                <div
                  className={[
                    "h-px flex-1 transition-colors",
                    done ? "bg-gold/60" : "bg-gold/20",
                  ].join(" ")}
                />
              )}
            </div>

            {/* Label */}
            <span
              className={[
                "text-xs text-center leading-tight",
                active
                  ? "text-parchment font-semibold"
                  : done
                  ? "text-gold"
                  : "text-mute hidden sm:block",
              ].join(" ")}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Property Details ─────────────────────────────────────────────────

function Step1({
  draft,
  update,
  errors,
}: {
  draft: PostDraft;
  update: (patch: Partial<PostDraft>) => void;
  errors: Record<string, string>;
}) {
  const pt = useTranslations("propertyType");
  const ht = useTranslations("hero");
  const t = useTranslations("post");

  const bedroomsId = useId();
  const bathroomsId = useId();

  return (
    <div className="space-y-8">
      {/* Property type tiles */}
      <fieldset>
        <legend className={labelCls}>{t("typeLabel")}</legend>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {PROPERTY_TYPE_KEYS.map((key) => {
            const active = draft.propertyType === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => update({ propertyType: key })}
                className={[
                  "rounded-[var(--radius-pill)] border px-3 py-2.5 text-sm font-medium transition-colors flex flex-col items-center gap-1",
                  active
                    ? "border-terracotta bg-terracotta/10 text-parchment"
                    : "border-gold/30 text-mute-soft hover:border-gold/60 hover:text-parchment",
                ].join(" ")}
                aria-pressed={active}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {PROPERTY_TYPE_GLYPHS[key]}
                </span>
                <span className="text-xs leading-tight">{pt(key)}</span>
              </button>
            );
          })}
        </div>
        {errors.propertyType && (
          <p className={errorCls} role="alert">{errors.propertyType}</p>
        )}
      </fieldset>

      {/* Purpose */}
      <fieldset>
        <legend className={labelCls}>{t("purposeLabel")}</legend>
        <div className="flex gap-3 mt-2">
          {(["rent", "sale"] as PurposeKey[]).map((key) => {
            const active = draft.purpose === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => update({ purpose: key })}
                className={[
                  "flex-1 rounded-[var(--radius-pill)] border py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-terracotta border-terracotta text-parchment"
                    : "border-gold/30 text-mute-soft hover:border-gold/60 hover:text-parchment",
                ].join(" ")}
                aria-pressed={active}
              >
                {ht(key)}
              </button>
            );
          })}
        </div>
        {errors.purpose && (
          <p className={errorCls} role="alert">{errors.purpose}</p>
        )}
      </fieldset>

      {/* Bedrooms / Bathrooms */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor={bedroomsId} className={labelCls}>
            {t("bedroomsLabel")}
          </label>
          <Stepper
            id={bedroomsId}
            value={draft.bedrooms}
            min={0}
            max={12}
            onChange={(v) => update({ bedrooms: v })}
          />
        </div>
        <div>
          <label htmlFor={bathroomsId} className={labelCls}>
            {t("bathroomsLabel")}
          </label>
          <Stepper
            id={bathroomsId}
            value={draft.bathrooms}
            min={0}
            max={12}
            onChange={(v) => update({ bathrooms: v })}
          />
        </div>
      </div>

      {/* Area */}
      <div>
        <label className={labelCls}>{t("areaLabel")}</label>
        <input
          type="number"
          min={0}
          placeholder="e.g. 120"
          value={draft.area}
          onChange={(e) => update({ area: e.target.value })}
          className={inputCls}
        />
      </div>

      {/* Price + currency + period */}
      <div>
        <label className={labelCls}>{t("priceLabel")}</label>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            placeholder="0"
            value={draft.price}
            onChange={(e) => update({ price: e.target.value })}
            className={[inputCls, "flex-1"].join(" ")}
          />
          <select
            value={draft.currency}
            onChange={(e) => update({ currency: e.target.value as CurrencyKey })}
            aria-label={t("currencyLabel")}
            className={[
              inputCls,
              "w-24 cursor-pointer",
            ].join(" ")}
          >
            <option value="USD">USD</option>
            <option value="SDG">SDG</option>
          </select>
          <select
            value={draft.period}
            onChange={(e) => update({ period: e.target.value as PeriodKey })}
            aria-label={t("periodLabel")}
            className={[
              inputCls,
              "w-32 cursor-pointer",
            ].join(" ")}
          >
            <option value="month">{t("pricePeriodMonth")}</option>
            <option value="year">{t("pricePeriodYear")}</option>
            <option value="total">{t("pricePeriodTotal")}</option>
          </select>
        </div>
        {errors.price && (
          <p className={errorCls} role="alert">{errors.price}</p>
        )}
      </div>
    </div>
  );
}

// ─── Step 2: Location ─────────────────────────────────────────────────────────

function Step2({
  draft,
  update,
  errors,
}: {
  draft: PostDraft;
  update: (patch: Partial<PostDraft>) => void;
  errors: Record<string, string>;
}) {
  const t = useTranslations("post");
  const st = useTranslations("states");

  const coords =
    draft.state && STATE_COORDS[draft.state as StateKey]
      ? STATE_COORDS[draft.state as StateKey]
      : null;

  return (
    <div className="space-y-6">
      {/* State */}
      <div>
        <label className={labelCls}>{t("stateLabel")}</label>
        <select
          value={draft.state}
          onChange={(e) => update({ state: e.target.value as StateKey })}
          className={[inputCls, "cursor-pointer"].join(" ")}
        >
          <option value="">{t("selectState")}</option>
          {STATE_KEYS.map((key) => (
            <option key={key} value={key}>
              {st(key)}
            </option>
          ))}
        </select>
        {errors.state && (
          <p className={errorCls} role="alert">{errors.state}</p>
        )}
      </div>

      {/* City */}
      <div>
        <label className={labelCls}>{t("cityLabel")}</label>
        <input
          type="text"
          placeholder={t("cityPlaceholder")}
          value={draft.city}
          onChange={(e) => update({ city: e.target.value })}
          className={inputCls}
        />
        {errors.city && (
          <p className={errorCls} role="alert">{errors.city}</p>
        )}
      </div>

      {/* Neighborhood (optional) */}
      <div>
        <label className={labelCls}>{t("neighborhoodLabel")}</label>
        <input
          type="text"
          placeholder={t("neighborhoodPlaceholder")}
          value={draft.neighborhood}
          onChange={(e) => update({ neighborhood: e.target.value })}
          className={inputCls}
        />
      </div>

      {/* Address line (optional) */}
      <div>
        <label className={labelCls}>{t("addressLabel")}</label>
        <input
          type="text"
          placeholder={t("addressPlaceholder")}
          value={draft.address}
          onChange={(e) => update({ address: e.target.value })}
          className={inputCls}
        />
      </div>

      {/* Map placeholder */}
      {/* TODO: integrate Leaflet OpenStreetMap with draggable marker */}
      <div>
        <div
          className="w-full rounded-[var(--radius-card)] border-2 border-dashed border-gold/30 bg-sand/40 flex items-center justify-center"
          style={{ height: 320 }}
          role="img"
          aria-label={t("mapHint")}
        >
          <div className="text-center px-6">
            {/* Simple map pin SVG */}
            <svg
              viewBox="0 0 24 24"
              width="40"
              height="40"
              fill="none"
              className="mx-auto mb-3 text-gold/60"
              aria-hidden
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                fill="currentColor"
                fillOpacity={0.3}
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="9" r="2.5" fill="currentColor" />
            </svg>
            <p className="text-mute-soft text-sm">{t("mapHint")}</p>
            {coords && (
              <p className="mt-2 text-xs text-gold/70 font-mono tabular-nums">
                {draft.state ? st(draft.state as StateKey) : ""}{" "}
                {coords[0].toFixed(4)}°N, {coords[1].toFixed(4)}°E
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Photos ───────────────────────────────────────────────────────────

function Step3({
  draft,
  update,
  errors,
}: {
  draft: PostDraft;
  update: (patch: Partial<PostDraft>) => void;
  errors: Record<string, string>;
}) {
  const t = useTranslations("post");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on unmount to prevent memory leaks
  useEffect(() => {
    const urls = draft.photos;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const remaining = MAX_PHOTOS - draft.photos.length;
    if (remaining <= 0) return;
    const newUrls: string[] = [];
    Array.from(fileList)
      .slice(0, remaining)
      .forEach((file) => {
        if (file.type.startsWith("image/")) {
          newUrls.push(URL.createObjectURL(file));
        }
      });
    if (newUrls.length > 0) {
      update({ photos: [...draft.photos, ...newUrls] });
    }
  }

  function removePhoto(index: number) {
    URL.revokeObjectURL(draft.photos[index]);
    update({ photos: draft.photos.filter((_, i) => i !== index) });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label={t("dropzoneHeading")}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full rounded-[var(--radius-card)] border-2 border-dashed border-gold/30 bg-sand/20 hover:border-gold/60 hover:bg-sand/30 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 py-10 px-4"
      >
        {/* Upload icon */}
        <svg
          viewBox="0 0 24 24"
          width="44"
          height="44"
          fill="none"
          className="text-gold/60"
          aria-hidden
        >
          <path
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 3v12m0-12l-4 4m4-4l4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-parchment font-semibold text-sm text-center">
          {t("dropzoneHeading")}
        </p>
        <p className="text-mute-soft text-xs text-center">
          {t("dropzoneSubtitle")}
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        aria-hidden
      />

      {errors.photos && (
        <p className={errorCls} role="alert">{errors.photos}</p>
      )}

      {/* Thumbnail grid — 6 slots */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => {
          const url = draft.photos[i];
          return (
            <div
              key={i}
              className="relative aspect-[4/3] rounded-[var(--radius-card)] overflow-hidden border border-gold/20 bg-sand/30"
            >
              {url ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    aria-label={t("removePhoto")}
                    className="absolute top-1 end-1 w-6 h-6 rounded-full bg-earth/80 text-parchment flex items-center justify-center text-xs hover:bg-terracotta transition-colors"
                  >
                    ×
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-mute/60">
                  <span className="text-xl leading-none">+</span>
                  <span className="text-xs">{t("photoSlot", { n: i + 1 })}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 4: Review & Pay ─────────────────────────────────────────────────────

function Step4({
  draft,
  update,
  errors,
}: {
  draft: PostDraft;
  update: (patch: Partial<PostDraft>) => void;
  errors: Record<string, string>;
}) {
  const t = useTranslations("post");
  const pt = useTranslations("propertyType");
  const ht = useTranslations("hero");
  const st = useTranslations("states");

  const periodLabel =
    draft.period === "month"
      ? t("pricePeriodMonth")
      : draft.period === "year"
      ? t("pricePeriodYear")
      : t("pricePeriodTotal");

  return (
    <div className="space-y-8">
      {/* Summary + pricing in two columns on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: listing summary */}
        <div>
          <h2 className="font-display text-2xl text-parchment mb-4">
            {t("reviewTitle")}
          </h2>
          <dl className="space-y-3">
            {[
              {
                label: t("summaryType"),
                value: draft.propertyType ? pt(draft.propertyType) : "—",
              },
              {
                label: t("summaryPurpose"),
                value: draft.purpose ? ht(draft.purpose) : "—",
              },
              {
                label: t("summaryBedrooms"),
                value: String(draft.bedrooms),
              },
              {
                label: t("summaryBathrooms"),
                value: String(draft.bathrooms),
              },
              {
                label: t("summaryArea"),
                value: draft.area ? `${draft.area} m²` : "—",
              },
              {
                label: t("summaryPrice"),
                value: draft.price
                  ? `${draft.price} ${draft.currency} ${periodLabel}`
                  : "—",
              },
              {
                label: t("summaryState"),
                value: draft.state ? st(draft.state as StateKey) : "—",
              },
              {
                label: t("summaryCity"),
                value: draft.city || "—",
              },
              ...(draft.neighborhood
                ? [
                    {
                      label: t("summaryNeighborhood"),
                      value: draft.neighborhood,
                    },
                  ]
                : []),
              {
                label: t("summaryPhotos"),
                value: t("summaryPhotosCount", { count: draft.photos.length }),
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4 py-2 border-b border-gold/10">
                <dt className="text-xs font-semibold uppercase tracking-wider text-mute-soft">
                  {label}
                </dt>
                <dd className="text-sm text-parchment text-end">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: pricing + payment */}
        <div className="space-y-6">
          {/* Pricing tier */}
          <div>
            <h2 className="font-display text-2xl text-parchment mb-4">
              {t("pricingTitle")}
            </h2>
            <div className="space-y-3">
              {/* Standard tier */}
              <label
                className={[
                  "flex items-start gap-4 rounded-[var(--radius-card)] border p-4 cursor-pointer transition-colors",
                  draft.tier === "standard"
                    ? "border-gold/60 bg-gold/5"
                    : "border-gold/20 hover:border-gold/40",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="tier"
                  value="standard"
                  checked={draft.tier === "standard"}
                  onChange={() => update({ tier: "standard" })}
                  className="mt-0.5 accent-gold"
                />
                <div className="flex-1">
                  <p className="text-parchment font-semibold text-sm">
                    {t("tierStandard")}
                  </p>
                  <p className="text-mute-soft text-xs mt-0.5">
                    {t("tierStandardDesc")}
                  </p>
                </div>
              </label>

              {/* Featured tier */}
              <label
                className={[
                  "flex items-start gap-4 rounded-[var(--radius-card)] border p-4 cursor-pointer transition-colors",
                  draft.tier === "featured"
                    ? "border-gold/60 bg-gold/5"
                    : "border-gold/20 hover:border-gold/40",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="tier"
                  value="featured"
                  checked={draft.tier === "featured"}
                  onChange={() => update({ tier: "featured" })}
                  className="mt-0.5 accent-gold"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-parchment font-semibold text-sm">
                      {t("tierFeatured")}
                    </p>
                    <span className="rounded-[var(--radius-pill)] bg-gold/20 text-gold text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                      {t("tierFeaturedBadge")}
                    </span>
                  </div>
                  <p className="text-mute-soft text-xs">
                    {t("tierFeaturedPerk")}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-mute-soft mb-3">
              {t("paymentTitle")}
            </h3>
            <div className="space-y-2">
              {(
                [
                  { value: "stripe", label: t("payStripe") },
                  { value: "bank", label: t("payBank") },
                ] as { value: PaymentKey; label: string }[]
              ).map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={value}
                    checked={draft.payment === value}
                    onChange={() => update({ payment: value })}
                    className="accent-gold"
                  />
                  <span className="text-sm text-parchment">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.termsAccepted}
              onChange={(e) => update({ termsAccepted: e.target.checked })}
              className="mt-0.5 accent-gold w-4 h-4 shrink-0"
            />
            <span className="text-sm text-mute-soft leading-snug">
              {t("confirmAccuracy")}
            </span>
          </label>
          {errors.termsAccepted && (
            <p className={errorCls} role="alert">{errors.termsAccepted}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState() {
  const t = useTranslations("post");
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
      {/* Large animated checkmark */}
      <div className="w-20 h-20 rounded-full bg-gold/15 border-2 border-gold/50 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          width="40"
          height="40"
          fill="none"
          aria-hidden
        >
          <path
            d="M5 12l5 5L20 7"
            stroke="#C8873A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <h2 className="font-display text-3xl text-parchment mb-2">
          {t("successHeading")}
        </h2>
        <p className="text-mute-soft text-sm max-w-sm mx-auto">
          {t("successBody")}
        </p>
      </div>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(step: number, draft: PostDraft, t: (key: string) => string): Record<string, string> {
  const errs: Record<string, string> = {};
  if (step === 0) {
    if (!draft.propertyType) errs.propertyType = t("errorType");
    if (!draft.purpose) errs.purpose = t("errorPurpose");
    if (!draft.price) errs.price = t("errorPrice");
  }
  if (step === 1) {
    if (!draft.state) errs.state = t("errorState");
    if (!draft.city.trim()) errs.city = t("errorCity");
  }
  if (step === 2) {
    if (draft.photos.length === 0) errs.photos = t("errorPhotos");
  }
  if (step === 3) {
    if (!draft.termsAccepted) errs.termsAccepted = t("errorTerms");
  }
  return errs;
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export default function PostWizard() {
  const t = useTranslations("post");
  const [, startTransition] = useTransition();

  const [draft, setDraft] = useState<PostDraft>(() => {
    // photos are ephemeral (object URLs) — never load from sessionStorage
    return { ...INITIAL_DRAFT };
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const STEPS = [t("step1"), t("step2"), t("step3"), t("step4")] as const;

  // Load non-photo draft from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<PostDraft>;
        // Never restore photos (object URLs die on page reload)
        setDraft((prev) => ({ ...prev, ...saved, photos: [] }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist draft (without photos) to sessionStorage on every change
  // Uses startTransition to defer the write off the critical path
  function updateDraft(patch: Partial<PostDraft>) {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      startTransition(() => {
        try {
          const { photos: _photos, ...serializable } = next;
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(serializable));
        } catch {
          // quota exceeded — silently ignore
        }
      });
      return next;
    });
    // Clear errors for the changed keys
    const changedKeys = Object.keys(patch);
    setErrors((prev) => {
      const next = { ...prev };
      changedKeys.forEach((k) => delete next[k]);
      return next;
    });
  }

  function handleNext() {
    const errs = validate(step, draft, (k) => t(k as Parameters<typeof t>[0]));
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
    // Scroll wizard card top into view on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit() {
    const errs = validate(3, draft, (k) => t(k as Parameters<typeof t>[0]));
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // TODO: wire to Supabase insert — for now, log + show success state
    console.log("[Sukan] Post draft submitted:", draft);
    sessionStorage.removeItem(SESSION_KEY);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-earth-soft rounded-[var(--radius-card)] border border-gold/20 p-6 sm:p-10 max-w-3xl mx-auto">
        <SuccessState />
      </div>
    );
  }

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="bg-earth-soft rounded-[var(--radius-card)] border border-gold/20 p-6 sm:p-10 max-w-3xl mx-auto">
      {/* Progress bar */}
      <WizardProgress step={step} steps={[...STEPS]} />

      {/* Step heading */}
      <h2 className="font-display text-3xl text-parchment mb-6">
        {STEPS[step]}
      </h2>

      {/* Step content */}
      {step === 0 && (
        <Step1 draft={draft} update={updateDraft} errors={errors} />
      )}
      {step === 1 && (
        <Step2 draft={draft} update={updateDraft} errors={errors} />
      )}
      {step === 2 && (
        <Step3 draft={draft} update={updateDraft} errors={errors} />
      )}
      {step === 3 && (
        <Step4 draft={draft} update={updateDraft} errors={errors} />
      )}

      {/* Navigation footer */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-gold/10 pt-6">
        {/* Back */}
        {step > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="rounded-[var(--radius-pill)] border border-gold/40 text-gold px-6 py-2.5 text-sm font-semibold hover:border-gold hover:text-gold-bright transition-colors"
          >
            {t("back")}
          </button>
        ) : (
          <div aria-hidden />
        )}

        {/* Next / Submit */}
        {isLastStep ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!draft.termsAccepted}
            className="rounded-[var(--radius-pill)] bg-terracotta hover:bg-terracotta-deep disabled:opacity-40 disabled:cursor-not-allowed text-parchment px-8 py-2.5 text-sm font-semibold transition-colors"
          >
            {t("submit")}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="rounded-[var(--radius-pill)] bg-terracotta hover:bg-terracotta-deep text-parchment px-8 py-2.5 text-sm font-semibold transition-colors"
          >
            {t("next")}
          </button>
        )}
      </div>
    </div>
  );
}
