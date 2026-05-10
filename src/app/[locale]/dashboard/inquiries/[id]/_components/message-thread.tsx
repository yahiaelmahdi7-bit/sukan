"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MessageBubble from "./message-bubble";
import type { Message } from "./types";

interface Counterparty {
  id: string;
  name: string;
}

interface MessageThreadProps {
  inquiryId: string;
  currentUserId: string;
  initialMessages: Message[];
  counterparty: Counterparty;
  locale: string;
  noMessagesLabel: string;
}

export default function MessageThread({
  inquiryId,
  currentUserId,
  initialMessages,
  locale,
  noMessagesLabel,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages and initial load
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`inquiry-${inquiryId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `inquiry_id=eq.${inquiryId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            // Deduplicate: ignore if we already have this id
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        },
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [inquiryId]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-ink-mid/70">
        {noMessagesLabel}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-4 px-1">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.sender_id === currentUserId}
          locale={locale}
        />
      ))}
      <div ref={bottomRef} aria-hidden />
    </div>
  );
}
