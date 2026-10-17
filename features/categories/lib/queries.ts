import { cache } from "react"

import { sql } from "@/lib/db"
import type { Category } from "@/features/photos/types"

/** Catégories dans l'ordre d'affichage. cache() : une seule requête par rendu, même demandée par plusieurs composants. */
export const getCategories = cache(async (): Promise<Category[]> => {
  const rows = await sql`select id, label from categories order by position, created_at`
  return rows as Category[]
})

export interface AdminCategory extends Category {
  photoCount: number
}

/** Pour /admin/categories : chaque catégorie avec le nombre de photos qu'elle contient. */
export async function getCategoriesWithCounts(): Promise<AdminCategory[]> {
  const rows = await sql`
    select c.id, c.label, count(p.id)::int as "photoCount"
    from categories c
    left join photos p on p.category = c.id
    group by c.id
    order by c.position, c.created_at`
  return rows as AdminCategory[]
}
