import sharp from "sharp"

import { MAX_DIMENSION, MAX_IMAGE_BYTES } from "./limits"

/** Toute photo est enregistrée en WebP : c'est ce qui part dans le bucket. */
export interface ValidImage {
  bytes: Uint8Array
  /** Dimensions après redressement et redimensionnement. */
  width: number
  height: number
  extension: "webp"
  contentType: "image/webp"
}

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((byte, i) => bytes[offset + i] === byte)

/** Le type vient du contenu (octets magiques), jamais du nom ni du type annoncé par le navigateur. */
function isSupportedImage(bytes: Uint8Array) {
  return (
    startsWith(bytes, [0xff, 0xd8, 0xff]) || // JPEG
    startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) || // PNG
    (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) // WebP
  )
}

/**
 * Redimensionne et convertit en WebP. Remet la photo à l'endroit (EXIF) puis efface les métadonnées,
 * dont la position GPS : rien de ce qui est enregistré ne révèle où la photo a été prise.
 */
export async function optimizeImage(bytes: Uint8Array): Promise<{ bytes: Uint8Array; width: number; height: number }> {
  const { data, info } = await sharp(bytes)
    .rotate()
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true })
  return { bytes: new Uint8Array(data), width: info.width, height: info.height }
}

/** Retourne `null` si aucun fichier n'a été choisi, sinon l'image prête à enregistrer ou un message d'erreur. */
export async function readImage(value: FormDataEntryValue | null): Promise<ValidImage | { error: string } | null> {
  if (!(value instanceof File) || value.size === 0) return null
  if (value.size > MAX_IMAGE_BYTES) return { error: "La photo dépasse 4 Mo. Choisissez une version plus légère." }
  const bytes = new Uint8Array(await value.arrayBuffer())
  if (!isSupportedImage(bytes)) return { error: "Ce fichier n'est pas une photo JPEG, PNG ou WebP." }
  try {
    return { ...(await optimizeImage(bytes)), extension: "webp", contentType: "image/webp" }
  } catch {
    return { error: "Cette photo n'a pas pu être lue. Essayez un autre fichier." }
  }
}
