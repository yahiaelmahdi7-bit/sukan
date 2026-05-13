'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export type ActionResult = { error: string | null };

// ─── Sign In ─────────────────────────────────────────────────────────────────

export async function signIn(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

// ─── Sign Up ─────────────────────────────────────────────────────────────────

export async function signUp(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;
  const role = formData.get('role') as string;
  const locale = (formData.get('locale') as string) ?? 'en';

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
      emailRedirectTo: `${SITE_URL}/auth/callback?next=/${locale}/dashboard`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Insert profile row if we got a user back (email-confirmation flow returns
  // a user with `identities` length 0 when the email is a duplicate).
  if (data.user) {
    try {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName || null,
        role: role || null,
        preferred_locale: locale,
      });
    } catch (profileErr) {
      // Non-fatal: user can complete profile later.
      console.error('[sign-up] profiles insert failed:', profileErr);
    }
  }

  // Email confirmation is required — signal success with no error.
  return { error: null };
}

// ─── Sign Out ────────────────────────────────────────────────────────────────

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

// ─── Request Password Reset ──────────────────────────────────────────────────

export async function requestPasswordReset(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const locale = (formData.get('locale') as string) ?? 'en';

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/callback?next=/${locale}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

// ─── Reset Password (set new password after token exchange) ──────────────────

export async function resetPassword(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const password = formData.get('password') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

// ─── Magic Link ──────────────────────────────────────────────────────────────

export async function signInWithMagicLink(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const locale = (formData.get('locale') as string) ?? 'en';

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${SITE_URL}/auth/callback?next=/${locale}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
