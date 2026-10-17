import { WHATSAPP_NUMBER } from "../config";
import { composeMessage, type ContactDraft } from "./message";

export function buildWhatsAppUrl(draft: ContactDraft): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(composeMessage(draft))}`;
}
