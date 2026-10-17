import { CONTACT_EMAIL } from "../config";
import { composeMessage, type ContactDraft } from "./message";

export function buildMailtoUrl(draft: ContactDraft): string {
  const subject = draft.photo.trim()
    ? `À propos de « ${draft.photo.trim()} »`
    : "Un message depuis votre site";
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composeMessage(draft))}`;
}
