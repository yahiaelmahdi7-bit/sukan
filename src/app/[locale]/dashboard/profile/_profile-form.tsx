"use client";

import { useState } from "react";
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
      <label htmlFor={id} className="text-sm font-medium text-parchment">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[10px] border border-gold/20 bg-earth px-4 py-3 text-sm text-parchment placeholder:text-mute-soft focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
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
      className="bg-earth-soft rounded-[var(--radius-card)] border border-gold/15 p-7 flex flex-col gap-6"
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

      {/* Role select */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-parchment">{labels.role}</span>
        <div className="flex flex-wrap gap-3">
          {roleOptions.map((opt) => (
            <label
              key={opt.value}
              className={[
                "flex items-center gap-2 cursor-pointer rounded-[10px] border px-4 py-2.5 text-sm transition-colors",
                role === opt.value
                  ? "border-gold/50 bg-gold/10 text-parchment"
                  : "border-gold/15 text-mute-soft hover:border-gold/30 hover:text-parchment",
              ].join(" ")}
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
        <button
          type="submit"
          className="rounded-[var(--radius-pill)] bg-terracotta hover:bg-terracotta-deep text-parchment px-7 py-3 text-sm font-semibold transition-colors"
        >
          {labels.saveChanges}
        </button>
        {saved && (
          <span className="text-sm text-gold-bright animate-pulse">
            ✓ Saved
          </span>
        )}
      </div>
    </form>
  );
}
