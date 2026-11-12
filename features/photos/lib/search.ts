/** Longueur maximale d'une recherche : au-delà, le texte est coupé. */
export const MAX_SEARCH_LENGTH = 100

/** Recherche saisie par le visiteur, nettoyée : espaces superflus retirés, longueur limitée. Vide → undefined. */
export function cleanSearch(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const cleaned = value.replace(/\s+/g, " ").trim().slice(0, MAX_SEARCH_LENGTH).trim()
  return cleaned || undefined
}

/**
 * Motifs LIKE, un par mot : chaque mot doit apparaître (« coucher nosy »). Les caractères spéciaux de LIKE
 * (% _ \) sont échappés : ils sont cherchés tels quels. Les accents et majuscules sont retirés en SQL (unaccent, lower).
 */
export function searchPatterns(search: string | undefined): string[] {
  if (!search) return []
  return search
    .split(" ")
    .filter(Boolean)
    .slice(0, 8)
    .map((word) => `%${word.replace(/[\\%_]/g, "\\$&")}%`)
}
