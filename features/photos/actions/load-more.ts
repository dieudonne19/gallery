"use server"

import { z } from "zod"

import { getCategories } from "@/features/categories/lib/queries"
import { decodeCursor } from "../lib/cursor"
import { getPhotoPage, type PhotoPage } from "../lib/queries"
import { cleanSearch } from "../lib/search"

const categorySchema = z.string().max(60).optional()

/**
 * Paquet suivant de la galerie, demandé par le navigateur pendant le défilement (features/home/components/InfiniteGallery.tsx).
 * Action publique : le curseur, la catégorie et la recherche viennent du navigateur, on les vérifie avant tout.
 */
export async function loadMorePhotos(cursor: string, category?: string, search?: string): Promise<PhotoPage> {
  const decoded = decodeCursor(cursor)
  const parsedCategory = categorySchema.safeParse(category)
  if (!decoded || !parsedCategory.success) return { photos: [] }

  // Une catégorie inconnue est ignorée, comme dans l'adresse de la page.
  const categories = await getCategories()
  const known = categories.some((c) => c.id === parsedCategory.data) ? parsedCategory.data : undefined
  return getPhotoPage({ category: known, search: cleanSearch(search), cursor: decoded })
}
