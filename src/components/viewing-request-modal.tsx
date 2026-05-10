"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { GlassInput } from "@/components/ui/glass-input";
import { createClient } from "@/lib/supabase/client";

const TIME_SLOTS = ["morning", "afternoon", "evening"] as const;
type TimeSlot = (typeof TIME_SLOTS)[number];

interface ViewingRequestModalProps {
  listingId: string;
  ownerWhatsApp: string | null;
  children: React.ReactNode;
}

export function ViewingRequestModal({
  listingId,
  ownerWhatsApp: _ownerWhatsApp,
  children,
}: ViewingRequestModalProps) {
  const t = useTranslations("viewings");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState<TimeSlot>("morning");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  // Pre-fill name/phone from current Supabase user if available
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      // user.user_metadata may contain name/phone from sign-up
      const meta = user.user_metadata as Record<string, string> | undefined;
      if (meta?.full_name && !name) setName(meta.full_name);
      if (meta?.phone && !phone) setPhone(meta.phone);
    });
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
    setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/viewings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listingId,
          requester_name: name,
          requester_phone: phone,
          preferred_date: date || undefined,
          preferred_time: timeSlot,
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      setStatus(json.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* Trigger element passed as children */}
      <span onClick={openDialog} style={{ cursor: "pointer", display: "contents" }}>
        {children}
      </span>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeDialog();
        }}
        className="m-auto max-w-md w-full rounded-2xl border border-white/40 bg-[#FDF8F0] p-0 shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <h2 className="font-display text-xl text-[#12100C]">{t("modalTitle")}</h2>

          {status === "sent" ? (
            <>
              <p className="text-sm text-green-700">{t("sent")}</p>
              <div className="flex justify-end rtl:justify-start">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-full bg-[#C8401A] px-4 py-2 text-sm font-medium text-white"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#12100C]/60 uppercase tracking-wide">
                  {t("name")}
                </label>
                <GlassInput
                  tone="light"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("name")}
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#12100C]/60 uppercase tracking-wide">
                  {t("phone")}
                </label>
                <GlassInput
                  tone="light"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+249…"
                />
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#12100C]/60 uppercase tracking-wide">
                  {t("date")}
                </label>
                <GlassInput
                  tone="light"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* Time slot */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#12100C]/60 uppercase tracking-wide">
                  {t("time")}
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
                  className="smooth-fast w-full rounded-xl border border-white/55 bg-white/55 px-3.5 py-2.5 text-sm backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#C8873A]/20"
                >
                  {TIME_SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {t(`slot${s.charAt(0).toUpperCase() + s.slice(1)}` as Parameters<typeof t>[0])}
                    </option>
                  ))}
                </select>
              </div>

              {status === "error" && (
                <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
              )}

              <div className="flex justify-end gap-2 rtl:justify-start">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-full border border-[#12100C]/15 px-4 py-2 text-sm text-[#12100C]/60 hover:bg-[#12100C]/5 transition"
                >
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
        </form>
      </dialog>
    </>
  );
}
