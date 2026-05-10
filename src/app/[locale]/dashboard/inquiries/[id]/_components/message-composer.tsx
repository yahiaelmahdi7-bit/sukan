"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { GlassTextarea } from "@/components/ui/glass-input";
import { sendMessage } from "../../actions";

interface MessageComposerProps {
  inquiryId: string;
  currentUserId: string;
  labels: {
    typeMessage: string;
    send: string;
    sending: string;
    error: string;
    attachPhoto: string;
    attaching: string;
    removeAttachment: string;
  };
}

export default function MessageComposer({
  inquiryId,
  currentUserId,
  labels,
}: MessageComposerProps) {
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    // Max 4 attachments total
    const remaining = 4 - attachments.length;
    const toUpload = files.slice(0, remaining);

    setUploading(true);
    setErrorMsg(null);

    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of toUpload) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${currentUserId}/messages/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      const { error } = await supabase.storage
        .from("listing-photos")
        .upload(path, file, { upsert: false });

      if (error) {
        console.error("[composer] upload failed:", error.message);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("listing-photos")
        .getPublicUrl(path);

      if (urlData?.publicUrl) {
        uploaded.push(urlData.publicUrl);
      }
    }

    setAttachments((prev) => [...prev, ...uploaded]);
    setUploading(false);

    // Reset file input so the same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeAttachment(url: string) {
    setAttachments((prev) => prev.filter((a) => a !== url));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const trimmed = body.trim();
    if (!trimmed && attachments.length === 0) return;
    if (isPending || uploading) return;

    setErrorMsg(null);

    startTransition(async () => {
      const result = await sendMessage(inquiryId, trimmed, attachments);
      if (result.ok) {
        setBody("");
        setAttachments([]);
        textareaRef.current?.focus();
      } else {
        setErrorMsg(result.error);
      }
    });
  }

  const canSend = (body.trim().length > 0 || attachments.length > 0) && !uploading;

  return (
    <div className="flex flex-col gap-2">
      {/* Pending attachment thumbnails */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {attachments.map((url) => (
            <div key={url} className="relative group">
              <Image
                src={url}
                alt="attachment preview"
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-lg border border-white/40"
              />
              <button
                type="button"
                onClick={() => removeAttachment(url)}
                aria-label={labels.removeAttachment}
                className="absolute -top-1.5 -end-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-terracotta text-cream text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        {/* Paperclip */}
        <button
          type="button"
          disabled={uploading || attachments.length >= 4}
          onClick={() => fileInputRef.current?.click()}
          aria-label={uploading ? labels.attaching : labels.attachPhoto}
          className="flex-none w-10 h-10 flex items-center justify-center rounded-xl border border-white/50 bg-white/45 text-ink-mid hover:text-terracotta hover:border-gold/50 hover:bg-gold/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-md"
        >
          {uploading ? <SpinnerIcon /> : <PaperclipIcon />}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Textarea */}
        <GlassTextarea
          ref={textareaRef}
          tone="light"
          rows={1}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={labels.typeMessage}
          className="flex-1 min-h-[40px] max-h-36 resize-none py-2.5"
          disabled={isPending}
        />

        {/* Send button */}
        <button
          type="button"
          disabled={!canSend || isPending}
          onClick={submit}
          aria-label={isPending ? labels.sending : labels.send}
          className="flex-none w-10 h-10 flex items-center justify-center rounded-xl text-cream disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          style={
            canSend && !isPending
              ? {
                  background:
                    "linear-gradient(135deg, #c8401a 0%, #9d2f0f 100%)",
                  boxShadow:
                    "0 4px 14px rgba(200,64,26,0.30), inset 0 1px 0 rgba(255,255,255,0.15)",
                }
              : { background: "#d4b8aa" }
          }
        >
          {isPending ? <SpinnerIcon /> : <SendIcon />}
        </button>
      </div>

      {/* Error pill */}
      {errorMsg && (
        <p
          role="alert"
          className="text-xs rounded-lg bg-terracotta/10 border border-terracotta/30 text-terracotta px-3 py-2"
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
}

// ─── Micro icons ──────────────────────────────────────────────────────────────

function PaperclipIcon() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="animate-spin"
    >
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
