"use client";

import { useState, useEffect, useTransition, useId } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Sparkles } from "lucide-react";
import GlassPanel from "@/components/glass-panel";
import { GlassInput, GlassTextarea } from "@/components/ui/glass-input";
import { GlassSelect } from "@/components/ui/glass-select";
import { GlassButton } from "@/components/ui/glass-button";
import { PhotoUpload } from "@/components/photo-upload";
import PostMap from "./post-map";
import { createListing, attachPhotos } from "../actions";

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
type PaymentKey = "stripe" | "bankak" | "cashi" | "mbok" | "bank" | "whatsapp";

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
  descriptionEn: string;
  descriptionAr: string;
  // Step 2
  state: StateKey | "";
  city: string;
  neighborhood: string;
  address: string;
  pinLat: number | null;
  pinLng: number | null;
  // Step 3 — Supabase public URLs (safe to persist)
  photoUrls: string[];
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
  descriptionEn: "",
  descriptionAr: "",
  state: "",
  city: "",
  neighborhood: "",
  address: "",
  pinLat: null,
  pinLng: null,
  photoUrls: [],
  tier: "standard",
  payment: "stripe",
  termsAccepted: false,
};

const SESSION_KEY = "sukan:post-draft";

// Temporary listing ID used for storage path during upload
// A real UUID is used so Supabase path is stable even before DB insert
function makeTempId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

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

// ─── Style helpers ────────────────────────────────────────────────────────────

const labelCls =
  "block text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-dk mb-1.5";

const errorCls = "mt-1.5 text-xs text-terracotta";

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
        className="smooth w-9 h-9 rounded-full border border-sand-dk bg-white/55 text-gold-dk flex items-center justify-center text-lg leading-none hover:border-gold hover:bg-gold/10 hover:text-gold-dk disabled:opacity-40"
        disabled={value <= min}
      >
        −
      </button>
      <span
        id={id}
        className="w-7 text-center text-ink font-bold tabular-nums text-base"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="increase"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="smooth w-9 h-9 rounded-full border border-sand-dk bg-white/55 text-gold-dk flex items-center justify-center text-lg leading-none hover:border-gold hover:bg-gold/10 hover:text-gold-dk disabled:opacity-40"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}

