"use client";

import { useRef, useState, useEffect, useId, useCallback } from "react";
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
  const uid = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  const openDialog = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
    setStatus("idle");
    triggerRef.current?.focus();
  }, []);

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
      {/* Trigger element — use a button wrapper that can receive ref for focus return */}
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        className="contents"
        aria-haspopup="dialog"
      >
        {children}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${uid}-title`}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeDialog();
        }}
        className="m-auto max-w-md w-full rounded-2xl border border-white/40 bg-[#FDF8F0] p-0 shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <h2 id={`${uid}-title`} className="font-display text-xl text-[#12100C]">{t("modalTitle")}</h2>

          {status === "sent" ? (
            <>
              <p role="status" className="text-sm text-green-700">{t("sent")}</p>
              <div className="flex justify-end rtl:justify-start">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-full bg-[#C8401A] px-4 py-2 text-sm font-medium text-white"
                >
                  {t("close")}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-name`} className="text-xs font-medium text-[#12100C]/60 uppercase tracking-wide">
                  {t("name")}
                </label>
                <GlassInput
                  id={`${uid}-name`}
                  tone="light"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("name")}
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-phone`} className="text-xs font-medium text-[#12100C]/60 uppercase tracking-wide">
                  {t("phone")}
                </label>
                <GlassInput
                  id={`${uid}-phone`}
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
                <label htmlFor={`${uid}-date`} className="text-xs font-medium text-[#12100C]/60 uppercase tracking-wide">
                  {t("date")}
                </label>
                <GlassInput
                  id={`${uid}-date`}
                  tone="light"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* Time slot */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`${uid}-time`} className="text-xs font-medium text-[#12100C]/60 uppercase tracking-wide">
                  {t("time")}
                </label>
                <select
                  id={`${uid}-time`}
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
                <p role="alert" className="text-xs text-red-600">{t("errorGeneric")}</p>
              )}

              <div className="flex justify-end gap-2 rtl:justify-start">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-full border border-[#12100C]/15 px-4 py-2 text-sm text-[#12100C]/60 hover:bg-[#12100C]/5 transition"
                >
                  {t("cancel")}
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
