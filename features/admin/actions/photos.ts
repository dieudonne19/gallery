"use server"

import { randomBytes } from "node:crypto"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { requireAdmin } from "@/lib/auth"
import { sql } from "@/lib/db"
import { deletePhotoFile, uploadPhoto } from "@/lib/storage"
import { readImage } from "../lib/image"
import { isPermutationOf } from "../lib/same-order-set"
import { parsePhotoForm, type PhotoFormState } from "../schemas"

// Dev et prod partagent le même bucket : le préfixe évite de mélanger leurs fichiers.
// Sur Vercel, NODE_ENV vaut "production" même pour un déploiement de test (preview) : VERCEL_ENV les distingue.
const KEY_PREFIX = (process.env.VERCEL_ENV ?? process.env.NODE_ENV) === "production" ? "prod" : "dev"
const newKey = (extension: string) => `${KEY_PREFIX}/photos/${randomBytes(8).toString("hex")}.${extension}`

const refreshPages = () => revalidatePath("/", "layout")

// Un fichier qui reste dans le bucket ne bloque rien, mais on garde une trace pour pouvoir le retrouver.
const deleteQuietly = (key: string) =>
  deletePhotoFile(key).catch((error) => console.error("deletePhotoFile failed", key, error))

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

type ReadForm = Awaited<ReturnType<typeof readForm>>

/**
 * Enregistre une photo validée : fichier dans le bucket, puis ligne en base (en tête de la galerie).
 * En cas d'échec, le fichier déjà envoyé est effacé. Partagé par l'ajout simple et l'envoi en série.
 */
async function insertPhoto(data: NonNullable<ReadForm["data"]>, image: NonNullable<ReadForm["image"]>) {
  const id = randomBytes(4).toString("hex")
  const key = newKey(image.extension)
  try {
    await uploadPhoto(key, image.bytes, image.contentType)
    await sql`
      insert into photos (id, src, title, alt, category, place, year, position, width, height, color,
                          camera, lens, focal_length, aperture, exposure_time, iso)
      values (${id}, ${key}, ${data.title}, ${data.alt}, ${data.category}, ${data.place}, ${data.year},
              (select coalesce(min(position), 0) - 1 from photos), ${image.width}, ${image.height}, ${image.color},
              ${data.camera}, ${data.lens}, ${data.focalLength}, ${data.aperture}, ${data.exposureTime}, ${data.iso})`
    return { id }
  } catch (error) {
    console.error("insertPhoto failed", error)
    await deleteQuietly(key)
    return { error: "La photo n'a pas pu être enregistrée. Réessayez dans un instant." }
  }
}

export async function createPhoto(_: PhotoFormState, formData: FormData): Promise<PhotoFormState> {
  await requireAdmin()
  const { data, values, errors, image } = await readForm(formData, true)
  if (!data || !image || Object.keys(errors).length) return { errors, values }

  const saved = await insertPhoto(data, image)
  if ("error" in saved) return { message: saved.error, values }

  refreshPages()
  redirect("/admin")
}

export type BatchPhotoResult = { ok: true; id: string } | { ok: false; errors?: PhotoFormState["errors"]; message?: string }

/**
 * Envoi en série (features/admin/components/BatchUpload.tsx) : une photo par requête, à cause de la limite
 * de 4,5 Mo par requête de l'hébergeur. Mêmes contrôles que l'ajout simple ; ni redirection ni rafraîchissement
 * (fait une seule fois à la fin, par finishBatch).
 */
export async function addBatchPhoto(formData: FormData): Promise<BatchPhotoResult> {
  await requireAdmin()
  const { data, errors, image } = await readForm(formData, true)
  if (!data || !image || Object.keys(errors).length) return { ok: false, errors }

  const saved = await insertPhoto(data, image)
  return "error" in saved ? { ok: false, message: saved.error } : { ok: true, id: saved.id }
}

/** Fin d'un envoi en série : les pages du site sont rafraîchies une seule fois. */
export async function finishBatch() {
  await requireAdmin()
  refreshPages()
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
          camera = ${data.camera}, lens = ${data.lens}, focal_length = ${data.focalLength}, aperture = ${data.aperture},
          exposure_time = ${data.exposureTime}, iso = ${data.iso},
          width = coalesce(${image?.width ?? null}::int, width), height = coalesce(${image?.height ?? null}::int, height),
          color = coalesce(${image?.color ?? null}::text, color)
      where id = ${id}`
  } catch (error) {
    console.error("updatePhoto failed", error)
    if (image) await deleteQuietly(newSrc)
    return { message: "Les modifications n'ont pas pu être enregistrées. Réessayez dans un instant.", values }
  }

  if (image) await deleteQuietly(oldSrc)
  refreshPages()
  redirect("/admin")
}

export async function deletePhoto(id: string) {
  await requireAdmin()
  const [row] = await sql`delete from photos where id = ${id} returning src`
  if (row) await deleteQuietly(row.src as string)
  refreshPages()
}

const orderSchema = z.array(z.string().min(1).max(40)).max(10_000)

export interface ReorderResult {
  error?: string
}

/**
 * Nouvel ordre de toutes les photos (glisser-déposer ou flèches dans l'administration), enregistré en une requête.
 * La liste doit reprendre exactement les photos existantes : sinon (photo ajoutée ou supprimée entre-temps), rien ne change.
 */
export async function reorderPhotos(ids: string[]): Promise<ReorderResult> {
  await requireAdmin()
  const parsed = orderSchema.safeParse(ids)
  if (!parsed.success) return { error: "Ordre invalide." }

  const rows = await sql`select id from photos`
  if (!isPermutationOf(parsed.data, rows.map((r) => r.id as string))) {
    return { error: "La liste a changé entre-temps. Rechargez la page puis recommencez." }
  }
  // Une seule instruction : les positions changent toutes ensemble, ou pas du tout.
  await sql`
    update photos p set position = t.pos
    from unnest(${parsed.data}::text[]) with ordinality as t(id, pos)
    where p.id = t.id`
  refreshPages()
  return {}
}
