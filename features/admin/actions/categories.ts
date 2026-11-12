"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { slugify } from "@/features/categories/lib/slug"
import { requireAdmin } from "@/lib/auth"
import { sql } from "@/lib/db"
import { isPermutationOf } from "../lib/same-order-set"

export interface CategoryFormState {
  error?: string
}

const labelSchema = z.string().trim().min(1, "Indiquez un nom.").max(40, "Le nom dépasse 40 caractères.")

const refreshPages = () => revalidatePath("/", "layout")

/** Deux noms qui donnent la même adresse (« Côtes » et « cotes ») comptent comme un doublon. */
async function isTaken(slug: string, exceptId?: string) {
  const rows = await sql`select id, label from categories`
  return rows.some((c) => c.id !== exceptId && (c.id === slug || slugify(c.label as string) === slug))
}

export async function createCategory(_: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireAdmin()
  const parsed = labelSchema.safeParse(formData.get("label") ?? "")
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const label = parsed.data
  const id = slugify(label)
  if (!id) return { error: "Utilisez des lettres ou des chiffres dans le nom." }
  if (await isTaken(id)) return { error: "Une catégorie porte déjà ce nom." }

  try {
    await sql`
      insert into categories (id, label, position)
      values (${id}, ${label}, (select coalesce(max(position), 0) + 1 from categories))`
  } catch (error) {
    console.error("createCategory failed", error)
    return { error: "La catégorie n'a pas pu être ajoutée. Réessayez dans un instant." }
  }
  refreshPages()
  return {}
}

/** Renommer ne change pas l'adresse de la catégorie (?categorie=…) : les liens existants restent valables. */
export async function renameCategory(id: string, _: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireAdmin()
  const parsed = labelSchema.safeParse(formData.get("label") ?? "")
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const label = parsed.data
  const slug = slugify(label)
  if (!slug) return { error: "Utilisez des lettres ou des chiffres dans le nom." }
  if (await isTaken(slug, id)) return { error: "Une catégorie porte déjà ce nom." }

  const updated = await sql`update categories set label = ${label} where id = ${id} returning id`
  if (!updated.length) return { error: "Cette catégorie n'existe plus." }
  refreshPages()
  return {}
}

/** Refuse (sans rien faire) si la catégorie contient encore des photos : la base le garantit aussi. */
export async function deleteCategory(id: string) {
  await requireAdmin()
  await sql`
    delete from categories
    where id = ${id} and not exists (select 1 from photos where category = categories.id)`
  refreshPages()
}

/** Nouvel ordre des catégories (celui du filtre de l'accueil), enregistré en une requête. Mêmes règles que reorderPhotos. */
export async function reorderCategories(ids: string[]): Promise<{ error?: string }> {
  await requireAdmin()
  const parsed = z.array(z.string().min(1).max(60)).max(500).safeParse(ids)
  if (!parsed.success) return { error: "Ordre invalide." }

  const rows = await sql`select id from categories`
  if (!isPermutationOf(parsed.data, rows.map((r) => r.id as string))) {
    return { error: "La liste a changé entre-temps. Rechargez la page puis recommencez." }
  }
  await sql`
    update categories c set position = t.pos
    from unnest(${parsed.data}::text[]) with ordinality as t(id, pos)
    where c.id = t.id`
  refreshPages()
  return {}
}
