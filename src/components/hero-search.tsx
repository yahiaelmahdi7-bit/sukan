"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

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

  const selectBase =
    "w-full rounded-lg border border-gold/20 bg-earth text-parchment placeholder-mute-soft px-3 py-2.5 text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-colors";

  const labelBase = "block text-xs font-semibold uppercase tracking-wider text-mute-soft mb-1.5";

  return (
    <form
      onSubmit={handleSearch}
      className="bg-earth-soft rounded-[var(--radius-card)] border border-gold/20 p-6 shadow-2xl shadow-black/40"
    >
      <div className="grid grid-cols-2 gap-4">
        {/* State */}
        <div>
          <label className={labelBase}>{t("hero.stateLabel")}</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={selectBase}
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
            className={selectBase}
          >
            <option value="">{t("hero.anyType")}</option>
            {PROPERTY_TYPE_KEYS.map((key) => (
              <option key={key} value={key}>
                {t(`propertyType.${key}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Purpose toggle */}
        <div>
          <label className={labelBase}>{t("hero.purposeLabel")}</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPurpose("rent")}
              className={`flex-1 rounded-[var(--radius-pill)] py-2 text-sm font-semibold transition-colors ${
                purpose === "rent"
                  ? "bg-terracotta text-parchment"
                  : "border border-gold/40 text-mute-soft hover:border-gold/70 hover:text-parchment"
              }`}
            >
              {t("hero.rent")}
            </button>
            <button
              type="button"
              onClick={() => setPurpose("sale")}
              className={`flex-1 rounded-[var(--radius-pill)] py-2 text-sm font-semibold transition-colors ${
                purpose === "sale"
                  ? "bg-terracotta text-parchment"
                  : "border border-gold/40 text-mute-soft hover:border-gold/70 hover:text-parchment"
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
            placeholder="e.g. 500"
            className={selectBase}
          />
        </div>
      </div>

      {/* Search CTA */}
      <button
        type="submit"
        className="mt-5 w-full rounded-[var(--radius-pill)] bg-terracotta hover:bg-terracotta-deep text-parchment font-semibold py-3 text-base transition-colors"
      >
        {t("hero.search")}
      </button>
    </form>
  );
}
