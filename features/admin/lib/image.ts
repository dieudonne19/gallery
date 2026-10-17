export const MAX_IMAGE_BYTES = 8 * 1024 * 1024

export interface ValidImage {
  bytes: Uint8Array
  extension: "jpg" | "png" | "webp"
  contentType: "image/jpeg" | "image/png" | "image/webp"
}

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((byte, i) => bytes[offset + i] === byte)

/** Le type vient du contenu (octets magiques), jamais du nom ni du type annoncé par le navigateur. */
function detectType(bytes: Uint8Array): Omit<ValidImage, "bytes"> | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { extension: "jpg", contentType: "image/jpeg" }
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { extension: "png", contentType: "image/png" }
  if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8))
    return { extension: "webp", contentType: "image/webp" }
  return null
}

/** Retourne `null` si aucun fichier n'a été choisi, sinon l'image ou un message d'erreur. */
export async function readImage(value: FormDataEntryValue | null): Promise<ValidImage | { error: string } | null> {
  if (!(value instanceof File) || value.size === 0) return null
  if (value.size > MAX_IMAGE_BYTES) return { error: "La photo dépasse 8 Mo. Choisissez une version plus légère." }
  const bytes = new Uint8Array(await value.arrayBuffer())
  const type = detectType(bytes)
  if (!type) return { error: "Ce fichier n'est pas une photo JPEG, PNG ou WebP." }
  return { bytes, ...type }
}
