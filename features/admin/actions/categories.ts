"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { slugify } from "@/features/categories/lib/slug"
import { requireAdmin } from "@/lib/auth"
import { sql } from "@/lib/db"

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

export async function moveCategory(id: string, direction: "up" | "down") {
  await requireAdmin()
  const rows = await sql`select id from categories order by position, created_at`
  const ids = rows.map((r) => r.id as string)
  const from = ids.indexOf(id)
  const to = direction === "up" ? from - 1 : from + 1
  if (from === -1 || to < 0 || to >= ids.length) return

  ;[ids[from], ids[to]] = [ids[to], ids[from]]
  await sql`
    update categories c set position = t.pos
    from unnest(${ids}::text[]) with ordinality as t(id, pos)
    where c.id = t.id`
  refreshPages()
}
