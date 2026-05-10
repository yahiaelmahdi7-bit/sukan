"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SendMessageResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type GetOrCreateInquiryResult =
  | { ok: true; inquiryId: string }
  | { ok: false; error: string };

// ─── sendMessage ──────────────────────────────────────────────────────────────

/**
 * Inserts a new message row for the given inquiry.
 * Validates: user must be authenticated and a participant; body or attachments
 * must be present.
 */
export async function sendMessage(
  inquiryId: string,
  body: string,
  attachments: string[],
): Promise<SendMessageResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Not authenticated" };

    const trimmedBody = body.trim();
    if (!trimmedBody && attachments.length === 0) {
      return { ok: false, error: "Message or attachment required" };
    }

    // Verify participation — the RLS policy enforces this on INSERT too, but
    // we check early to surface a friendly error rather than a generic DB error.
    const { data: isParticipant } = await supabase.rpc(
      "is_inquiry_participant",
      { _inquiry_id: inquiryId, _user_id: user.id },
    );
    if (!isParticipant) {
      return { ok: false, error: "Not a participant of this inquiry" };
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        inquiry_id: inquiryId,
        sender_id: user.id,
        body: trimmedBody || null,
        attachments: attachments.length > 0 ? attachments : [],
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[sendMessage] insert failed:", error?.message);
      return { ok: false, error: "Failed to send message" };
    }

    revalidatePath(`/[locale]/dashboard/inquiries/${inquiryId}`, "page");
    return { ok: true, id: data.id as string };
  } catch (err) {
    console.error("[sendMessage] unexpected error:", err);
    return { ok: false, error: "Failed to send message" };
  }
}

// ─── markRead ─────────────────────────────────────────────────────────────────

/**
 * Marks all counterparty messages in this inquiry as read.
 * Failure-safe — errors are swallowed.
 */
export async function markRead(inquiryId: string): Promise<void> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("inquiry_id", inquiryId)
      .neq("sender_id", user.id)
      .is("read_at", null);
  } catch {
    // Non-fatal — silently ignore
  }
}

// ─── getOrCreateInquiry ───────────────────────────────────────────────────────

/**
 * Returns the existing inquiry id if the current user already has one for this
 * listing, or creates a new one and returns its id. Optionally seeds the first
 * message.
 */
export async function getOrCreateInquiry(
  listingId: string,
  initialMessage?: string,
): Promise<GetOrCreateInquiryResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "Not authenticated" };

    // Check for existing inquiry
    const { data: existing } = await supabase
      .from("inquiries")
      .select("id")
      .eq("listing_id", listingId)
      .eq("inquirer_id", user.id)
      .maybeSingle();

    if (existing?.id) {
      return { ok: true, inquiryId: existing.id as string };
    }

    // Get user display name from metadata
    const meta = user.user_metadata as { full_name?: string } | undefined;
    const inquirerName = meta?.full_name?.trim() || user.email || "User";

    // Create new inquiry
    const { data: newInquiry, error: createError } = await supabase
      .from("inquiries")
      .insert({
        listing_id: listingId,
        inquirer_id: user.id,
        inquirer_name: inquirerName,
        channel: "message",
        message: initialMessage ?? null,
      })
      .select("id")
      .single();

    if (createError || !newInquiry) {
      console.error("[getOrCreateInquiry] create failed:", createError?.message);
      return { ok: false, error: "Could not create inquiry" };
    }

    const inquiryId = newInquiry.id as string;

    // Seed initial message if provided
    if (initialMessage?.trim()) {
      await sendMessage(inquiryId, initialMessage.trim(), []);
    }

    revalidatePath("/[locale]/dashboard/inquiries", "page");
    return { ok: true, inquiryId };
  } catch (err) {
    console.error("[getOrCreateInquiry] unexpected error:", err);
    return { ok: false, error: "Could not create inquiry" };
  }
}
