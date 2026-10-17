import { MAX_DIMENSION, MAX_IMAGE_BYTES } from "./limits"

// En dessous, une photo déjà aux bonnes dimensions est envoyée telle quelle : inutile de la recompresser.
const KEEP_AS_IS_BYTES = 1.5 * 1024 * 1024

const encode = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))

/**
 * Réduit une photo dans le navigateur avant l'envoi : 2000 px au plus, en WebP (JPEG si le navigateur ne sait pas
 * encoder le WebP). Une photo de 5 à 10 Mo passe ainsi sous la limite de 4,5 Mo de l'hébergeur.
 * Le sens de la photo (EXIF) est appliqué ici. Le serveur refait de toute façon sa propre vérification.
 * Si la réduction est impossible (format non lu par le navigateur), renvoie le fichier d'origine.
 */
export async function resizeForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
    const longest = Math.max(bitmap.width, bitmap.height)

    if (file.size <= KEEP_AS_IS_BYTES && longest <= MAX_DIMENSION && /^image\/(jpeg|webp)$/.test(file.type)) {
      bitmap.close()
      return file
    }

    const scale = Math.min(1, MAX_DIMENSION / longest)
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    let blob = await encode(canvas, "image/webp", 0.9)
    // Un navigateur qui ne sait pas encoder le WebP renvoie du PNG (très lourd) : on passe au JPEG.
    if (!blob || blob.type !== "image/webp") blob = await encode(canvas, "image/jpeg", 0.9)
    if (blob && blob.size > MAX_IMAGE_BYTES) blob = await encode(canvas, blob.type, 0.75)
    if (!blob) return file

    const extension = blob.type === "image/webp" ? "webp" : "jpg"
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "photo"}.${extension}`, { type: blob.type })
  } catch {
    return file
  }
}
