import { z } from "zod"

/**
 * Curseur de pagination : la place de la dernière photo affichée dans l'ordre de la galerie
 * (position, puis date d'ajout la plus récente, puis id). La page suivante commence juste après,
 * même si des photos ont été ajoutées en tête entre-temps : ni doublon, ni trou.
 * La date reste en texte : elle garde ses microsecondes, qu'un Date JavaScript perdrait.
 */
export interface PhotoCursor {
  position: number
  createdAt: string
  id: string
}

const cursorSchema = z.object({
  position: z.number().int(),
  createdAt: z.string().min(1).max(40),
  id: z.string().min(1).max(40),
})

export function encodeCursor(cursor: PhotoCursor): string {
  return Buffer.from(JSON.stringify([cursor.position, cursor.createdAt, cursor.id])).toString("base64url")
}

/** Curseur reçu du navigateur : `null` s'il est invalide (on ne lui fait jamais confiance). */
export function decodeCursor(value: unknown): PhotoCursor | null {
  if (typeof value !== "string" || value.length > 200) return null
  try {
    const [position, createdAt, id] = JSON.parse(Buffer.from(value, "base64url").toString("utf8"))
    const parsed = cursorSchema.safeParse({ position, createdAt, id })
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}
