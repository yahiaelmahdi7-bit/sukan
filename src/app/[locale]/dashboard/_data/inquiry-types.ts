/**
 * Normalized inquiry shape used across all dashboard components.
 * Both mock and real inquiries are converted to this type before rendering.
 */
export type Inquiry = {
  id: string;
  listing_id: string;
  listing_title_en: string;
  listing_title_ar: string;
  inquirer_name_en: string;
  inquirer_name_ar: string;
  inquirer_phone: string;
  message_en: string;
  message_ar: string;
  channel: string;
  created_at: string;
  is_read: boolean;
};
