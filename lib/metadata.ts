import type { Metadata } from "next"

import { SITE_NAME } from "./site"

/**
 * Valeurs de partage communes (WhatsApp, Facebook, X…). Une page qui définit son propre `openGraph` ou `twitter`
 * remplace ceux du layout en entier : il faut donc les répéter, d'où ce point unique.
 */
export const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  locale: "fr_FR",
  siteName: SITE_NAME,
  // Image par défaut des pages sans photo à montrer (les pages photo ont la leur).
  images: [{ url: "/icon-512.png", width: 512, height: 512, alt: SITE_NAME }],
}

/** Titre et description d'une page, repris tels quels pour les moteurs de recherche et pour les aperçus de partage. */
export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { ...baseOpenGraph, title, description },
    twitter: { card: "summary", title, description },
  }
}
