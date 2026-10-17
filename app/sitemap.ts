import type { MetadataRoute } from "next"

import { getPhotoDates } from "@/features/photos/lib/queries"
import { SITE_URL } from "@/lib/site"

// Le plan du site liste les photos de la base : il est calculé à la demande (le build ne touche jamais à la base).
export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const photos = await getPhotoDates()

  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/a-propos` },
    { url: `${SITE_URL}/contact` },
    { url: `${SITE_URL}/droits-d-utilisation` },
    { url: `${SITE_URL}/mentions-legales` },
    ...photos.map((photo) => ({ url: `${SITE_URL}/photos/${photo.id}`, lastModified: photo.createdAt })),
  ]
}
