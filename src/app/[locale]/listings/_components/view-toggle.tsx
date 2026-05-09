"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export default function ViewToggle() {
  const t = useTranslations("browse");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") ?? "list";

  function switchView(view: "list" | "map") {
    const p = new URLSearchParams(searchParams.toString());
    if (view === "list") {
      p.delete("view");
    } else {
      p.set("view", view);
    }
    p.delete("page");
    router.push(
      (p.size > 0 ? `${pathname}?${p.toString()}` : pathname) as Parameters<
        typeof router.push
      >[0],
    );
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-gold/15 bg-earth p-0.5"
      role="group"
      aria-label="View mode"
    >
      {/* List button */}
      <button
        type="button"
        onClick={() => switchView("list")}
        aria-pressed={currentView === "list"}
        title={t("viewList")}
        className={`flex h-7 w-8 items-center justify-center rounded-md transition ${
          currentView === "list"
            ? "bg-gold/20 text-gold"
            : "text-mute-soft hover:text-parchment"
        }`}
      >
        {/* Grid/list icon */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
        <span className="sr-only">{t("viewList")}</span>
      </button>

      {/* Map button */}
      <button
        type="button"
        onClick={() => switchView("map")}
        aria-pressed={currentView === "map"}
        title={t("viewMap")}
        className={`flex h-7 w-8 items-center justify-center rounded-md transition ${
          currentView === "map"
            ? "bg-gold/20 text-gold"
            : "text-mute-soft hover:text-parchment"
        }`}
      >
        {/* Map icon */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <path d="M5.5 2L1 4v10l4.5-2L10.5 14l4.5-2V2l-4.5 2L5.5 2z" />
          <line x1="5.5" y1="2" x2="5.5" y2="12" />
          <line x1="10.5" y1="4" x2="10.5" y2="14" />
        </svg>
        <span className="sr-only">{t("viewMap")}</span>
      </button>
    </div>
  );
}
