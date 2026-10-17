"use client";

import { useState } from "react";
import { buildMailtoUrl } from "../lib/mailto";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import type { ContactDraft } from "../lib/message";
import { Postcard } from "./Postcard";
import { PostcardActions } from "./PostcardActions";

interface PostcardFormProps {
  /** Photo de fond derrière la carte. */
  backdropSrc: string;
  /** Photo du timbre. */
  stampSrc: string;
  /** Titre de la photo si l'on arrive depuis une fiche photo. */
  initialPhoto?: string;
}

export function PostcardForm({ backdropSrc, stampSrc, initialPhoto = "" }: PostcardFormProps) {
  const [draft, setDraft] = useState<ContactDraft>({ name: "", photo: initialPhoto, message: "" });

  return (
    <>
      <div className="relative flex items-center justify-center overflow-hidden bg-muted px-4 py-8 md:px-16 md:py-[72px]">
        <img src={backdropSrc} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="relative flex w-full justify-center">
          <Postcard value={draft} onChange={setDraft} stampSrc={stampSrc} />
        </div>
      </div>
      <PostcardActions whatsappUrl={buildWhatsAppUrl(draft)} mailtoUrl={buildMailtoUrl(draft)} />
    </>
  );
}
