"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search } from "lucide-react";

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

type PropertyTypeKey =
  | "apartment"
  | "house"
  | "villa"
  | "studio"
  | "shop"
  | "office"
  | "land"
  | "warehouse";

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

export default function HeroSearch() {
  const t = useTranslations();
  const router = useRouter();

  const [purpose, setPurpose] = useState<"rent" | "sale">("rent");
  const [state, setState] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    if (propertyType) params.set("type", propertyType);
    params.set("purpose", purpose);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/listings?${params.toString()}`);
  }

  const fieldBase =
    "smooth-fast w-full rounded-xl border border-white/55 bg-white/55 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-mid/70 backdrop-blur-md focus:outline-none focus:border-gold/55 focus:bg-white/75 focus:ring-2 focus:ring-gold/20";

  const labelBase =
    "block text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-dk mb-2";

  return (
    <form
      onSubmit={handleSearch}
      className="glass-warm glass-highlight rounded-[var(--radius-glass)] border border-white/55 p-6 sm:p-7"
      style={{ boxShadow: "var(--shadow-glass)" }}
    >
      <div className="grid grid-cols-2 gap-4">
        {/* State */}
        <div>
          <label className={labelBase}>{t("hero.stateLabel")}</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={fieldBase}
          >
            <option value="">{t("hero.anyState")}</option>
            {STATE_KEYS.map((key) => (
              <option key={key} value={key}>
                {t(`states.${key}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Property type */}
        <div>
          <label className={labelBase}>{t("hero.typeLabel")}</label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={fieldBase}
          >
            <option value="">{t("hero.anyType")}</option>
            {PROPERTY_TYPE_KEYS.map((key) => (
              <option key={key} value={key}>
                {t(`propertyType.${key}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Purpose toggle — segmented */}
        <div>
          <label className={labelBase}>{t("hero.purposeLabel")}</label>
          <div
            role="group"
            className="inline-flex w-full rounded-[var(--radius-pill)] border border-white/55 bg-white/45 p-1 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setPurpose("rent")}
              className={`smooth-fast flex-1 rounded-[var(--radius-pill)] py-1.5 text-xs font-semibold ${
                purpose === "rent"
                  ? "bg-terracotta text-cream shadow-[0_2px_10px_rgba(200,64,26,0.30)]"
                  : "text-ink-mid hover:text-ink"
              }`}
            >
              {t("hero.rent")}
            </button>
            <button
              type="button"
              onClick={() => setPurpose("sale")}
              className={`smooth-fast flex-1 rounded-[var(--radius-pill)] py-1.5 text-xs font-semibold ${
                purpose === "sale"
                  ? "bg-terracotta text-cream shadow-[0_2px_10px_rgba(200,64,26,0.30)]"
                  : "text-ink-mid hover:text-ink"
              }`}
            >
              {t("hero.sale")}
            </button>
          </div>
        </div>

        {/* Max price */}
        <div>
          <label className={labelBase}>{t("hero.priceLabel")}</label>
          <input
            type="number"
            min={0}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="500"
            className={fieldBase}
          />
        </div>
      </div>

      {/* Search CTA */}
      <button
        type="submit"
        className="smooth mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] py-3 text-sm font-semibold text-cream hover:brightness-[1.05]"
        style={{
          background:
            "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
          boxShadow:
            "0 8px 24px rgba(200, 64, 26, 0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
      >
        <Search size={16} strokeWidth={2} aria-hidden />
        {t("hero.search")}
      </button>
    </form>
  );
}