// ─── Interactive progress bar ─────────────────────────────────────────────────

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
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <div className="flex items-center w-full">
              {/* Leading connector */}
              {i > 0 && (
                <div
                  className={[
                    "h-px flex-1 smooth",
                    done || active ? "bg-gold/55" : "bg-gold/20",
                  ].join(" ")}
                />
              )}

              {/* Badge */}
              <div
                className={[
                  "relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 smooth",
                  active
                    ? "border-terracotta text-cream"
                    : done
                    ? "border-gold text-earth"
                    : "border-sand-dk bg-white/55 text-ink-mid",
                ].join(" ")}
                style={
                  active
                    ? {
                        background:
                          "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                        boxShadow: "var(--shadow-terracotta-glow)",
                      }
                    : done
                    ? {
                        background:
                          "linear-gradient(135deg, #c8873a 0%, #e0a857 100%)",
                        boxShadow: "var(--shadow-gold-glow)",
                      }
                    : undefined
                }
                aria-current={active ? "step" : undefined}
              >
                {done ? (
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
                    "h-px flex-1 smooth",
                    done ? "bg-gold/55" : "bg-gold/20",
                  ].join(" ")}
                />
              )}
            </div>

            {/* Label */}
            <span
              className={[
                "text-xs text-center leading-tight",
                active
                  ? "text-ink font-semibold"
                  : done
                  ? "text-gold-dk"
                  : "text-ink-mid hidden sm:block",
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

// ─── AI Price Estimate callout ────────────────────────────────────────────────

interface PriceEstimate {
  min: number;
  max: number;
  suggested: number;
  currency: string;
  reasoning_en: string;
  reasoning_ar: string;
}

function PriceEstimateCallout({
  estimate,
  period,
  locale,
  onUseSuggested,
}: {
  estimate: PriceEstimate;
  period: PeriodKey;
  locale: string;
  onUseSuggested: (price: string) => void;
}) {
  const t = useTranslations("ai");
  const periodLabel =
    period === "month" ? "month" : period === "year" ? "year" : "total";

  const reasoning =
    locale === "ar" ? estimate.reasoning_ar : estimate.reasoning_en;

  return (
    <div
      className="mt-3 rounded-[var(--radius-glass)] border border-gold/30 p-4 space-y-2"
      style={{ background: "rgba(200,135,58,0.08)" }}
    >
      <p className="text-sm text-ink font-semibold">
        {t("suggestion", {
          min: `${estimate.currency} ${estimate.min.toLocaleString()}`,
          max: `${estimate.currency} ${estimate.max.toLocaleString()}`,
          period: periodLabel,
        })}
      </p>
      {reasoning && (
        <p className="text-xs text-ink-mid leading-relaxed">{reasoning}</p>
      )}
      <GlassButton
        type="button"
        variant="gold"
        size="sm"
        onClick={() => onUseSuggested(String(estimate.suggested))}
      >
        {t("useSuggested")} — {estimate.currency} {estimate.suggested.toLocaleString()}
      </GlassButton>
    </div>
  );
}

// ─── Step 1: Property Details ─────────────────────────────────────────────────

function Step1({
  draft,
  update,
  errors,
  userId,
}: {
  draft: PostDraft;
  update: (patch: Partial<PostDraft>) => void;
  errors: Record<string, string>;
  userId: string | null;
}) {
  const pt = useTranslations("propertyType");
  const ht = useTranslations("hero");
  const t = useTranslations("post");
  const ai = useTranslations("ai");
  const locale = useLocale();

  const bedroomsId = useId();
  const bathroomsId = useId();
  const areaId = useId();
  const priceId = useId();
  const descEnId = useId();
  const descArId = useId();

  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [descError, setDescError] = useState<string | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);
  const [priceEstimate, setPriceEstimate] = useState<PriceEstimate | null>(null);

  async function handleGenerateDescription() {
    setGeneratingDesc(true);
    setDescError(null);
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyType: draft.propertyType,
          bedrooms: draft.bedrooms,
          bathrooms: draft.bathrooms,
          areaSqm: draft.area ? Number(draft.area) : null,
          state: draft.state,
          city: draft.city,
          amenities: [],
          purpose: draft.purpose,
          price: draft.price ? Number(draft.price) : null,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (res.status === 401) {
          setDescError(ai("aiUnavailable"));
        } else {
          setDescError(body.error ?? ai("error"));
        }
        return;
      }
      const data = (await res.json()) as {
        description_en?: string;
        description_ar?: string;
      };
      if (
        typeof data.description_en !== "string" ||
        typeof data.description_ar !== "string"
      ) {
        setDescError(ai("error"));
        return;
      }
      update({
        descriptionEn: data.description_en,
        descriptionAr: data.description_ar,
      });
    } catch {
      setDescError(ai("error"));
    } finally {
      setGeneratingDesc(false);
    }
  }

  async function handleEstimatePrice() {
    setEstimating(true);
    setEstimateError(null);
    setPriceEstimate(null);
    try {
      const res = await fetch("/api/estimate-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyType: draft.propertyType,
          bedrooms: draft.bedrooms,
          bathrooms: draft.bathrooms,
          areaSqm: draft.area ? Number(draft.area) : null,
          state: draft.state,
          city: draft.city,
          amenities: [],
          purpose: draft.purpose,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (res.status === 401) {
          setEstimateError(ai("aiUnavailable"));
        } else {
          setEstimateError(body.error ?? ai("error"));
        }
        return;
      }
      const data = (await res.json()) as {
        min?: number;
        max?: number;
        suggested?: number;
        currency?: string;
        reasoning_en?: string;
        reasoning_ar?: string;
      };
      if (
        typeof data.min !== "number" ||
        typeof data.max !== "number" ||
        typeof data.suggested !== "number"
      ) {
        setEstimateError(ai("error"));
        return;
      }
      setPriceEstimate({
        min: data.min,
        max: data.max,
        suggested: data.suggested,
        currency: data.currency ?? "USD",
        reasoning_en: data.reasoning_en ?? "",
        reasoning_ar: data.reasoning_ar ?? "",
      });
    } catch {
      setEstimateError(ai("error"));
    } finally {
      setEstimating(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Property type tiles */}
      <fieldset>
        <legend className={labelCls}>{t("typeLabel")}</legend>
        <div className="grid grid-cols-4 gap-3 mt-2">
          {PROPERTY_TYPE_KEYS.map((key) => {
            const active = draft.propertyType === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => update({ propertyType: key })}
                className={[
                  "smooth flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-[var(--radius-glass)] border p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream",
                  active
                    ? "border-terracotta/60 text-cream"
                    : "glass-warm border-white/55 text-ink hover:border-gold/55 hover:shadow-[var(--shadow-warm)]",
                ].join(" ")}
                style={
                  active
                    ? {
                        background:
                          "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                        boxShadow: "var(--shadow-terracotta-glow)",
                      }
                    : undefined
                }
                aria-pressed={active}
              >
                <span className="text-4xl leading-none" aria-hidden>
                  {PROPERTY_TYPE_GLYPHS[key]}
                </span>
                <span className="text-sm font-medium leading-tight">
                  {pt(key)}
                </span>
              </button>
            );
          })}
        </div>
        {errors.propertyType && (
          <p className={errorCls} role="alert">
            {errors.propertyType}
          </p>
        )}
      </fieldset>

      {/* Purpose */}
      <fieldset>
        <legend className={labelCls}>{t("purposeLabel")}</legend>
        <div
          className="inline-flex w-full mt-2 rounded-[var(--radius-pill)] border border-white/55 bg-white/45 p-1 backdrop-blur-md"
          role="group"
        >
          {(["rent", "sale"] as PurposeKey[]).map((key) => {
            const active = draft.purpose === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => update({ purpose: key })}
                className={[
                  "smooth flex-1 rounded-[var(--radius-pill)] py-2 text-sm font-semibold",
                  active
                    ? "text-cream shadow-[0_2px_10px_rgba(200,64,26,0.30)]"
                    : "text-ink-mid hover:text-ink",
                ].join(" ")}
                style={
                  active
                    ? {
                        background:
                          "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                      }
                    : undefined
                }
                aria-pressed={active}
              >
                {ht(key)}
              </button>
            );
          })}
        </div>
        {errors.purpose && (
          <p className={errorCls} role="alert">
            {errors.purpose}
          </p>
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
        <label htmlFor={areaId} className={labelCls}>{t("areaLabel")}</label>
        <GlassInput
          id={areaId}
          tone="light"
          type="number"
          min={0}
          placeholder="e.g. 120"
          value={draft.area}
          onChange={(e) => update({ area: e.target.value })}
        />
      </div>

      {/* Price + currency + period */}
      <div>
        <label htmlFor={priceId} className={labelCls}>{t("priceLabel")}</label>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_7rem_8rem] gap-2">
          <GlassInput
            id={priceId}
            tone="light"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="0"
            value={draft.price}
            onChange={(e) => update({ price: e.target.value })}
            className="min-w-0"
          />
          <GlassSelect
            tone="light"
            value={draft.currency}
            onChange={(e) =>
              update({ currency: e.target.value as CurrencyKey })
            }
            aria-label={t("currencyLabel")}
          >
            <option value="SDG">SDG</option>
            <option value="USD">USD</option>
          </GlassSelect>
          <GlassSelect
            tone="light"
            value={draft.period}
            onChange={(e) => update({ period: e.target.value as PeriodKey })}
            aria-label={t("periodLabel")}
          >
            <option value="month">{t("pricePeriodMonth")}</option>
            <option value="year">{t("pricePeriodYear")}</option>
            <option value="total">{t("pricePeriodTotal")}</option>
          </GlassSelect>
        </div>
        {errors.price && (
          <p className={errorCls} role="alert">
            {errors.price}
          </p>
        )}

        {/* F7: AI price estimator button */}
        <div className="mt-2 flex items-center gap-2">
          <GlassButton
            type="button"
            variant="ghost-light"
            size="sm"
            onClick={handleEstimatePrice}
            disabled={estimating}
          >
            <Sparkles
              size={14}
              className="text-gold shrink-0"
              aria-hidden="true"
            />
            {estimating ? ai("estimating") : ai("estimatePrice")}
          </GlassButton>
        </div>
        {estimateError && (
          <p className={errorCls} role="alert">
            {estimateError}
          </p>
        )}
        {priceEstimate && (
          <PriceEstimateCallout
            estimate={priceEstimate}
            period={draft.period}
            locale={locale}
            onUseSuggested={(price) => {
              update({ price });
              setPriceEstimate(null);
            }}
          />
        )}
      </div>

      {/* F6: Description fields with AI generator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <label className={`${labelCls} mb-0`}>{t("descriptionLabel")}</label>
          <GlassButton
            type="button"
            variant="ghost-light"
            size="sm"
            onClick={handleGenerateDescription}
            disabled={generatingDesc || !userId}
          >
            <Sparkles
              size={14}
              className="text-gold shrink-0"
              aria-hidden="true"
            />
            {generatingDesc ? ai("generating") : ai("generateDescription")}
          </GlassButton>
        </div>
        {descError && (
          <p className={errorCls} role="alert">
            {descError}
          </p>
        )}
        <div>
          <label htmlFor={descEnId} className={`${labelCls}`}>
            {t("descriptionEnLabel")}
          </label>
          <GlassTextarea
            id={descEnId}
            tone="light"
            rows={4}
            placeholder={t("descriptionEnPlaceholder")}
            value={draft.descriptionEn}
            onChange={(e) => update({ descriptionEn: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor={descArId} className={`${labelCls}`} dir="rtl">
            {t("descriptionArLabel")}
          </label>
          <GlassTextarea
            id={descArId}
            tone="light"
            rows={4}
            dir="rtl"
            placeholder={t("descriptionArPlaceholder")}
            value={draft.descriptionAr}
            onChange={(e) => update({ descriptionAr: e.target.value })}
          />
        </div>
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
  const stateId = useId();
  const cityId = useId();
  const neighborhoodId = useId();
  const addressId = useId();

  const coords =
    draft.state && STATE_COORDS[draft.state as StateKey]
      ? STATE_COORDS[draft.state as StateKey]
      : null;

  return (
    <div className="space-y-6">
      {/* State */}
      <div>
        <label htmlFor={stateId} className={labelCls}>{t("stateLabel")}</label>
        <GlassSelect
          id={stateId}
          tone="light"
          value={draft.state}
          onChange={(e) =>
            update({
              state: e.target.value as StateKey,
              pinLat: null,
              pinLng: null,
            })
          }
        >
          <option value="">{t("selectState")}</option>
          {STATE_KEYS.map((key) => (
            <option key={key} value={key}>
              {st(key)}
            </option>
          ))}
        </GlassSelect>
        {errors.state && (
          <p className={errorCls} role="alert">
            {errors.state}
          </p>
        )}
      </div>

      {/* City */}
      <div>
        <label htmlFor={cityId} className={labelCls}>{t("cityLabel")}</label>
        <GlassInput
          id={cityId}
          tone="light"
          type="text"
          placeholder={t("cityPlaceholder")}
          value={draft.city}
          onChange={(e) => update({ city: e.target.value })}
        />
        {errors.city && (
          <p className={errorCls} role="alert">
            {errors.city}
          </p>
        )}
      </div>

      {/* Neighborhood (optional) */}
      <div>
        <label htmlFor={neighborhoodId} className={labelCls}>{t("neighborhoodLabel")}</label>
        <GlassInput
          id={neighborhoodId}
          tone="light"
          type="text"
          placeholder={t("neighborhoodPlaceholder")}
          value={draft.neighborhood}
          onChange={(e) => update({ neighborhood: e.target.value })}
        />
      </div>

      {/* Address line (optional) */}
      <div>
        <label htmlFor={addressId} className={labelCls}>{t("addressLabel")}</label>
        <GlassInput
          id={addressId}
          tone="light"
          type="text"
          placeholder={t("addressPlaceholder")}
          value={draft.address}
          onChange={(e) => update({ address: e.target.value })}
        />
      </div>

      {/* Live draggable map */}
      <div>
        <p className="text-xs text-ink-mid mb-2">{t("mapHint")}</p>
        {coords ? (
          <PostMap
            center={[
              draft.pinLat ?? coords[0],
              draft.pinLng ?? coords[1],
            ]}
            pin={[draft.pinLat ?? coords[0], draft.pinLng ?? coords[1]]}
            onPinDrag={([lat, lng]) => update({ pinLat: lat, pinLng: lng })}
          />
        ) : (
          <div
            className="w-full rounded-[var(--radius-card)] border-2 border-dashed border-sand-dk glass-warm flex items-center justify-center"
            style={{ height: 360 }}
            role="img"
            aria-label={t("mapHint")}
          >
            <p className="text-ink-mid text-sm px-6 text-center">
              {t("selectState")}
            </p>
          </div>
        )}
        {coords && (
          <p className="mt-2 text-xs text-gold/70 font-mono tabular-nums">
            {draft.state ? st(draft.state as StateKey) : ""}{" "}
            {(draft.pinLat ?? coords[0]).toFixed(4)}°N,{" "}
            {(draft.pinLng ?? coords[1]).toFixed(4)}°E
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Step 3: Photos (F2) ──────────────────────────────────────────────────────

function Step3({
  draft,
  update,
  errors,
  userId,
  tempListingId,
}: {
  draft: PostDraft;
  update: (patch: Partial<PostDraft>) => void;
  errors: Record<string, string>;
  userId: string | null;
  tempListingId: string;
}) {
  const t = useTranslations("post");

  if (!userId) {
    return (
      <div className="py-12 text-center text-ink-mid text-sm">
        {t("signInRequired")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PhotoUpload
        userId={userId}
        listingId={tempListingId}
        max={5}
        onChange={(urls) => update({ photoUrls: urls })}
        initial={draft.photoUrls}
      />
      {errors.photoUrls && (
        <p className={errorCls} role="alert">
          {errors.photoUrls}
        </p>
      )}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: listing summary */}
        <div>
          <h2 className="font-display text-2xl text-ink mb-4">
            {t("reviewTitle")}
          </h2>

          <GlassPanel variant="warm" radius="card" shadow={false} highlight={false} className="border border-white/55">
            <dl className="divide-y divide-sand-dk/40">
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
                  value: t("summaryPhotosCount", {
                    count: draft.photoUrls.length,
                  }),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-baseline gap-4 px-4 py-2.5"
                >
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-mid shrink-0">
                    {label}
                  </dt>
                  <dd className="text-sm text-ink text-end">{value}</dd>
                </div>
              ))}
            </dl>
          </GlassPanel>
        </div>

        {/* Right: pricing + payment */}
        <div className="space-y-6">
          {/* Pricing tier */}
          <div>
            <h2 className="font-display text-2xl text-ink mb-4">
              {t("pricingTitle")}
            </h2>
            <div className="space-y-3">
              {/* Standard tier */}
              <label
                className={[
                  "smooth flex items-start gap-4 rounded-[var(--radius-card)] border p-4 cursor-pointer",
                  draft.tier === "standard"
                    ? "border-gold/55 bg-gold/8"
                    : "border-white/55 glass-warm hover:border-gold/40",
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
                  <p className="text-ink font-semibold text-sm">
                    {t("tierStandard")}
                  </p>
                  <p className="text-ink-mid text-xs mt-0.5">
                    {t("tierStandardDesc")}
                  </p>
                </div>
              </label>

              {/* Featured tier */}
              <label
                className={[
                  "smooth flex items-start gap-4 rounded-[var(--radius-card)] border p-4 cursor-pointer",
                  draft.tier === "featured"
                    ? "border-gold/55 bg-gold/8"
                    : "border-white/55 glass-warm hover:border-gold/40",
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
                    <p className="text-ink font-semibold text-sm">
                      {t("tierFeatured")}
                    </p>
                    <span
                      className="rounded-[var(--radius-pill)] text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide text-earth"
                      style={{
                        background:
                          "linear-gradient(135deg, #c8873a 0%, #e0a857 100%)",
                      }}
                    >
                      {t("tierFeaturedBadge")}
                    </span>
                  </div>
                  <p className="text-ink-mid text-xs">
                    {t("tierFeaturedPerk")}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <h3 className={`${labelCls} mb-3`}>{t("paymentTitle")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(
                [
                  { value: "stripe", label: t("payStripe"), badge: "USD" },
                  { value: "bankak", label: t("payBankak"), badge: "SDG" },
                  { value: "cashi", label: t("payCashi"), badge: "SDG" },
                  { value: "mbok", label: t("payMbok"), badge: "SDG" },
                  { value: "bank", label: t("payBank"), badge: "SDG" },
                  {
                    value: "whatsapp",
                    label: t("payWhatsapp"),
                    badge: "—",
                  },
                ] as { value: PaymentKey; label: string; badge: string }[]
              ).map(({ value, label, badge }) => (
                <label
                  key={value}
                  className={[
                    "smooth flex items-center justify-between gap-3 cursor-pointer rounded-xl border px-4 py-3",
                    draft.payment === value
                      ? "border-terracotta/60 bg-terracotta/10"
                      : "border-white/55 glass-warm hover:border-gold/40",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={draft.payment === value}
                      onChange={() => update({ payment: value })}
                      className="accent-terracotta"
                    />
                    <span className="text-sm text-ink">{label}</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-ink-mid">
                    {badge}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Per-method instructions */}
          <PaymentInstructions method={draft.payment} />

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.termsAccepted}
              onChange={(e) => update({ termsAccepted: e.target.checked })}
              className="mt-0.5 accent-gold w-4 h-4 shrink-0"
            />
            <span className="text-sm text-ink-mid leading-snug">
              {t("confirmAccuracy")}
            </span>
          </label>
          {errors.termsAccepted && (
            <p className={errorCls} role="alert">
              {errors.termsAccepted}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Payment instructions panel ──────────────────────────────────────────────

const SUKAN_PAYMENT_DETAILS = {
  bankak: { account: "1234 5678 9012", reference: "SUKAN-{id}" },
  cashi: { phone: "+249 91 200 0000", reference: "SUKAN-{id}" },
  mbok: { phone: "+249 91 200 0001", reference: "SUKAN-{id}" },
  bank: {
    account: "Bank of Khartoum 0001-2345-6789",
    reference: "SUKAN-{id}",
  },
  whatsapp: { phone: "+249 91 234 5678" },
} as const;

function PaymentInstructions({ method }: { method: PaymentKey }) {
  const t = useTranslations("post");

  if (method === "stripe") return null;

  if (method === "bankak") {
    const d = SUKAN_PAYMENT_DETAILS.bankak;
    return (
      <GlassPanel variant="warm" radius="card" shadow={false} highlight={false} className="border border-white/55 text-xs text-ink-mid leading-relaxed p-4">
        <p className="text-ink font-semibold mb-1.5">
          {t("payInstructionsBankak")}
        </p>
        <p>
          {t("payInstructionsAccount")}:{" "}
          <span className="font-mono text-ink">{d.account}</span>
        </p>
        <p>
          {t("payInstructionsReference")}:{" "}
          <span className="font-mono text-ink">{d.reference}</span>
        </p>
      </GlassPanel>
    );
  }

  if (method === "cashi" || method === "mbok") {
    const d = SUKAN_PAYMENT_DETAILS[method];
    return (
      <GlassPanel variant="warm" radius="card" shadow={false} highlight={false} className="border border-white/55 text-xs text-ink-mid leading-relaxed p-4">
        <p className="text-ink font-semibold mb-1.5">
          {method === "cashi"
            ? t("payInstructionsCashi")
            : t("payInstructionsMbok")}
        </p>
        <p>
          {t("payInstructionsPhone")}:{" "}
          <span className="font-mono text-ink">{d.phone}</span>
        </p>
        <p>
          {t("payInstructionsReference")}:{" "}
          <span className="font-mono text-ink">{d.reference}</span>
        </p>
      </GlassPanel>
    );
  }

  if (method === "bank") {
    const d = SUKAN_PAYMENT_DETAILS.bank;
    return (
      <GlassPanel variant="warm" radius="card" shadow={false} highlight={false} className="border border-white/55 text-xs text-ink-mid leading-relaxed p-4">
        <p className="text-ink font-semibold mb-1.5">
          {t("payInstructionsBank")}
        </p>
        <p>
          {t("payInstructionsAccount")}:{" "}
          <span className="font-mono text-ink">{d.account}</span>
        </p>
        <p>
          {t("payInstructionsReference")}:{" "}
          <span className="font-mono text-ink">{d.reference}</span>
        </p>
      </GlassPanel>
    );
  }

  if (method === "whatsapp") {
    const d = SUKAN_PAYMENT_DETAILS.whatsapp;
    const waUrl = `https://wa.me/${d.phone.replace(/\D/g, "")}?text=${encodeURIComponent("I'd like to pay for a Sukan listing")}`;
    return (
      <GlassPanel variant="warm" radius="card" shadow={false} highlight={false} className="border border-white/55 text-xs text-ink-mid leading-relaxed p-4">
        <p className="text-ink font-semibold mb-1.5">
          {t("payInstructionsWhatsapp")}
        </p>
        <p className="mb-3">{t("payInstructionsWhatsappBody")}</p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-4 py-2 text-xs font-semibold text-white smooth"
          style={{ backgroundColor: "#25d366" }}
        >
          {t("payInstructionsWhatsappCta")}
        </a>
      </GlassPanel>
    );
  }

  return null;
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessState() {
  const t = useTranslations("post");
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
      {/* Animated gold ring + check */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(200,135,58,0.12)",
          boxShadow: "var(--shadow-gold-glow)",
          border: "2px solid rgba(200,135,58,0.45)",
        }}
      >
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
        <h2 className="font-display text-3xl text-ink mb-2">
          {t("successHeading")}
        </h2>
        <p className="text-ink-mid text-sm max-w-sm mx-auto">
          {t("successBody")}
        </p>
      </div>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(
  step: number,
  draft: PostDraft,
  t: (key: string) => string,
): Record<string, string> {
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
    if (draft.photoUrls.length === 0) errs.photoUrls = t("errorPhotos");
  }
  if (step === 3) {
    if (!draft.termsAccepted) errs.termsAccepted = t("errorTerms");
  }
  return errs;
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export default function PostWizard({ userId }: { userId: string | null }) {
  const t = useTranslations("post");
  const [, startTransition] = useTransition();

  // Stable temp ID used as storage path folder during upload
  const [tempListingId] = useState<string>(() => makeTempId());

  const [draft, setDraft] = useState<PostDraft>(() => ({ ...INITIAL_DRAFT }));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const STEPS = [t("step1"), t("step2"), t("step3"), t("step4")] as const;

  // Load persisted draft from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<PostDraft>;
        setDraft((prev) => ({ ...prev, ...saved }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist draft (including photoUrls — they're stable Supabase public URLs)
  function updateDraft(patch: Partial<PostDraft>) {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      startTransition(() => {
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
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
    const errs = validate(step, draft, (k) =>
      t(k as Parameters<typeof t>[0]),
    );
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    const errs = validate(3, draft, (k) =>
      t(k as Parameters<typeof t>[0]),
    );
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (!draft.propertyType || !draft.purpose || !draft.state) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const state = draft.state as StateKey;
      const coords = STATE_COORDS[state];

      const result = await createListing({
        titleEn: draft.descriptionEn
          ? draft.descriptionEn.slice(0, 80)
          : `${draft.propertyType} in ${draft.city}`,
        titleAr: draft.descriptionAr
          ? draft.descriptionAr.slice(0, 80)
          : `${draft.propertyType} في ${draft.city}`,
        descriptionEn: draft.descriptionEn,
        descriptionAr: draft.descriptionAr,
        propertyType: draft.propertyType,
        purpose: draft.purpose,
        state: draft.state,
        city: draft.city,
        neighborhood: draft.neighborhood || null,
        address: draft.address || null,
        latitude: draft.pinLat ?? coords[0],
        longitude: draft.pinLng ?? coords[1],
        bedrooms: draft.bedrooms,
        bathrooms: draft.bathrooms,
        areaSqm: draft.area ? Number(draft.area) : null,
        price: Number(draft.price),
        currency: draft.currency,
        pricePeriod: draft.period,
        amenities: [],
        tier: draft.tier,
        whatsappContact: null,
      });

      if (!result.ok) {
        setSubmitError(result.error);
        setSubmitting(false);
        return;
      }

      // Attach uploaded photos to the new listing
      if (draft.photoUrls.length > 0) {
        await attachPhotos(result.listingId, draft.photoUrls);
      }

      sessionStorage.removeItem(SESSION_KEY);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <GlassPanel
        variant="warm"
        radius="glass"
        highlight
        shadow="lg"
        className="border border-white/55 p-6 sm:p-10 max-w-3xl mx-auto"
      >
        <SuccessState />
      </GlassPanel>
    );
  }

  const isLastStep = step === STEPS.length - 1;

  return (
    <GlassPanel
      variant="warm"
      radius="glass"
      highlight
      shadow="lg"
      className="border border-white/55 p-6 sm:p-10 max-w-3xl mx-auto"
    >
      {/* Progress bar */}
      <WizardProgress step={step} steps={[...STEPS]} />

      {/* Step heading */}
      <h2 className="font-display text-3xl text-ink mb-6">
        {STEPS[step]}
      </h2>

      {/* Step content */}
      {step === 0 && (
        <Step1
          draft={draft}
          update={updateDraft}
          errors={errors}
          userId={userId}
        />
      )}
      {step === 1 && (
        <Step2 draft={draft} update={updateDraft} errors={errors} />
      )}
      {step === 2 && (
        <Step3
          draft={draft}
          update={updateDraft}
          errors={errors}
          userId={userId}
          tempListingId={tempListingId}
        />
      )}
      {step === 3 && (
        <Step4 draft={draft} update={updateDraft} errors={errors} />
      )}

      {submitError && (
        <p className={`${errorCls} mt-4`} role="alert">
          {submitError}
        </p>
      )}

      {/* Navigation footer */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-sand-dk/40 pt-6">
        {/* Back */}
        {step > 0 ? (
          <GlassButton
            type="button"
            variant="ghost-light"
            size="md"
            onClick={handleBack}
          >
            {t("back")}
          </GlassButton>
        ) : (
          <div aria-hidden />
        )}

        {/* Next / Submit */}
        {isLastStep ? (
          <GlassButton
            type="button"
            variant="terracotta"
            size="md"
            onClick={handleSubmit}
            disabled={!draft.termsAccepted || submitting}
          >
            {submitting ? t("submitting") : t("submit")}
          </GlassButton>
        ) : (
          <GlassButton
            type="button"
            variant="terracotta"
            size="md"
            onClick={handleNext}
          >
            {t("next")}
          </GlassButton>
        )}
      </div>
    </GlassPanel>
  );
}
