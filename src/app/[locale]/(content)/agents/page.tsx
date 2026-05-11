import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Building2, MapPin, Users } from "lucide-react";
import GlassPanel from "@/components/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { VerifiedBadge } from "@/components/verified-badge";
import { createClient } from "@/lib/supabase/server";
import EmptyState from "@/components/empty-state";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sukansd.com").replace(/\/$/, "");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agents" });
  const isAr = locale === "ar";
  const title = `${t("title")} · Sukan`;
  const description = t("subtitle");
  const canonicalUrl = `${SITE_URL}/${locale}/agents`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/agents`,
        ar: `${SITE_URL}/ar/agents`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: "Sukan — سوكان",
      locale: isAr ? "ar_SD" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

type AgentRow = {
  id: string;
  full_name: string | null;
  agent_company: string | null;
  city: string | null;
  is_verified: boolean | null;
  created_at: string;
};

type AgentCard = AgentRow & {
  listingCount: number;
};

async function fetchAgents(): Promise<AgentCard[]> {
  try {
    const supabase = await createClient();
    const { data: agents } = await supabase
      .from("profiles")
      .select("id, full_name, agent_company, city, is_verified, created_at")
      .eq("is_agent", true);

    if (!agents || agents.length === 0) return [];

    const ids = agents.map((a) => a.id);
    const { data: listingRows } = await supabase
      .from("listings")
      .select("owner_id")
      .in("owner_id", ids)
      .eq("status", "active");

    const counts = new Map<string, number>();
    for (const row of listingRows ?? []) {
      const id = (row as { owner_id: string }).owner_id;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }

    return (agents as AgentRow[]).map((a) => ({
      ...a,
      listingCount: counts.get(a.id) ?? 0,
    }));
  } catch {
    return [];
  }
}

export default async function AgentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("agents");

  const agents = await fetchAgents();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {/* Hero */}
          <header className="mb-12 max-w-2xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-dk">
              {t("eyebrow")}
            </p>
            <h1 className="mb-4 font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
              {t("title")}
            </h1>
            <p className="text-lg leading-relaxed text-ink-mid">
              {t("subtitle")}
            </p>
          </header>

          {/* Empty state */}
          {agents.length === 0 ? (
            <div className="py-8">
              <EmptyState
                icon={<Users size={24} />}
                title="Our agent directory is just getting started"
                body="We're verifying our first Sudanese realtors. Want to be one of the first listed? Apply below."
                primaryCta={{ label: "Apply to be an agent", href: `/${locale}/contact?topic=agent` }}
                secondaryCta={{ label: "Browse listings", href: `/${locale}/listings` }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <GlassPanel
                  key={agent.id}
                  variant="warm"
                  radius="glass"
                  highlight
                  shadow
                  className="smooth flex flex-col gap-4 border border-white/55 p-6 hover:-translate-y-0.5 hover:shadow-[var(--shadow-gold-glow)]"
                >
                  {/* Header — name + verified */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl leading-tight text-ink line-clamp-2">
                        {agent.full_name ?? t("anonymous")}
                      </h3>
                      {agent.agent_company && (
                        <p className="mt-1 text-sm text-ink-mid line-clamp-1">
                          {agent.agent_company}
                        </p>
                      )}
                    </div>
                    {agent.is_verified && (
                      <span className="shrink-0 mt-1">
                        <VerifiedBadge size="sm" />
                      </span>
                    )}
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-mid">
                    {agent.city && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={12} aria-hidden />
                        {agent.city}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 size={12} aria-hidden />
                      {t("listingCount", { count: agent.listingCount })}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-2">
                    <Link
                      href={`/listings?owner=${agent.id}` as Parameters<typeof Link>[0]["href"]}
                      className="smooth-fast inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta hover:text-terracotta-deep"
                    >
                      {t("viewListings")} →
                    </Link>
                  </div>
                </GlassPanel>
              ))}
            </div>
        )}
      </div>
    </div>
  );
}
