export interface ContactDraft {
  name: string;
  photo: string;
  message: string;
}

/** Texte envoyé, identique pour WhatsApp et pour l'e-mail. */
export function composeMessage({ name, photo, message }: ContactDraft): string {
  const lines = [message.trim() || "Bonjour,"];
  if (photo.trim()) lines.push(`À propos de la photo : « ${photo.trim()} »`);
  if (name.trim()) lines.push(`— ${name.trim()}`);
  return lines.join("\n\n");
}
