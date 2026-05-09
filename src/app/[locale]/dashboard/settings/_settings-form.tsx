"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

interface SettingsFormProps {
  locale: string;
  labels: {
    notificationsTitle: string;
    notificationsBody: string;
    emailOnInquiry: string;
    weeklyDigest: string;
    languagePreference: string;
    saveChanges: string;
  };
}

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
      className="flex items-center justify-between gap-4 cursor-pointer py-3 border-b border-gold/10 last:border-0"
    >
      <span className="text-sm text-parchment">{label}</span>
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
            "w-10 h-6 rounded-full transition-colors",
            checked ? "bg-terracotta" : "bg-mute",
          ].join(" ")}
        />
        <div
          className={[
            "absolute top-1 w-4 h-4 rounded-full bg-parchment shadow transition-transform",
            checked ? "ltr:translate-x-5 rtl:-translate-x-5" : "ltr:translate-x-1 rtl:-translate-x-1",
          ].join(" ")}
        />
      </div>
    </label>
  );
}

export default function SettingsForm({ locale, labels }: SettingsFormProps) {
  const [emailOnInquiry, setEmailOnInquiry] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [saved, setSaved] = useState(false);
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function flipLocale() {
    const next: Locale = currentLocale === "en" ? "ar" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    console.log("save-settings stub", { emailOnInquiry, weeklyDigest });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form
      onSubmit={handleSave}
      className="bg-earth-soft rounded-[var(--radius-card)] border border-gold/15 p-7 flex flex-col gap-6"
    >
      {/* Notifications */}
      <div>
        <h2 className="font-display text-xl text-parchment mb-1">
          {labels.notificationsTitle}
        </h2>
        <p className="text-sm text-mute-soft mb-5">{labels.notificationsBody}</p>

        <Toggle
          id="email-inquiry"
          label={labels.emailOnInquiry}
          checked={emailOnInquiry}
          onChange={setEmailOnInquiry}
        />
        <Toggle
          id="weekly-digest"
          label={labels.weeklyDigest}
          checked={weeklyDigest}
          onChange={setWeeklyDigest}
        />
      </div>

      {/* Language preference */}
      <div className="border-t border-gold/10 pt-6">
        <h3 className="text-sm font-semibold text-parchment mb-4">
          {labels.languagePreference}
        </h3>
        <div className="flex gap-3">
          {(["en", "ar"] as Locale[]).map((loc) => (
            <button
              key={loc}
              type="button"
              disabled={pending}
              onClick={flipLocale}
              className={[
                "px-5 py-2.5 rounded-[var(--radius-pill)] border text-sm font-medium transition-colors",
                currentLocale === loc
                  ? "border-gold bg-gold/10 text-parchment"
                  : "border-gold/20 text-mute-soft hover:border-gold/40 hover:text-parchment",
              ].join(" ")}
            >
              {loc === "en" ? "English" : "العربية"}
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          className="rounded-[var(--radius-pill)] bg-terracotta hover:bg-terracotta-deep text-parchment px-7 py-3 text-sm font-semibold transition-colors"
        >
          {labels.saveChanges}
        </button>
        {saved && (
          <span className="text-sm text-gold-bright animate-pulse">✓ Saved</span>
        )}
      </div>
    </form>
  );
}
