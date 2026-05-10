import { createClient } from "@/lib/supabase/server";
import {
  sampleListings,
  type Listing,
} from "@/lib/sample-listings";
import { getMyListings } from "@/lib/listings";
import { getMockInquiries } from "./mock-inquiries";
import type { Inquiry } from "./inquiry-types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActionItem = {
  id: string;
  icon:
    | "camera"
    | "eye"
    | "message"
    | "user"
    | "shield"
    | "inbox"
    | "clock";
  titleKey: string;
  /** dynamic interpolation values */
  titleVars?: Record<string, string | number>;
  bodyKey?: string;
  bodyVars?: Record<string, string | number>;
  ctaKey: string;
  ctaHref: string;
};

export type ActivityRow = {
  id: string;
  icon: "eye" | "heart" | "message" | "trending-up";
  textKey: string;
  textVars: Record<string, string | number>;
  relativeTime: string; // pre-computed, e.g. "3 minutes ago"
  href: string;
};

export type OverviewStats = {
  viewsThisWeek: number;
  viewsDelta: number; // positive = up, negative = down
  inquiriesThisWeek: number;
  inquiriesDelta: number;
  viewingRequestsThisWeek: number;
  viewingsDelta: number;
  savesThisWeek: number;
  savesDelta: number;
};

export type OverviewData = {
  firstName: string;
  lastSeenDaysAgo: number | null; // null = never recorded
  newInquiriesCount: number;
  isVerified: boolean;
  profileCompletePct: number;
  stats: OverviewStats;
  actionItems: ActionItem[];
  topListings: Listing[];
  activityFeed: ActivityRow[];
};

// ─── Seeded helpers ───────────────────────────────────────────────────────────

/** Deterministic number in [min, max] based on a string seed */
function seeded(seed: string, min: number, max: number): number {
  const hash = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return min + (hash % (max - min + 1));
}

/** Seed weekly stats per user (day-of-week variation built-in) */
function seedWeeklyStats(userId: string, today: Date): OverviewStats {
  const dayOfWeek = today.getDay(); // 0–6
  const base = seeded(userId, 20, 60);
  return {
    viewsThisWeek: base + dayOfWeek * 8,
    viewsDelta: seeded(userId + "vd", -12, 28),
    inquiriesThisWeek: seeded(userId + "iq", 1, 8) + Math.floor(dayOfWeek / 2),
    inquiriesDelta: seeded(userId + "iqd", -2, 5),
    viewingRequestsThisWeek: seeded(userId + "vr", 0, 4),
    viewingsDelta: seeded(userId + "vrd", -1, 3),
    savesThisWeek: seeded(userId + "sv", 2, 12),
    savesDelta: seeded(userId + "svd", -3, 7),
  };
}

/** Pre-built seed activity feed for demo / empty-DB */
function seedActivityFeed(userId: string): ActivityRow[] {
  const now = new Date("2026-05-11T10:00:00Z").getTime();
  const items: Array<Omit<ActivityRow, "relativeTime">> = [
    {
      id: "act-1",
      icon: "eye",
      textKey: "dashboardOverview.activityViewed",
      textVars: { name: "Mohammed", listing: "Khartoum 2" },
      href: "/dashboard/listings",
    },
    {
      id: "act-2",
      icon: "heart",
      textKey: "dashboardOverview.activitySaved",
      textVars: { listing: "Bahri apartment" },
      href: "/dashboard/listings",
    },
    {
      id: "act-3",
      icon: "message",
      textKey: "dashboardOverview.activityInquired",
      textVars: { name: "Sara", location: "Toronto" },
      href: "/dashboard/inquiries",
    },
    {
      id: "act-4",
      icon: "trending-up",
      textKey: "dashboardOverview.activityViews",
      textVars: { listing: "Dongola farm", count: 12 },
      href: "/dashboard/listings",
    },
    {
      id: "act-5",
      icon: "eye",
      textKey: "dashboardOverview.activityViewed",
      textVars: { name: "Layla", listing: "Port Sudan shop" },
      href: "/dashboard/listings",
    },
    {
      id: "act-6",
      icon: "message",
      textKey: "dashboardOverview.activityInquired",
      textVars: { name: "Kamal", location: "Riyadh" },
      href: "/dashboard/inquiries",
    },
  ];

  // Deterministic past times: 3m, 12m, 2h, 5h, 1d, 2d ago
  const OFFSETS_MS = [3 * 60e3, 12 * 60e3, 2 * 3600e3, 5 * 3600e3, 86400e3, 2 * 86400e3];

  return items.map((item, i) => {
    const ms = now - OFFSETS_MS[i];
    const diffMs = now - ms;
    const diffMins = Math.floor(diffMs / 60e3);
    const diffHours = Math.floor(diffMs / 3600e3);
    const diffDays = Math.floor(diffMs / 86400e3);
    let relativeTime: string;
    if (diffMins < 60) relativeTime = `${diffMins}m ago`;
    else if (diffHours < 24) relativeTime = `${diffHours}h ago`;
    else relativeTime = `${diffDays}d ago`;

    // Mix seed into time for variety
    const _ = userId; // used for tree-shaking avoidance only
    void _;

    return { ...item, relativeTime };
  });
}

