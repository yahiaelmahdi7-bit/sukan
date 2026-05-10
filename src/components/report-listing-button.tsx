"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { GlassTextarea } from "@/components/ui/glass-input";

const REASONS = ["scam", "wrong_info", "duplicate", "offensive", "other"] as const;
type Reason = (typeof REASONS)[number];

interface ReportListingButtonProps {
  listingId: string;
}

export function ReportListingButton({ listingId }: ReportListingButtonProps) {
  const t = useTranslations("report");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState<Reason>("scam");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
    setStatus("idle");
    setDetails("");
    setReason("scam");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, reason, details: details || undefined }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };

      if (json.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="text-xs text-[#12100C]/40 underline-offset-2 hover:text-[#C8401A] hover:underline transition smooth-fast"
      >
        {t("reportListing")}
      </button>

      {/* Native <dialog> for accessibility — works without a portal */}
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          // Close when clicking the backdrop
          if (e.target === dialogRef.current) closeDialog();
        }}
        className="m-auto max-w-md w-full rounded-2xl border border-white/40 bg-[#FDF8F0] p-0 shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <h2 className="font-display text-xl text-[#12100C]">{t("reportListing")}</h2>

          {status === "sent" ? (
            <p className="text-sm text-green-700">{t("sent")}</p>
          ) : (
            <>
              {/* Reason */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#12100C]/60 uppercase tracking-wide">
                  {t("reasonLabel")}
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as Reason)}
                  required
                  className="smooth-fast w-full rounded-xl border border-white/55 bg-white/55 px-3.5 py-2.5 text-sm backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#C8873A]/20"
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>
                      {t(`reason${r.charAt(0).toUpperCase() + r.slice(1).replace("_", "")}` as Parameters<typeof t>[0])}
                    </option>
                  ))}
                </select>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#12100C]/60 uppercase tracking-wide">
                  {t("detailsLabel")}
                </label>
                <GlassTextarea
                  tone="light"
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="…"
                />
              </div>

              {status === "error" && (
                <p className="text-xs text-red-600">{t("error")}</p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-full border border-[#12100C]/15 px-4 py-2 text-sm text-[#12100C]/60 hover:bg-[#12100C]/5 transition"
                >
                  {/* generic cancel label — already in common namespace */}
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-full bg-[#C8401A] px-4 py-2 text-sm font-medium text-white hover:bg-[#b03516] transition disabled:opacity-50"
                >
                  {t("submit")}
                </button>
              </div>
            </>
          )}

          {status === "sent" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeDialog}
                className="rounded-full bg-[#C8401A] px-4 py-2 text-sm font-medium text-white"
              >
                Close
              </button>
            </div>
          )}
        </form>
      </dialog>
    </>
  );
}
