import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import GlassPanel from "@/components/glass-panel";
import MessageThread from "./_components/message-thread";
import MessageComposer from "./_components/message-composer";
import { markRead } from "../actions";
import type { Message } from "./_components/types";

interface ThreadPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function InquiryThreadPage({ params }: ThreadPageProps) {
  const { locale, id: inquiryId } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("chat");

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/sign-in?next=/${locale}/dashboard/inquiries`);

  // Verify participation before fetching anything else
  const { data: isParticipant } = await supabase.rpc(
    "is_inquiry_participant",
    { _inquiry_id: inquiryId, _user_id: user.id },
  );

  if (!isParticipant) {
    redirect(`/${locale}/dashboard/inquiries`);
  }

  // Fetch inquiry + listing + first photo in one joined query
  const { data: inquiry } = await supabase
    .from("inquiries")
    .select(
      `
      id,
      inquirer_id,
      inquirer_name,
      message,
      created_at,
      listings!inner(
        id,
        title_en,
        title_ar,
        owner_id,
        listing_photos(url, position)
      )
    `,
    )
    .eq("id", inquiryId)
    .maybeSingle();

  if (!inquiry) redirect(`/${locale}/dashboard/inquiries`);

  const listing = (inquiry.listings as unknown) as {
    id: string;
    title_en: string | null;
    title_ar: string | null;
    owner_id: string;
    listing_photos: Array<{ url: string | null; position: number }>;
  } | null;

  const listingTitle =
    locale === "ar"
      ? (listing?.title_ar ?? listing?.title_en ?? "")
      : (listing?.title_en ?? "");

  // Determine counterparty
  const isOwner = listing?.owner_id === user.id;
  const counterpartyId = isOwner
    ? (inquiry.inquirer_id as string)
    : (listing?.owner_id ?? "");

  // Fetch counterparty profile
  const { data: counterpartyProfile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", counterpartyId)
    .maybeSingle();

  const counterpartyName =
    (counterpartyProfile?.full_name as string | null) ??
    (isOwner ? (inquiry.inquirer_name as string | null) : null) ??
    (locale === "ar" ? "مستخدم" : "User");

  // First listing photo (sorted by position)
  const sortedPhotos = (listing?.listing_photos ?? []).sort(
    (a, b) => a.position - b.position,
  );
  const thumbUrl = sortedPhotos[0]?.url ?? null;

  // Fetch initial messages (last 50)
  const { data: rawMessages } = await supabase
    .from("messages")
    .select("id, inquiry_id, sender_id, body, attachments, read_at, created_at")
    .eq("inquiry_id", inquiryId)
    .order("created_at", { ascending: true })
    .limit(50);

  const initialMessages: Message[] = (rawMessages ?? []).map((m) => ({
    id: m.id as string,
    inquiry_id: m.inquiry_id as string,
    sender_id: m.sender_id as string,
    body: m.body as string | null,
    attachments: (m.attachments as string[]) ?? [],
    read_at: m.read_at as string | null,
    created_at: m.created_at as string,
  }));

  // Mark counterparty messages as read (server-side, non-blocking)
  await markRead(inquiryId);

  const composerLabels = {
    typeMessage: t("typeMessage"),
    send: t("send"),
    sending: t("sending"),
    error: t("error"),
    attachPhoto: t("attachPhoto"),
    attaching: t("attaching"),
    removeAttachment: t("removeAttachment"),
  };

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto flex flex-col gap-6">
      {/* Back link */}
      <Link
        href={`/${locale}/dashboard/inquiries`}
        className="text-xs text-ink-mid hover:text-terracotta transition-colors flex items-center gap-1.5 w-fit"
      >
        <span aria-hidden>←</span>
        {t("backToInbox")}
      </Link>

      {/* Thread header */}
      <GlassPanel variant="warm" className="p-5">
        <div className="flex items-center gap-4">
          {/* Listing thumbnail */}
          {thumbUrl ? (
            <div className="flex-none w-14 h-14 rounded-xl overflow-hidden border border-white/40">
              <Image
                src={thumbUrl}
                alt={listingTitle}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex-none w-14 h-14 rounded-xl border border-white/40 bg-white/30 flex items-center justify-center text-ink-mid/40">
              <svg
                aria-hidden
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-gold-dk font-semibold mb-0.5">
              {t("threadHeader")}
            </p>
            <p className="font-display text-lg text-ink truncate">
              {counterpartyName}
            </p>
            {listing?.id && (
              <Link
                href={`/${locale}/listings/${listing.id}`}
                className="text-xs text-ink-mid hover:text-terracotta transition-colors truncate block mt-0.5"
              >
                {listingTitle} ↗
              </Link>
            )}
          </div>
        </div>
      </GlassPanel>

      {/* Message thread */}
      <GlassPanel variant="warm" className="min-h-[360px] overflow-y-auto max-h-[60vh] px-4">
        <MessageThread
          inquiryId={inquiryId}
          currentUserId={user.id}
          initialMessages={initialMessages}
          counterparty={{ id: counterpartyId, name: counterpartyName }}
          locale={locale}
          noMessagesLabel={t("noMessagesYet")}
        />
      </GlassPanel>

      {/* Composer */}
      <GlassPanel variant="warm" className="p-4">
        <MessageComposer
          inquiryId={inquiryId}
          currentUserId={user.id}
          labels={composerLabels}
        />
      </GlassPanel>
    </div>
  );
}
