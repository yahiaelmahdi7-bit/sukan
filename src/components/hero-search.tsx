"use client";

import { useState, useRef, useCallback, useId, KeyboardEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search } from "lucide-react";
import SearchAutocomplete, {
  searchAll,
  flattenResults,
  type SearchResult,
} from "./search-autocomplete";
import type { Locale } from "@/i18n/routing";

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
  const locale = useLocale() as Locale;
  const listboxId = useId();

  // ── Filter state ───────────────────────────────────────────────────────────
  const [purpose, setPurpose] = useState<"rent" | "sale">("rent");
  const [state, setState] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // ── Autocomplete state ─────────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Derive results on every render (datasets are tiny — no memoisation needed)
  const results = searchAll(query, locale === "ar" ? "ar" : "en");
  const flat = flattenResults(results);
  const totalRows = flat.length;

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setDropdownOpen(false);
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    if (propertyType) params.set("type", propertyType);
    params.set("purpose", purpose);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (query.trim()) params.set("q", query.trim());
    router.push(`/listings?${params.toString()}`);
  }

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      setActiveIndex(-1);
      setDropdownOpen(val.trim().length >= 2);
    },
    [],
  );

  const handleInputFocus = useCallback(() => {
    if (query.trim().length >= 2) setDropdownOpen(true);
  }, [query]);

  const handleInputBlur = useCallback(() => {
    // Small delay so onMouseDown in the dropdown fires first
    setTimeout(() => setDropdownOpen(false), 120);
  }, []);

  const closeDropdown = useCallback(() => {
    setDropdownOpen(false);
    setActiveIndex(-1);
  }, []);

  const navigateToResult = useCallback(
    (result: SearchResult) => {
      closeDropdown();
      setQuery("");
      if (result.kind === "state") {
        router.push(`/listings?state=${result.key}`);
      } else if (result.kind === "neighborhood") {
        router.push(
          `/listings?state=${result.stateKey}&neighborhood=${result.slug}`,
        );
      } else {
        router.push(`/listings/${result.id}`);
      }
    },
    [closeDropdown, router],
  );

  const handleSeeAll = useCallback(() => {
    closeDropdown();
    router.push(`/listings?q=${encodeURIComponent(query.trim())}`);
  }, [closeDropdown, query, router]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!dropdownOpen || totalRows === 0) {
        if (e.key === "Escape") closeDropdown();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % totalRows);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + totalRows) % totalRows);
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && activeIndex < totalRows) {
          e.preventDefault();
          navigateToResult(flat[activeIndex]);
        }
        // else — let the form submit normally
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeDropdown();
      }
    },
    [activeIndex, closeDropdown, dropdownOpen, flat, navigateToResult, totalRows],
  );

  // ── Shared styles ──────────────────────────────────────────────────────────

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
      {/* ── Autocomplete search input ────────────────────────────────────── */}
      <div ref={wrapperRef} className="relative mb-5">
        <label htmlFor="hero-query" className={labelBase}>
          {t("search.placeholder")}
        </label>
        <div className="relative">
          <Search
            size={15}
            strokeWidth={2}
            aria-hidden
            className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-ink-mid/50"
          />
          <input
            ref={inputRef}
            id="hero-query"
            type="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={query}
            onChange={handleQueryChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={t("search.placeholder")}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            aria-controls={dropdownOpen ? listboxId : undefined}
            aria-activedescendant={
              dropdownOpen && activeIndex >= 0
                ? `${listboxId}-opt-${activeIndex}`
                : undefined
            }
            className={`${fieldBase} ps-9`}
          />
        </div>

        {dropdownOpen && (
          <SearchAutocomplete
            results={results}
            query={query}
            locale={locale === "ar" ? "ar" : "en"}
            activeIndex={activeIndex}
            listboxId={listboxId}
            onHover={setActiveIndex}
            onSelect={navigateToResult}
            onSeeAll={handleSeeAll}
          />
        )}
      </div>

      {/* ── Filter grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        {/* State */}
        <div>
          <label htmlFor="hero-state" className={labelBase}>
            {t("hero.stateLabel")}
          </label>
          <select
            id="hero-state"
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
          <label htmlFor="hero-type" className={labelBase}>
            {t("hero.typeLabel")}
          </label>
          <select
            id="hero-type"
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
          <p id="hero-purpose-label" className={labelBase}>
            {t("hero.purposeLabel")}
          </p>
          <div
            role="group"
            aria-labelledby="hero-purpose-label"
            className="inline-flex w-full rounded-[var(--radius-pill)] border border-white/55 bg-white/45 p-1 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setPurpose("rent")}
              aria-pressed={purpose === "rent"}
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
              aria-pressed={purpose === "sale"}
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
          <label htmlFor="hero-max-price" className={labelBase}>
            {t("hero.priceLabel")}
          </label>
          <input
            id="hero-max-price"
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

      {/* ── Search CTA ───────────────────────────────────────────────────── */}
      <button
        type="submit"
        className="smooth mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] py-3 text-sm font-semibold text-cream hover:brightness-[1.05]"
        style={{
          background: "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
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
