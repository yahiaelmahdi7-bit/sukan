"use client";

import { useState } from "react";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import type { MockUser } from "../_data/mock-user";

interface ProfileFormProps {
  user: MockUser;
  locale: string;
  labels: {
    fullName: string;
    phone: string;
    whatsapp: string;
    city: string;
    role: string;
    roleTenant: string;
    roleLandlord: string;
    roleAgent: string;
    saveChanges: string;
  };
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <GlassInput
        id={id}
        type={type}
        tone="light"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function ProfileForm({ user, locale, labels }: ProfileFormProps) {
  const [fullName, setFullName] = useState(
    locale === "ar" ? user.full_name_ar : user.full_name_en
  );
  const [phone, setPhone] = useState(user.phone);
  const [whatsapp, setWhatsapp] = useState(user.whatsapp);
  const [city, setCity] = useState(
    locale === "ar" ? user.city_ar : user.city_en
  );
  const [role, setRole] = useState(user.role);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    console.log("save-profile stub", { fullName, phone, whatsapp, city, role });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const roleOptions: { value: MockUser["role"]; label: string }[] = [
    { value: "tenant", label: labels.roleTenant },
    { value: "landlord", label: labels.roleLandlord },
    { value: "agent", label: labels.roleAgent },
  ];

  return (
    <form
      onSubmit={handleSave}
      className="glass-warm glass-highlight rounded-[var(--radius-card)] border border-white/55 p-7 flex flex-col gap-6"
      style={{ boxShadow: "var(--shadow-glass)" }}
    >
      <Field
        id="full-name"
        label={labels.fullName}
        value={fullName}
        onChange={setFullName}
      />
      <Field
        id="phone"
        label={labels.phone}
        value={phone}
        onChange={setPhone}
        type="tel"
      />
      <Field
        id="whatsapp"
        label={labels.whatsapp}
        value={whatsapp}
        onChange={setWhatsapp}
        type="tel"
      />
      <Field id="city" label={labels.city} value={city} onChange={setCity} />

      {/* Role select — glass pill radio group */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink-soft">{labels.role}</span>
        <div className="flex flex-wrap gap-3">
          {roleOptions.map((opt) => (
            <label
              key={opt.value}
              className={[
                "smooth-fast flex items-center gap-2 cursor-pointer rounded-[var(--radius-pill)] border px-4 py-2.5 text-sm",
                role === opt.value
                  ? "border-white/70 bg-white/70 text-ink backdrop-blur-sm"
                  : "border-white/55 bg-white/40 text-ink-mid hover:border-gold/40 hover:text-ink backdrop-blur-sm",
              ].join(" ")}
              style={
                role === opt.value
                  ? { boxShadow: "var(--shadow-gold-glow)" }
                  : undefined
              }
            >
              <input
                type="radio"
                name="role"
                value={opt.value}
                checked={role === opt.value}
                onChange={() => setRole(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Save button + toast */}
      <div className="flex items-center gap-4 pt-2">
        <GlassButton type="submit" variant="terracotta" size="md">
          {labels.saveChanges}
        </GlassButton>
        {saved && (
          <span className="text-sm text-gold animate-pulse">
            ✓ Saved
          </span>
        )}
      </div>
    </form>
  );
}
