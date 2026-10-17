"use client";

import { useState } from "react";
import { buildMailtoUrl } from "../lib/mailto";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import type { ContactDraft } from "../lib/message";
import { Postcard } from "./Postcard";
import { PostcardActions } from "./PostcardActions";

interface PostcardFormProps {
  /** Titre de la photo si l'on arrive depuis une fiche photo. */
  initialPhoto?: string;
}

export function PostcardForm({ initialPhoto = "" }: PostcardFormProps) {
  const [draft, setDraft] = useState<ContactDraft>({ name: "", photo: initialPhoto, message: "" });

  return (
    <>
      <div className="relative flex items-center justify-center overflow-hidden bg-muted px-4 py-8 md:px-16 md:py-[72px]">
        <div className="relative flex w-full justify-center">
          <Postcard value={draft} onChange={setDraft} />
        </div>
      </div>
      <PostcardActions whatsappUrl={buildWhatsAppUrl(draft)} mailtoUrl={buildMailtoUrl(draft)} />
    </>
  );
}
