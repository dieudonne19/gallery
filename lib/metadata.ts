import type { Metadata } from "next"

import { SITE_NAME } from "./site"

/** Image d'aperçu par défaut (app/opengraph-image.tsx). Les pages photo posent la leur. */
export const defaultShareImage = { url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }

/**
 * Valeurs de partage communes (WhatsApp, LinkedIn, Facebook, X…). Une page qui définit son propre `openGraph` ou
 * `twitter` remplace ceux du layout en entier, images comprises : il faut donc les répéter, d'où ce point unique.
 */
export const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  locale: "fr_FR",
  siteName: SITE_NAME,
  images: [defaultShareImage],
}

/** Titre et description d'une page, repris tels quels pour les moteurs de recherche et pour les aperçus de partage. */
export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { ...baseOpenGraph, title, description },
    twitter: { card: "summary_large_image", title, description, images: [defaultShareImage.url] },
  }
}