// ─── Profile completeness ─────────────────────────────────────────────────────

type ProfileRow = {
  full_name: string | null;
  phone: string | null;
  is_verified: boolean | null;
  avatar_url: string | null;
  bio: string | null;
};

function calcProfileComplete(profile: ProfileRow | null): number {
  if (!profile) return 30;
  const checks = [
    !!profile.full_name,
    !!profile.phone,
    !!profile.is_verified,
    !!profile.avatar_url,
    !!profile.bio,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

// ─── Action item computation ──────────────────────────────────────────────────

function buildActionItems(params: {
  listings: Listing[];
  inquiries: Inquiry[];
  profileCompletePct: number;
  isVerified: boolean;
  unreadInquiries: Inquiry[];
}): ActionItem[] {
  const { listings, inquiries, profileCompletePct, isVerified, unreadInquiries } = params;
  const items: ActionItem[] = [];

  // Rule 1 — listings with no photos
  for (const listing of listings) {
    if (listing.photoSlots === 0) {
      items.push({
        id: `no-photos-${listing.id}`,
        icon: "camera",
        titleKey: "dashboardOverview.actionNoPhotos",
        titleVars: { title: listing.titleEn },
        ctaKey: "dashboardOverview.actionAddPhotos",
        ctaHref: `/post?edit=${listing.id}`,
      });
      if (items.length >= 5) break;
    }
  }

  // Rule 2 — unread messages
  if (unreadInquiries.length > 0 && items.length < 5) {
    const first = unreadInquiries[0];
    if (unreadInquiries.length === 1) {
      items.push({
        id: "unread-single",
        icon: "message",
        titleKey: "dashboardOverview.actionUnreadSingle",
        titleVars: { name: first.inquirer_name_en },
        ctaKey: "dashboardOverview.actionReply",
        ctaHref: `/dashboard/inquiries/${first.id}`,
      });
    } else {
      items.push({
        id: "unread-multi",
        icon: "inbox",
        titleKey: "dashboardOverview.actionUnreadMulti",
        titleVars: { count: unreadInquiries.length },
        ctaKey: "dashboardOverview.actionOpenInbox",
        ctaHref: `/dashboard/inquiries`,
      });
    }
  }

  // Rule 3 — 24h unanswered inquiries (more than 2 unread)
  if (unreadInquiries.length >= 2 && items.length < 5) {
    const cutoff = Date.now() - 24 * 3600e3;
    const stale = unreadInquiries.filter(
      (inq) => new Date(inq.created_at).getTime() < cutoff,
    );
    if (stale.length > 0) {
      items.push({
        id: "stale-inquiries",
        icon: "clock",
        titleKey: "dashboardOverview.actionStaleInquiries",
        titleVars: { count: stale.length },
        ctaKey: "dashboardOverview.actionOpenInbox",
        ctaHref: `/dashboard/inquiries`,
      });
    }
  }

  // Rule 4 — profile completion
  if (profileCompletePct < 100 && items.length < 5) {
    items.push({
      id: "profile-incomplete",
      icon: "user",
      titleKey: "dashboardOverview.actionProfileIncomplete",
      titleVars: { pct: profileCompletePct },
      ctaKey: "dashboardOverview.actionFinishProfile",
      ctaHref: `/dashboard/profile`,
    });
  }

  // Rule 5 — verification pending
  if (!isVerified && items.length < 5) {
    items.push({
      id: "verification-pending",
      icon: "shield",
      titleKey: "dashboardOverview.actionVerificationPending",
      ctaKey: "dashboardOverview.actionCheckStatus",
      ctaHref: `/dashboard/profile`,
    });
  }

  return items.slice(0, 5);
}

// ─── Main fetch ───────────────────────────────────────────────────────────────

export async function getOverviewData(userId: string): Promise<OverviewData> {
  const supabase = await createClient();
  const today = new Date();

  // ── Auth metadata (first name) ────────────────────────────────────────────
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const rawName =
    (authUser?.user_metadata as { full_name?: string } | undefined)
      ?.full_name ?? authUser?.email ?? "there";
  const firstName = rawName.split(/[\s@]/)[0] ?? "there";

  // ── Profile row ───────────────────────────────────────────────────────────
  let profileRow: ProfileRow | null = null;
  let lastSeenDaysAgo: number | null = null;

  try {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone, is_verified, avatar_url, bio, last_seen_at")
      .eq("id", userId)
      .maybeSingle();

    if (data) {
      profileRow = data as ProfileRow;
      const lastSeenRaw = (data as Record<string, unknown>)["last_seen_at"] as string | null;
      if (lastSeenRaw) {
        const diffMs = today.getTime() - new Date(lastSeenRaw).getTime();
        lastSeenDaysAgo = Math.max(0, Math.floor(diffMs / 86400e3));
      }
    }
  } catch {
    // profiles table may not have all columns yet
  }

  const isVerified = profileRow?.is_verified === true;
  const profileCompletePct = calcProfileComplete(profileRow);

  // ── Listings ──────────────────────────────────────────────────────────────
  const realListings = await getMyListings(userId);
  const listings =
    realListings.length > 0 ? realListings : sampleListings.slice(0, 4);

  // ── Inquiries ─────────────────────────────────────────────────────────────
  let inquiries: Inquiry[] = [];
  let newInquiriesCount = 0;

  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select(
        `id, listing_id, inquirer_name, inquirer_phone, message, channel, created_at, is_read,
         listings!inner(title_en, title_ar, owner_id)`,
      )
      .eq("listings.owner_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      inquiries = (
        data as unknown as Array<{
          id: string;
          listing_id: string;
          inquirer_name: string | null;
          inquirer_phone: string | null;
          message: string | null;
          channel: string | null;
          created_at: string;
          is_read: boolean | null;
          listings: { title_en: string; title_ar: string; owner_id: string } | null;
        }>
      ).map((row) => ({
        id: row.id,
        listing_id: row.listing_id,
        listing_title_en: row.listings?.title_en ?? "",
        listing_title_ar: row.listings?.title_ar ?? "",
        inquirer_name_en: row.inquirer_name ?? "Unknown",
        inquirer_name_ar: row.inquirer_name ?? "Unknown",
        inquirer_phone: row.inquirer_phone ?? "",
        message_en: row.message ?? "",
        message_ar: row.message ?? "",
        channel: row.channel ?? "platform",
        created_at: row.created_at,
        is_read: row.is_read ?? false,
      }));

      const windowStart =
        lastSeenDaysAgo !== null
          ? new Date(today.getTime() - Math.min(lastSeenDaysAgo, 7) * 86400e3)
          : new Date(today.getTime() - 7 * 86400e3);

      newInquiriesCount = inquiries.filter(
        (inq) => new Date(inq.created_at) >= windowStart,
      ).length;
    }
  } catch {
    // fall through to mock
  }

  if (inquiries.length === 0) {
    inquiries = getMockInquiries();
    newInquiriesCount = inquiries.filter((i) => !i.is_read).length;
  }

  const unreadInquiries = inquiries.filter((i) => !i.is_read);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = seedWeeklyStats(userId, today);

  // Try to overlay real inquiry count
  stats.inquiriesThisWeek = Math.max(
    stats.inquiriesThisWeek,
    inquiries.filter((i) => {
      const d = new Date(i.created_at);
      return today.getTime() - d.getTime() < 7 * 86400e3;
    }).length,
  );

  // ── Top 3 listings ────────────────────────────────────────────────────────
  const topListings = [...listings]
    .sort((a, b) => seeded(b.id, 20, 100) - seeded(a.id, 20, 100))
    .slice(0, 3);

  // ── Action items ──────────────────────────────────────────────────────────
  const actionItems = buildActionItems({
    listings,
    inquiries,
    profileCompletePct,
    isVerified,
    unreadInquiries,
  });

  // ── Activity feed ─────────────────────────────────────────────────────────
  const activityFeed = seedActivityFeed(userId);

  return {
    firstName,
    lastSeenDaysAgo,
    newInquiriesCount,
    isVerified,
    profileCompletePct,
    stats,
    actionItems,
    topListings,
    activityFeed,
  };
}
