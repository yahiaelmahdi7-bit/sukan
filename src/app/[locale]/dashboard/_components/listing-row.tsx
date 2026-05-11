"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  Eye,
  MessageSquare,
  Heart,
  Star,
  MoreHorizontal,
  Edit3,
  PauseCircle,
  Zap,
  Copy,
  Trash2,
  BadgeCheck,
} from "lucide-react";
import {
  getListingImage,
  getLocaleTitle,
  getLocaleCity,
  type Listing,
} from "@/lib/sample-listings";
import type { Locale } from "@/i18n/routing";

type ListingStatus = "active" | "draft" | "pending_payment" | "featured";

function statusForListing(listing: Listing): ListingStatus {
  if (listing.tier === "featured") return "featured";
  return "active";
}

interface ListingRowProps {
  listing: Listing;
  locale: string;
  views: number;
  inquiries: number;
  saves: number;
  lastActivity: string;
  labels: {
    active: string;
    draft: string;
    pending: string;
    featured: string;
    edit: string;
    pause: string;
    boost: string;
    duplicate: string;
    delete: string;
    viewsLabel: string;
    inquiriesLabel: string;
    savesLabel: string;
    lastActivity: string;
  };
}

function StatusPill({ status, labels }: { status: ListingStatus; labels: ListingRowProps["labels"] }) {
  if (status === "featured") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-900"
        style={{
          background: "linear-gradient(135deg, #e0a857 0%, #c8873a 100%)",
          boxShadow: "0 2px 8px rgba(200,135,58,0.30)",
        }}
      >
        <Star size={9} aria-hidden="true" />
        {labels.featured}
      </span>
    );
  }
  if (status === "draft") {
    return (
      <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-ink/20 bg-sand px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-mid">
        {labels.draft}
      </span>
    );
  }
  if (status === "pending_payment") {
    return (
      <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-amber-400/40 bg-amber-50/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-700">
        {labels.pending}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] border border-green-400/40 bg-green-50/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-green-700">
      <span className="h-1 w-1 rounded-full bg-green-500" aria-hidden />
      {labels.active}
    </span>
  );
}

export default function ListingRow({
  listing,
  locale,
  views,
  inquiries,
  saves,
  lastActivity,
  labels,
}: ListingRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const title = getLocaleTitle(listing, locale as Locale);
  const city = getLocaleCity(listing, locale as Locale);
  const status = statusForListing(listing);
  const imgSrc = getListingImage(listing);

  // Close menu on outside click or Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener("click", onDocClick);
      document.addEventListener("keydown", onKeyDown);
    }
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div
      className="smooth-fast group relative flex items-center gap-4 border-b border-white/30 last:border-0 px-5 py-4 hover:bg-white/30"
    >
      {/* Thumbnail — clicking navigates to listing */}
      <Link
        href={`/listings/${listing.id}`}
        className="shrink-0 block"
        aria-label={title}
        tabIndex={-1}
      >
        <div className="relative h-[60px] w-[60px] overflow-hidden rounded-xl bg-sand">
          <Image
            src={imgSrc}
            alt={title}
            fill
            sizes="60px"
            className="object-cover"
          />
        </div>
      </Link>

      {/* Main row content — also navigates to listing on click */}
      <Link
        href={`/listings/${listing.id}`}
        className="flex flex-1 min-w-0 items-center gap-4"
      >
        {/* Title block */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="font-display text-base text-ink leading-tight line-clamp-1">
              {title}
            </p>
            {listing.ownerVerified && (
              <BadgeCheck size={14} className="shrink-0 text-sky-500" aria-hidden="true" />
            )}
          </div>
          <p className="text-xs text-ink-mid mt-0.5 truncate">
            {city}
          </p>
          {/* Last activity */}
          <p className="text-[11px] text-ink-mid/70 mt-1">
            {labels.lastActivity}: {lastActivity}
          </p>
        </div>

        {/* Stats strip */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <span className="flex items-center gap-1 text-xs text-ink-mid" title={labels.viewsLabel}>
            <Eye size={12} className="text-gold-dk" aria-hidden="true" />
            <span className="font-display text-sm text-ink" aria-label={`${views} ${labels.viewsLabel}`}>{views}</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-ink-mid" title={labels.inquiriesLabel}>
            <MessageSquare size={12} className="text-gold-dk" aria-hidden="true" />
            <span className="font-display text-sm text-ink" aria-label={`${inquiries} ${labels.inquiriesLabel}`}>{inquiries}</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-ink-mid" title={labels.savesLabel}>
            <Heart size={12} className="text-terracotta" aria-hidden="true" />
            <span className="font-display text-sm text-ink" aria-label={`${saves} ${labels.savesLabel}`}>{saves}</span>
          </span>
        </div>

        {/* Status pill */}
        <div className="hidden md:block shrink-0">
          <StatusPill status={status} labels={labels} />
        </div>
      </Link>

      {/* Actions menu — stops propagation so row click doesn't fire */}
      <div
        ref={menuRef}
        className="relative shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Actions"
          aria-expanded={menuOpen}
          aria-haspopup="true"
          onClick={() => setMenuOpen((v) => !v)}
          className="smooth-fast flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/40 text-ink-mid hover:border-gold/50 hover:bg-white/70 hover:text-ink backdrop-blur-sm"
        >
          <MoreHorizontal size={15} aria-hidden="true" />
        </button>

        {menuOpen && (
          <div
            className="absolute end-0 z-30 mt-1.5 w-44 overflow-hidden rounded-[var(--radius-glass)] border border-white/55 bg-cream/90 shadow-[var(--shadow-warm-lg)] backdrop-blur-md"
          >
            <ul className="py-1 text-sm">
              <li>
                <Link
                  href={`/dashboard/listings/${listing.id}/edit`}
                  className="smooth-fast flex items-center gap-2.5 px-4 py-2.5 text-ink hover:bg-gold/10 hover:text-terracotta"
                  onClick={() => setMenuOpen(false)}
                >
                  <Edit3 size={13} aria-hidden="true" />
                  {labels.edit}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="smooth-fast w-full flex items-center gap-2.5 px-4 py-2.5 text-start text-ink-mid hover:bg-gold/10 hover:text-ink"
                  onClick={() => {
                    setMenuOpen(false);
                    // TODO: wire pause action to Supabase status update
                  }}
                >
                  <PauseCircle size={13} aria-hidden="true" />
                  {labels.pause}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="smooth-fast w-full flex items-center gap-2.5 px-4 py-2.5 text-start text-ink-mid hover:bg-gold/10 hover:text-ink"
                  onClick={() => {
                    setMenuOpen(false);
                    // TODO: wire boost action (open upsell modal or redirect to /post?boost=id)
                  }}
                >
                  <Zap size={13} aria-hidden="true" />
                  {labels.boost}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="smooth-fast w-full flex items-center gap-2.5 px-4 py-2.5 text-start text-ink-mid hover:bg-gold/10 hover:text-ink"
                  onClick={() => {
                    setMenuOpen(false);
                    // TODO: wire duplicate — clone listing row in DB and redirect to edit
                  }}
                >
                  <Copy size={13} aria-hidden="true" />
                  {labels.duplicate}
                </button>
              </li>
              <li className="border-t border-white/40 mt-1 pt-1">
                <button
                  type="button"
                  className="smooth-fast w-full flex items-center gap-2.5 px-4 py-2.5 text-start text-terracotta hover:bg-terracotta/10"
                  onClick={() => {
                    setMenuOpen(false);
                    // TODO: wire delete with confirmation dialog
                  }}
                >
                  <Trash2 size={13} aria-hidden="true" />
                  {labels.delete}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
