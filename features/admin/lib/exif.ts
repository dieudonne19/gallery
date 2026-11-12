/**
 * Lecture des réglages de prise de vue (EXIF) d'une photo, dans le navigateur, sur le fichier d'origine :
 * la réduction avant l'envoi (resize-image.ts) puis le serveur (sharp) effacent toutes les métadonnées.
 *
 * Seuls quelques champs sont lus : appareil, objectif, focale, ouverture, vitesse, ISO et date.
 * La position GPS n'est jamais lue : son répertoire (pointeur 0x8825) n'est pas suivi.
 * Formats : JPEG (segment APP1), WebP (bloc EXIF) et PNG (bloc eXIf). Sans import de code : testé avec node --test.
 */

import type { ShootingInfo } from "@/features/photos/types"

export interface ExifData extends ShootingInfo {
  /** Année de prise de vue. */
  year?: number
}

const TAG = {
  make: 0x010f,
  model: 0x0110,
  exifPointer: 0x8769,
  exposureTime: 0x829a,
  fNumber: 0x829d,
  iso: 0x8827,
  dateTimeOriginal: 0x9003,
  focalLength: 0x920a,
  lensModel: 0xa434,
} as const

// Taille en octets d'une valeur, selon son type TIFF.
const TYPE_SIZE: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 }

type Value = string | number | undefined

/** Entrées d'un répertoire TIFF (IFD) : numéro de champ → valeur (texte, nombre ou fraction calculée). */
function readIfd(view: DataView, tiff: number, offset: number, little: boolean): Map<number, Value> {
  const entries = new Map<number, Value>()
  if (offset < 0 || tiff + offset + 2 > view.byteLength) return entries
  const count = view.getUint16(tiff + offset, little)

  for (let i = 0; i < count; i++) {
    const entry = tiff + offset + 2 + i * 12
    if (entry + 12 > view.byteLength) break
    const tag = view.getUint16(entry, little)
    const type = view.getUint16(entry + 2, little)
    const n = view.getUint32(entry + 4, little)
    const size = (TYPE_SIZE[type] ?? 0) * n
    if (!size) continue
    // Valeur sur 4 octets au plus : dans l'entrée elle-même ; sinon, à l'adresse indiquée.
    const at = size <= 4 ? entry + 8 : tiff + view.getUint32(entry + 8, little)
    if (at + size > view.byteLength) continue

    if (type === 2) {
      let text = ""
      for (let j = 0; j < n; j++) {
        const code = view.getUint8(at + j)
        if (code === 0) break
        text += String.fromCharCode(code)
      }
      entries.set(tag, text.trim() || undefined)
    } else if (type === 3) entries.set(tag, view.getUint16(at, little))
    else if (type === 4) entries.set(tag, view.getUint32(at, little))
    else if (type === 9) entries.set(tag, view.getInt32(at, little))
    else if (type === 5 || type === 10) {
      const read = type === 5 ? view.getUint32.bind(view) : view.getInt32.bind(view)
      const numerator = read(at, little)
      const denominator = read(at + 4, little)
      entries.set(tag, denominator ? numerator / denominator : undefined)
    }
  }
  return entries
}

