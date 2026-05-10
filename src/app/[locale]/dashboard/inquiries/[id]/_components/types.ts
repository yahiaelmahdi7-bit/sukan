// Shared Message shape used across thread components.
// Typed inline (database.types.ts is stale).

export interface Message {
  id: string;
  inquiry_id: string;
  sender_id: string;
  body: string | null;
  attachments: string[];
  read_at: string | null;
  created_at: string;
}
