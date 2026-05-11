"use client";

import { useState, useTransition } from "react";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassTextarea } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import { AvatarUploader } from "./avatar-uploader";
import { CompletenessMeter } from "./completeness-meter";
import { updateProfile } from "../actions";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ProfileRow = {
  full_name: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  whatsapp_opt_in: boolean | null;
};

interface ProfileEditorProps {
  profile: ProfileRow;
  labels: {
    // Existing fields
    fullName: string;
    phone: string;
    phoneLabel: string;
    phonePrefix: string;
    whatsapp: string;
    city: string;
    role: string;
    roleTenant: string;
    roleLandlord: string;
    roleAgent: string;
    saveChanges: string;
    // New fields
    bio: string;
    bioPlaceholder: string;
    bioChars: string;
    avatarUpload: string;
    avatarDragDrop: string;
    avatarHint: string;
    avatarUploading: string;
    avatarError: string;
    whatsappOptIn: string;
    completenessTitle: string;
    completenessMissingAvatar: string;
    completenessMissingBio: string;
    completenessMissingPhone: string;
    completenessMissingName: string;
    completenessDone: string;
    saved: string;
    saving: string;
    saveError: string;
  };
}

// ── Completeness helpers ──────────────────────────────────────────────────────

function calcPct(profile: {
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
}): number {
  const checks = [
    !!profile.full_name,
    !!profile.phone,
    !!profile.avatar_url,
    !!profile.bio,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

// ── Toggle (reused from settings pattern) ────────────────────────────────────

function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-4 cursor-pointer"
    >
      <span className="text-sm text-ink">{label}</span>
      <div className="relative shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={[
            "smooth w-10 h-6 rounded-full",
            checked ? "bg-terracotta" : "bg-sand-dk/60",
          ].join(" ")}
        />
        <div
          className={[
            "smooth absolute top-1 w-4 h-4 rounded-full bg-cream shadow",
            checked
              ? "ltr:translate-x-5 rtl:-translate-x-5"
              : "ltr:translate-x-1 rtl:-translate-x-1",
          ].join(" ")}
        />
      </div>
    </label>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProfileEditor({ profile, labels }: ProfileEditorProps) {
  // Form state — initialised from server-fetched profile
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  // Strip +249 prefix for the input; we'll re-add it on save
  const [phone, setPhone] = useState(
    profile.phone?.startsWith("+249")
      ? profile.phone.slice(4)
      : (profile.phone ?? ""),
  );
  const [bio, setBio] = useState(profile.bio ?? "");
  const [whatsappOptIn, setWhatsappOptIn] = useState(
    profile.whatsapp_opt_in ?? false,
  );
  // Avatar URL is tracked independently so avatar upload can update it without
  // a full form re-render
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");

  const [toast, setToast] = useState<"saved" | "error" | null>(null);
  const [pending, startTransition] = useTransition();

  // ── Completeness (reactive to form state) ──────────────────────────────────

  const currentPct = calcPct({
    full_name: fullName || null,
    phone: phone || null,
    avatar_url: avatarUrl || null,
    bio: bio || null,
  });

  const missingItems: string[] = [];
  if (!fullName) missingItems.push(labels.completenessMissingName);
  if (!phone) missingItems.push(labels.completenessMissingPhone);
  if (!avatarUrl) missingItems.push(labels.completenessMissingAvatar);
  if (!bio) missingItems.push(labels.completenessMissingBio);

  // ── Initials for avatar fallback ───────────────────────────────────────────

  const initials = fullName
    ? fullName
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0] ?? "")
        .join("")
        .toUpperCase()
    : "?";

  // ── Save ───────────────────────────────────────────────────────────────────

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setToast(null);

    const fd = new FormData();
    fd.set("full_name", fullName);
    // Normalize phone: always store with +249 prefix
    const normalizedPhone = phone ? `+249${phone.replace(/^\+249/, "")}` : "";
    fd.set("phone", normalizedPhone);
    fd.set("bio", bio.slice(0, 280));
    fd.set("whatsapp_opt_in", String(whatsappOptIn));
    fd.set("avatar_url", avatarUrl);

    startTransition(async () => {
      try {
        const result = await updateProfile(fd);
        if (result.ok) {
          setToast("saved");
        } else {
          setToast("error");
        }
      } catch {
        setToast("error");
      }
      setTimeout(() => setToast(null), 3500);
    });
  }

  const BIO_MAX = 280;
  const bioRemaining = BIO_MAX - bio.length;

  return (
    <form
      onSubmit={handleSave}
      className="glass-warm glass-highlight rounded-[var(--radius-card)] border border-white/55 p-7 flex flex-col gap-7"
      style={{ boxShadow: "var(--shadow-glass)" }}
    >
      {/* ── Avatar ── */}
      <div className="flex flex-col items-center gap-1 pb-2 border-b border-white/30">
        <AvatarUploader
          avatarUrl={avatarUrl || null}
          initials={initials}
          onUploaded={(url) => setAvatarUrl(url)}
          labels={{
            upload: labels.avatarUpload,
            dragDrop: labels.avatarDragDrop,
            hint: labels.avatarHint,
            uploading: labels.avatarUploading,
            error: labels.avatarError,
          }}
        />
      </div>

      {/* ── Completeness meter ── */}
      <div className="pb-2 border-b border-white/30">
        <CompletenessMeter
          pct={currentPct}
          missing={missingItems}
          title={labels.completenessTitle}
          doneLabel={labels.completenessDone}
        />
      </div>

      {/* ── Full name ── */}
      <div className="flex flex-col gap-2">
        <label htmlFor="full-name" className="text-sm font-medium text-ink-soft">
          {labels.fullName}
        </label>
        <GlassInput
          id="full-name"
          type="text"
          tone="light"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
        />
      </div>

      {/* ── Phone with Sudan prefix ── */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="text-sm font-medium text-ink-soft">
          {labels.phoneLabel}
        </label>
        <div className="flex items-stretch gap-0">
          {/* Prefix pill */}
          <span className="smooth-fast inline-flex items-center rounded-l-xl border border-r-0 border-white/55 bg-white/40 px-3 py-2.5 text-sm text-ink-mid select-none backdrop-blur-md">
            {labels.phonePrefix}
          </span>
          <GlassInput
            id="phone"
            type="tel"
            tone="light"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/[^\d\s\-()]/g, ""))
            }
            className="rounded-l-none"
            placeholder="912 000 001"
            inputMode="tel"
            autoComplete="tel-national"
          />
        </div>
      </div>

      {/* ── Bio ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="bio" className="text-sm font-medium text-ink-soft">
            {labels.bio}
          </label>
          <span
            className={[
              "text-xs tabular-nums",
              bioRemaining < 20 ? "text-terracotta font-semibold" : "text-ink-mid",
            ].join(" ")}
          >
            {labels.bioChars.replace("{count}", String(bio.length))}
          </span>
        </div>
        <GlassTextarea
          id="bio"
          tone="light"
          rows={4}
          maxLength={BIO_MAX}
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
          placeholder={labels.bioPlaceholder}
        />
      </div>

      {/* ── WhatsApp opt-in ── */}
      <div className="py-1">
        <Toggle
          id="whatsapp-opt-in"
          label={labels.whatsappOptIn}
          checked={whatsappOptIn}
          onChange={setWhatsappOptIn}
        />
      </div>

      {/* ── Save button + toast ── */}
      <div className="flex items-center gap-4 pt-2 border-t border-white/30">
        <GlassButton
          type="submit"
          variant="terracotta"
          size="md"
          disabled={pending}
        >
          {pending ? labels.saving : labels.saveChanges}
        </GlassButton>

        {toast === "saved" && (
          <span className="text-sm text-gold-dk font-medium animate-pulse">
            ✓ {labels.saved}
          </span>
        )}
        {toast === "error" && (
          <span className="text-sm text-terracotta">{labels.saveError}</span>
        )}
      </div>
    </form>
  );
}
