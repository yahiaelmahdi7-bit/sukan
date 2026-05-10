"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";

interface AlertRow {
  state: string | null;
  property_type: string | null;
  purpose: string;
  max_price: number | null;
}

function paramsToAlert(params: URLSearchParams): AlertRow {
  const maxPriceRaw = params.get("maxPrice");
  return {
    state: params.get("state") ?? null,
    property_type: params.get("type") ?? null,
    purpose: params.get("purpose") ?? "rent",
    max_price: maxPriceRaw ? parseInt(maxPriceRaw, 10) : null,
  };
}

export function SaveSearchButton() {
  const t = useTranslations("alerts");
  const searchParams = useSearchParams();
  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  async function handleSave() {
    setError(null);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const next = encodeURIComponent(`/listings?${searchParams.toString()}`);
      router.push(`/sign-in?next=${next}`);
      return;
    }

    const alert = paramsToAlert(searchParams);

    const { error: insertError } = await supabase.from("price_alerts").insert({
      user_id: user.id,
      ...alert,
      currency: "USD",
      is_active: true,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setOpen(false);
      }, 2000);
    }
  }

  const alert = paramsToAlert(searchParams);
  const hasFilters =
    alert.state || alert.property_type || alert.max_price || alert.purpose !== "rent";

  return (
    <div ref={popoverRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#C8873A]/40 bg-white/60 px-3 py-1.5 text-sm text-[#C8873A] backdrop-blur-sm transition hover:bg-[#C8873A]/10"
      >
        <Bell size={14} aria-hidden="true" />
        <span>{t("saveSearch")}</span>
      </button>

      {open && (
        <div className="absolute end-0 z-50 mt-2 w-64 rounded-2xl border border-white/40 bg-white/95 p-4 shadow-lg backdrop-blur-md flex flex-col gap-3">
          <p className="text-sm font-medium text-[#12100C]">{t("modalTitle")}</p>
          <p className="text-xs text-[#12100C]/60">{t("modalDesc")}</p>

          {/* Current filters summary */}
          {hasFilters && (
            <ul className="text-xs text-[#12100C]/70 space-y-0.5">
              {alert.state && <li>State: {alert.state}</li>}
              {alert.property_type && <li>Type: {alert.property_type}</li>}
              {alert.purpose && <li>Purpose: {alert.purpose}</li>}
              {alert.max_price && <li>Max price: ${alert.max_price}</li>}
            </ul>
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}

          {saved ? (
            <p className="text-xs font-medium text-green-700">{t("alertCreated")}</p>
          ) : (
            <button
              type="button"
              onClick={() => void handleSave()}
              className="w-full rounded-full bg-[#C8401A] px-4 py-2 text-sm font-medium text-white hover:bg-[#b03516] transition"
            >
              {t("saveSearch")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
