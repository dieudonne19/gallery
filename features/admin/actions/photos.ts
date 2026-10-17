"use server"

import { randomBytes } from "node:crypto"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { requireAdmin } from "@/lib/auth"
import { sql } from "@/lib/db"
import { deletePhotoFile, uploadPhoto } from "@/lib/storage"
import { readImage } from "../lib/image"
import { parsePhotoForm, type PhotoFormState } from "../schemas"

// Dev et prod partagent le même bucket : le préfixe évite de mélanger leurs fichiers.
// Sur Vercel, NODE_ENV vaut "production" même pour un déploiement de test (preview) : VERCEL_ENV les distingue.
const KEY_PREFIX = (process.env.VERCEL_ENV ?? process.env.NODE_ENV) === "production" ? "prod" : "dev"
const newKey = (extension: string) => `${KEY_PREFIX}/photos/${randomBytes(8).toString("hex")}.${extension}`

const refreshPages = () => revalidatePath("/", "layout")

/** Validation commune à l'ajout et à la modification. */
async function readForm(formData: FormData, imageRequired: boolean) {
  const { data, values, errors } = parsePhotoForm(formData)
  const image = await readImage(formData.get("image"))
  if (image && "error" in image) errors.image = image.error
  else if (!image && imageRequired) errors.image = "Choisissez une photo."
  if (data && !errors.category) {
    const [found] = await sql`select 1 as ok from categories where id = ${data.category}`
    if (!found) errors.category = "Cette catégorie n'existe plus. Choisissez-en une autre."
  }
  return { data, values, errors, image: image && !("error" in image) ? image : null }
}

export async function createPhoto(_: PhotoFormState, formData: FormData): Promise<PhotoFormState> {
  await requireAdmin()
  const { data, values, errors, image } = await readForm(formData, true)
  if (!data || !image || Object.keys(errors).length) return { errors, values }

  const id = randomBytes(4).toString("hex")
  const key = newKey(image.extension)
  try {
    await uploadPhoto(key, image.bytes, image.contentType)
    await sql`
      insert into photos (id, src, title, alt, category, place, year, position, width, height)
      values (${id}, ${key}, ${data.title}, ${data.alt}, ${data.category}, ${data.place}, ${data.year},
              (select coalesce(min(position), 0) - 1 from photos), ${image.width}, ${image.height})`
  } catch (error) {
    console.error("createPhoto failed", error)
    await deletePhotoFile(key).catch(() => {})
    return { message: "La photo n'a pas pu être enregistrée. Réessayez dans un instant.", values }
  }

  refreshPages()
  redirect("/admin")
}

export async function updatePhoto(id: string, _: PhotoFormState, formData: FormData): Promise<PhotoFormState> {
  await requireAdmin()
  const { data, values, errors, image } = await readForm(formData, false)
  if (!data || Object.keys(errors).length) return { errors, values }

  const [current] = await sql`select src from photos where id = ${id}`
  if (!current) return { message: "Cette photo n'existe plus.", values }

  const oldSrc = current.src as string
  const newSrc = image ? newKey(image.extension) : oldSrc
  try {
    if (image) await uploadPhoto(newSrc, image.bytes, image.contentType)
    await sql`
      update photos
      set title = ${data.title}, alt = ${data.alt}, category = ${data.category},
          place = ${data.place}, year = ${data.year}, src = ${newSrc},
          width = coalesce(${image?.width ?? null}::int, width), height = coalesce(${image?.height ?? null}::int, height)
      where id = ${id}`
  } catch (error) {
    console.error("updatePhoto failed", error)
    if (image) await deletePhotoFile(newSrc).catch(() => {})
    return { message: "Les modifications n'ont pas pu être enregistrées. Réessayez dans un instant.", values }
  }

  if (image) await deletePhotoFile(oldSrc).catch(() => {})
  refreshPages()
  redirect("/admin")
}

export async function deletePhoto(id: string) {
  await requireAdmin()
  const [row] = await sql`delete from photos where id = ${id} returning src`
  if (row) await deletePhotoFile(row.src as string).catch(() => {})
  refreshPages()
}

export async function movePhoto(id: string, direction: "up" | "down") {
  await requireAdmin()
  const rows = await sql`select id from photos order by position, created_at desc`
  const ids = rows.map((r) => r.id as string)
  const from = ids.indexOf(id)
  const to = direction === "up" ? from - 1 : from + 1
  if (from === -1 || to < 0 || to >= ids.length) return

  ;[ids[from], ids[to]] = [ids[to], ids[from]]
  await sql`
    update photos p set position = t.pos
    from unnest(${ids}::text[]) with ordinality as t(id, pos)
    where p.id = t.id`
  refreshPages()
}
