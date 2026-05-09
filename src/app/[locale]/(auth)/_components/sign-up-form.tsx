"use client";

import { useActionState, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { signUp, type ActionResult } from "../actions";

const initialState: ActionResult = { error: null };

const ROLES = ["tenant", "landlord", "agent"] as const;
type RoleKey = "roleTenant" | "roleLandlord" | "roleAgent";

export default function SignUpForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [success, setSuccess] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (prevState: ActionResult, formData: FormData): Promise<ActionResult> => {
      formData.set("locale", locale);
      const result = await signUp(prevState, formData);
      if (!result.error) setSuccess(true);
      return result;
    },
    initialState,
  );

  const inputClass =
    "w-full rounded-md bg-earth border border-gold/20 px-4 py-3.5 text-base text-parchment placeholder:text-mute focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition";
  const labelClass = "block mb-2 text-xs uppercase tracking-wider text-gold/80";

  if (success) {
    return (
      <div className="rounded-md border border-gold/20 bg-gold/5 px-6 py-8 text-center">
        <p className="font-display text-xl text-parchment mb-2">{t("checkEmail")}</p>
        <p className="text-sm text-mute-soft">{t("magicLinkSent")}</p>
      </div>
    );
  }

  const roleKey = (r: string): RoleKey =>
    `role${r.charAt(0).toUpperCase()}${r.slice(1)}` as RoleKey;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Full name */}
      <div>
        <label htmlFor="signup-name" className={labelClass}>
          {t("fullName")}
        </label>
        <input
          id="signup-name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
          className={inputClass}
          placeholder="Ali Hassan"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="signup-email" className={labelClass}>
          {t("email")}
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="signup-password" className={labelClass}>
          {t("password")}
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={inputClass}
          placeholder="••••••••"
        />
        <p className="mt-1.5 text-xs text-mute-soft">{t("passwordMin")}</p>
      </div>

      {/* Role */}
      <div>
        <label htmlFor="signup-role" className={labelClass}>
          {t("role")}
        </label>
        <select
          id="signup-role"
          name="role"
          required
          defaultValue=""
          className="w-full rounded-md bg-earth border border-gold/20 px-4 py-3.5 text-base text-parchment focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
        >
          <option value="" disabled>
            —
          </option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {t(roleKey(r))}
            </option>
          ))}
        </select>
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-md border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-pill bg-terracotta py-3.5 text-base font-semibold text-parchment transition hover:bg-terracotta-deep disabled:opacity-60"
      >
        {pending && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-parchment/30 border-t-parchment" />
        )}
        {t("signUp")}
      </button>
    </form>
  );
}
