"use client";

import { useActionState, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import GlassPanel from "@/components/glass-panel";
import { requestPasswordReset, type ActionResult } from "../actions";

const initialState: ActionResult = { error: null };

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

export default function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [sent, setSent] = useState(false);

  const [state, formAction, pending] = useActionState(
    async (prevState: ActionResult, formData: FormData): Promise<ActionResult> => {
      formData.set("locale", locale);
      const result = await requestPasswordReset(prevState, formData);
      if (!result.error) setSent(true);
      return result;
    },
    initialState,
  );

  if (sent) {
    return (
      <GlassPanel variant="warm" radius="glass" shadow={false} highlight={false} className="px-6 py-8 text-center">
        <p className="font-display text-xl text-ink mb-2">{t("checkEmail")}</p>
        <p className="text-sm text-ink-mid">{t("passwordResetSent")}</p>
      </GlassPanel>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="forgot-email" className={labelClass}>
          {t("email")}
        </label>
        <GlassInput
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          tone="light"
          placeholder="you@example.com"
        />
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
        {t("forgotPassword")}
      </GlassButton>
    </form>
  );
}
