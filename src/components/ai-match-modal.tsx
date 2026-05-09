"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { X, Send, Sparkles } from "lucide-react";
import SukanMark from "@/components/sukan-mark";
import { getListingById } from "@/lib/sample-listings";
import type { Locale } from "@/i18n/routing";

interface AIMatchModalProps {
  open: boolean;
  onClose: () => void;
}

// Compact listing card for tool results inside the chat
function MatchCard({ listingId }: { listingId: string }) {
  const locale = useLocale() as Locale;
  const listing = getListingById(listingId);
  if (!listing) return null;

  const title = locale === "ar" ? listing.titleAr : listing.titleEn;
  const city = locale === "ar" ? listing.cityAr : listing.city;

  const periodKey =
    listing.period === "month"
      ? "/mo"
      : listing.period === "year"
        ? "/yr"
        : "";

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex items-center gap-3 rounded-xl border border-gold/20 bg-earth p-3 transition hover:border-gold/50 hover:bg-earth-soft"
    >
      {/* Placeholder thumbnail */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-earth-soft">
        <SukanMark size={28} monochrome="gold" className="opacity-40" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-parchment">{title}</p>
        <p className="truncate text-xs text-mute-soft">{city}</p>
      </div>
      <div className="shrink-0 text-end">
        <p className="text-sm font-semibold text-gold-bright">
          ${listing.priceUsd.toLocaleString()}
          <span className="text-xs font-normal text-mute-soft">{periodKey}</span>
        </p>
      </div>
    </Link>
  );
}

type SearchListingsOutput = {
  count: number;
  listings: Array<{ id: string }>;
};

// Renders a single part of a message.
// In AI SDK v6, tool parts have type "tool-<toolName>" (e.g. "tool-searchListings").
// States: input-streaming | input-available | output-available | output-error
function MessagePart({ part }: { part: { type: string; text?: string; state?: string; output?: unknown } }) {
  if (part.type === "text" && part.text) {
    return (
      <p className="whitespace-pre-wrap leading-relaxed">{part.text}</p>
    );
  }

  // Match any tool-* part (catches tool-searchListings)
  if (part.type.startsWith("tool-")) {
    if (part.state === "output-available") {
      const output = part.output as SearchListingsOutput | undefined;
      if (output?.listings && output.listings.length > 0) {
        return (
          <div className="mt-2 flex flex-col gap-2">
            {output.listings.map((l) => (
              <MatchCard key={l.id} listingId={l.id} />
            ))}
          </div>
        );
      }
    }
    // Tool is still running or returned no results — render nothing
    return null;
  }

  return null;
}

export default function AIMatchModal({ open, onClose }: AIMatchModalProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("aiMatch");

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/match",
      body: { locale },
    }),
  });

  const isStreaming = status === "streaming" || status === "submitted";
  const hasMessages = messages.length > 0;

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Resize textarea on input change
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxH = 4 * 24 + 24; // ~4 lines
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
  }, [input]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
  }, [input, isStreaming, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const prefill = (text: string) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="flex w-full max-w-2xl flex-col rounded-[var(--radius-card)] border border-gold/20 bg-earth shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gold/15 px-6 py-4">
          <SukanMark size={32} monochrome="gold" />
          <div className="flex-1">
            <h2 className="font-display text-lg text-parchment">{t("title")}</h2>
            <p className="text-xs text-mute-soft">{t("subtitle")}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={t("close")}
            className="rounded-full p-2 text-mute-soft transition hover:bg-earth-soft hover:text-parchment"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages region */}
        <div className="flex max-h-[60vh] min-h-[40vh] flex-col gap-4 overflow-y-auto p-6">
          {/* Error toast */}
          {error && (
            <div className="rounded-xl border border-terracotta/30 bg-parchment-warm px-4 py-3 text-sm text-earth">
              {t("errorGeneric")}
            </div>
          )}

          {/* Intro when no messages yet */}
          {!hasMessages && (
            <div className="flex flex-col items-start gap-2">
              <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-earth-soft px-4 py-3 text-sm text-parchment border border-gold/15 ltr:rounded-bl-sm rtl:rounded-br-sm">
                {t("intro")}
              </div>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                    isUser
                      ? "bg-terracotta text-parchment ltr:rounded-br-sm rtl:rounded-bl-sm"
                      : "border border-gold/15 bg-earth-soft text-parchment ltr:rounded-bl-sm rtl:rounded-br-sm"
                  }`}
                >
                  {message.parts.map((part, i) => (
                    <MessagePart key={i} part={part as { type: string; text?: string; state?: string; output?: unknown }} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Thinking indicator */}
          {isStreaming && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-gold/15 bg-earth-soft px-4 py-3 text-sm text-mute-soft ltr:rounded-bl-sm rtl:rounded-br-sm">
                <span>{t("thinking")}</span>
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gold"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input region */}
        <div className="border-t border-gold/15 px-6 py-4">
          {/* Starter chips — only show before first user message */}
          {!hasMessages && (
            <div className="mb-3 flex flex-wrap gap-2">
              {(["starter1", "starter2", "starter3"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => prefill(t(key))}
                  className="rounded-pill border border-gold/25 px-3 py-1.5 text-xs text-mute-soft transition hover:border-gold/50 hover:text-parchment"
                >
                  {t(key)}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("placeholder")}
              rows={1}
              disabled={isStreaming}
              className="flex-1 resize-none rounded-xl border border-gold/20 bg-earth-soft px-4 py-3 text-sm text-parchment placeholder:text-mute-soft focus:border-gold/40 focus:outline-none disabled:opacity-50 ltr:font-sans rtl:font-arabic"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              aria-label={t("send")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terracotta text-parchment transition hover:bg-terracotta-deep disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>

          <p className="mt-2 text-center text-[10px] text-mute-soft">
            {locale === "ar" ? "Ctrl+Enter للإرسال" : "Ctrl+Enter to send"}
          </p>
        </div>
      </div>
    </div>
  );
}