/** Lit un bloc TIFF (en-tête « II » ou « MM »), à partir de `tiff` dans `view`. */
function readTiff(view: DataView, tiff: number): ExifData {
  if (tiff + 8 > view.byteLength) return {}
  const order = view.getUint16(tiff, false)
  const little = order === 0x4949
  if (!little && order !== 0x4d4d) return {}
  if (view.getUint16(tiff + 2, little) !== 42) return {}

  const ifd0 = readIfd(view, tiff, view.getUint32(tiff + 4, little), little)
  const pointer = ifd0.get(TAG.exifPointer)
  const exif = typeof pointer === "number" ? readIfd(view, tiff, pointer, little) : new Map<number, Value>()

  const text = (value: Value) => (typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, 120) : undefined)
  const number = (value: Value) => (typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined)

  const make = text(ifd0.get(TAG.make))
  const model = text(ifd0.get(TAG.model))
  // Le modèle répète souvent la marque (« Canon EOS R5 ») : on ne la double pas.
  const camera =
    model && make && !model.toLowerCase().startsWith(make.split(" ")[0].toLowerCase()) ? `${make} ${model}` : (model ?? make)

  const date = text(exif.get(TAG.dateTimeOriginal))
  const year = date && /^\d{4}/.test(date) ? Number(date.slice(0, 4)) : undefined
  const exposure = number(exif.get(TAG.exposureTime))
  const focal = number(exif.get(TAG.focalLength))
  const fNumber = number(exif.get(TAG.fNumber))
  const iso = number(exif.get(TAG.iso))

  const data: ExifData = {
    camera,
    lens: text(exif.get(TAG.lensModel)),
    focalLength: focal ? Math.round(focal * 10) / 10 : undefined,
    aperture: fNumber ? Math.round(fNumber * 10) / 10 : undefined,
    exposureTime: exposure ? formatExposure(exposure) : undefined,
    iso: iso ? Math.round(iso) : undefined,
    year: year && year >= 1800 && year <= 2200 ? year : undefined,
  }
  // Seuls les champs trouvés : un fichier sans réglages donne un objet vide.
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as ExifData
}

/** 0,004 s → « 1/250 » ; 2 s → « 2 » ; 1,5 s → « 1.5 ». */
export function formatExposure(seconds: number): string {
  if (seconds < 1) return `1/${Math.round(1 / seconds)}`
  return String(Math.round(seconds * 10) / 10)
}

const ascii = (view: DataView, at: number, text: string) =>
  at + text.length <= view.byteLength && [...text].every((c, i) => view.getUint8(at + i) === c.charCodeAt(0))

/** Position du bloc TIFF (EXIF) dans le fichier, ou -1 s'il n'y en a pas. */
function findTiff(view: DataView): number {
  // JPEG : segments FFxx jusqu'au début de l'image.
  if (view.byteLength > 4 && view.getUint16(0) === 0xffd8) {
    let at = 2
    while (at + 4 <= view.byteLength) {
      const marker = view.getUint16(at)
      const length = view.getUint16(at + 2)
      if ((marker & 0xff00) !== 0xff00 || marker === 0xffda) break
      if (marker === 0xffe1 && ascii(view, at + 4, "Exif\0\0")) return at + 10
      at += 2 + length
    }
    return -1
  }
  // WebP : RIFF….WEBP, puis des blocs ; « EXIF » contient le TIFF (parfois précédé de « Exif\0\0 »).
  if (ascii(view, 0, "RIFF") && ascii(view, 8, "WEBP")) {
    let at = 12
    while (at + 8 <= view.byteLength) {
      const size = view.getUint32(at + 4, true)
      if (ascii(view, at, "EXIF")) return ascii(view, at + 8, "Exif\0\0") ? at + 14 : at + 8
      at += 8 + size + (size % 2)
    }
    return -1
  }
  // PNG : signature, puis des blocs ; « eXIf » contient le TIFF (avant ou après l'image).
  if (view.byteLength > 8 && view.getUint32(0) === 0x89504e47) {
    let at = 8
    while (at + 8 <= view.byteLength) {
      const size = view.getUint32(at)
      if (ascii(view, at + 4, "eXIf")) return at + 8
      at += 12 + size
    }
  }
  return -1
}

/** Vrai si le fichier contient un bloc EXIF (qui peut contenir une position GPS). */
export function hasExif(buffer: ArrayBuffer): boolean {
  try {
    return findTiff(new DataView(buffer)) !== -1
  } catch {
    return true // dans le doute, on considère qu'il y en a
  }
}

/** Réglages de prise de vue d'un fichier image ; objet vide si le fichier n'en contient pas (ou n'est pas reconnu). */
export function readExif(buffer: ArrayBuffer): ExifData {
  try {
    const view = new DataView(buffer)
    const tiff = findTiff(view)
    return tiff === -1 ? {} : readTiff(view, tiff)
  } catch {
    // Fichier tronqué ou mal formé : pas d'informations plutôt qu'une erreur.
    return {}
  }
}
