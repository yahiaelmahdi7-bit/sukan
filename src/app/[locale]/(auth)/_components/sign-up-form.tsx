"use client";

import { useActionState, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassSelect } from "@/components/ui/glass-select";
import { GlassButton } from "@/components/ui/glass-button";
import GlassPanel from "@/components/glass-panel";
import { signUp, type ActionResult } from "../actions";

const initialState: ActionResult = { error: null };

const ROLES = ["tenant", "landlord", "agent"] as const;
type RoleKey = "roleTenant" | "roleLandlord" | "roleAgent";

const labelClass =
  "block mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-dk";

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream"
    />
  );
}

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

  if (success) {
    return (
      <GlassPanel variant="warm" radius="glass" shadow={false} highlight={false} className="px-6 py-8 text-center">
        <p className="font-display text-xl text-ink mb-2">{t("checkEmail")}</p>
        <p className="text-sm text-ink-mid">{t("magicLinkSent")}</p>
      </GlassPanel>
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
        <GlassInput
          id="signup-name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
          tone="light"
          placeholder="Ali Hassan"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="signup-email" className={labelClass}>
          {t("email")}
        </label>
        <GlassInput
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          tone="light"
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="signup-password" className={labelClass}>
          {t("password")}
        </label>
        <GlassInput
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          tone="light"
          placeholder="••••••••"
        />
        <p className="mt-1.5 text-xs text-ink-mid">{t("passwordMin")}</p>
      </div>

      {/* Role */}
      <div>
        <label htmlFor="signup-role" className={labelClass}>
          {t("role")}
        </label>
        <GlassSelect
          id="signup-role"
          name="role"
          required
          defaultValue=""
          tone="light"
        >
          <option value="" disabled>
            —
          </option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {t(roleKey(r))}
            </option>
          ))}
        </GlassSelect>
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-[var(--radius-glass)] border border-terracotta/20 bg-terracotta/8 px-4 py-2.5 text-sm text-terracotta-deep"
        >
          {state.error}
        </p>
      )}

      <GlassButton
        type="submit"
        variant="terracotta"
        size="lg"
        full
        disabled={pending}
        leading={pending ? <Spinner /> : undefined}
      >
        {t("signUp")}
      </GlassButton>
    </form>
  );
}
