"use client";

import type { Listing } from "@/lib/sample-listings";

export interface MapResultsPanelLabels {
  panelTitle: string;
  toggleList: string;
  hideList: string;
  flyToListing: string;
  legendRent: string;
  legendSale: string;
  legendFeatured: string;
  perMonth: string;
  perYear: string;
  perTotal: string;
  bedroomsShort: string;
  bathroomsShort: string;
  areaShort: string;
}

interface Props {
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  locale: string;
  labels: MapResultsPanelLabels;
  isOpen: boolean;
  onToggle: () => void;
}

function SukanMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity: 0.18 }}
    >
      <path
        d="M8 15 C16 9,26 9,32 14 C38 19,48 22,56 17 C54 19,48 24.5,40 21.5 C32 18.5,22 18,14 21 C10 22.5,8 20,8 18 Z"
        fill="#E0A857"
      />
      <path
        d="M8 27 C16 22,26 21,32 26 C38 31,49 33,56 28.5 C54 30.5,48 35.5,40 33 C32 30.5,22 30,14 33 C10 34.5,8 32,8 30 Z"
        fill="#E0A857"
      />
      <path
        d="M8 39 C16 34,26 33.5,32 38 C38 42.5,49 44.5,56 40.5 C54.5 42.5,48 46.5,40 44.5 C32 42.5,22 42,14 44.5 C10 45.5,8 43.5,8 42 Z"
        fill="#E0A857"
      />
      <circle cx="24" cy="52" r="2" fill="#E0A857" />
      <circle cx="32" cy="52" r="2" fill="#E0A857" />
      <circle cx="40" cy="52" r="2" fill="#E0A857" />
    </svg>
  );
}

function formatPanelPrice(listing: Listing): string {
  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(listing.priceUsd);
  return usd;
}

function getPeriodLabel(listing: Listing, labels: MapResultsPanelLabels): string {
  if (listing.period === "month") return labels.perMonth;
  if (listing.period === "year") return labels.perYear;
  return labels.perTotal;
}

export default function MapResultsPanel({
  listings,
  selectedId,
  onSelect,
  locale,
  labels,
  isOpen,
  onToggle,
}: Props) {
  return (
    <>
      {/* Floating toggle button — visible on small screens */}
      <button
        onClick={onToggle}
        style={{
          position: "fixed",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1100,
          background: "rgba(18,16,12,0.94)",
          border: "1.5px solid rgba(200,135,58,0.55)",
          color: "#E0A857",
          fontFamily: "system-ui,-apple-system,sans-serif",
          fontSize: "13px",
          fontWeight: 700,
          padding: "10px 22px",
          borderRadius: "999px",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
        aria-label={isOpen ? labels.hideList : labels.toggleList}
        className="lg:hidden"
      >
        <span style={{ fontSize: "15px" }}>≡</span>
        {isOpen ? labels.hideList : labels.toggleList}
      </button>

      {/* Side panel */}
      <aside
        aria-label={labels.panelTitle}
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#1F1A14",
          borderLeft: "1px solid rgba(200,135,58,0.15)",
          height: "100%",
          overflow: "hidden",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Terra accent bar at top */}
        <div
          style={{
            height: "3px",
            background: "linear-gradient(90deg, #C8401A, #E0A857)",
            flexShrink: 0,
          }}
        />

        {/* Sticky header */}
        <div
          style={{
            padding: "16px 18px 12px",
            borderBottom: "1px solid rgba(200,135,58,0.12)",
            flexShrink: 0,
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#C8873A",
              margin: "0 0 4px",
            }}
          >
            {labels.panelTitle}
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#8C7C69",
              margin: 0,
            }}
          >
            {listings.length} {listings.length === 1 ? "listing" : "listings"}
          </p>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              flexWrap: "wrap",
            }}
          >
            <LegendDot color="linear-gradient(135deg,#2A8B4F,#1A6B3A)" label={labels.legendRent} />
            <LegendDot color="linear-gradient(135deg,#E55A30,#C8401A)" label={labels.legendSale} />
            <LegendDot color="linear-gradient(135deg,#E8B84B,#C8873A)" label={labels.legendFeatured} star />
          </div>
        </div>

        {/* Scrollable list */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {listings.map((listing) => {
            const isSelected = listing.id === selectedId;
            const title = locale === "ar" ? listing.titleAr : listing.titleEn;
            const city = locale === "ar" ? listing.cityAr : listing.city;
            const price = formatPanelPrice(listing);
            const period = getPeriodLabel(listing, labels);

            return (
              <button
                key={listing.id}
                onClick={() => onSelect(listing.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  width: "100%",
                  padding: "14px 18px",
                  background: isSelected
                    ? "rgba(200,64,26,0.1)"
                    : "transparent",
                  borderLeft: isSelected
                    ? "3px solid #C8401A"
                    : "3px solid transparent",
                  borderTop: "none",
                  borderRight: "none",
                  borderBottom: "1px solid rgba(200,135,58,0.07)",
                  cursor: "pointer",
                  textAlign: "start",
                  transition: "background 0.15s",
                }}
                aria-pressed={isSelected}
                aria-label={`${title} — ${labels.flyToListing}`}
              >
                {/* Thumbnail watermark */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    background: "#2B231A",
                    backgroundImage:
                      "linear-gradient(135deg,rgba(200,135,58,0.12) 0%,transparent 60%)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <SukanMark />
                </div>

                {/* Text content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#FDF8F0",
                      margin: "0 0 2px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      lineHeight: "1.35",
                    }}
                  >
                    {title}
                  </p>

                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#E0A857",
                      margin: "0 0 3px",
                      lineHeight: "1.2",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {price}
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#8C7C69",
                        fontWeight: 400,
                        marginInlineStart: "3px",
                      }}
                    >
                      {period}
                    </span>
                  </p>

                  <p
                    style={{
                      fontSize: "11px",
                      color: "#8C7C69",
                      margin: "0 0 4px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {city}
                  </p>

                  {/* Meta row */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    {listing.bedrooms !== undefined && (
                      <MetaPill>
                        {labels.bedroomsShort.replace("{count}", String(listing.bedrooms))}
                      </MetaPill>
                    )}
                    {listing.bathrooms !== undefined && (
                      <MetaPill>
                        {labels.bathroomsShort.replace("{count}", String(listing.bathrooms))}
                      </MetaPill>
                    )}
                    {listing.areaSqm !== undefined && (
                      <MetaPill>
                        {labels.areaShort.replace("{value}", String(listing.areaSqm))}
                      </MetaPill>
                    )}
                    {listing.tier === "featured" && (
                      <MetaPill gold>★</MetaPill>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}

function LegendDot({
  color,
  label,
  star = false,
}: {
  color: string;
  label: string;
  star?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        fontSize: "11px",
        color: "#8C7C69",
      }}
    >
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      {star && (
        <span style={{ color: "#E8B84B", fontSize: "10px" }}>★</span>
      )}
      {label}
    </div>
  );
}

function MetaPill({
  children,
  gold = false,
}: {
  children: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <span
      style={{
        fontSize: "10px",
        fontWeight: 600,
        color: gold ? "#E8B84B" : "#8C7C69",
        background: gold
          ? "rgba(232,184,75,0.12)"
          : "rgba(140,124,105,0.12)",
        border: `1px solid ${gold ? "rgba(232,184,75,0.25)" : "rgba(140,124,105,0.2)"}`,
        borderRadius: "4px",
        padding: "1px 5px",
        lineHeight: "1.6",
      }}
    >
      {children}
    </span>
  );
}
