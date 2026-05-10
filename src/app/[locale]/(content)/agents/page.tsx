import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Building2, MapPin } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GlassPanel from "@/components/glass-panel";
import { GlassButton } from "@/components/ui/glass-button";
import { VerifiedBadge } from "@/components/verified-badge";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "agents" });
  return {
    title: `${t("title")} · Sukan`,
    description: t("subtitle"),
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
    <>
      <Navbar />

      <main className="min-h-screen">
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
            <div className="flex flex-col items-center gap-6 py-16">
              <GlassPanel
                variant="warm"
                radius="glass-lg"
                highlight
                shadow="lg"
                className="flex flex-col items-center gap-5 border border-white/55 px-10 py-12 text-center max-w-md"
              >
                <Building2 size={40} className="text-gold-dk opacity-60" aria-hidden />
                <h2 className="font-display text-2xl text-ink">
                  {t("emptyTitle")}
                </h2>
                <p className="text-sm leading-relaxed text-ink-mid max-w-xs">
                  {t("emptyBody")}
                </p>
                <Link href="/listings">
                  <GlassButton variant="terracotta" size="md">
                    {t("browseCta")}
                  </GlassButton>
                </Link>
              </GlassPanel>
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
      </main>

      <Footer />
    </>
  );
}
