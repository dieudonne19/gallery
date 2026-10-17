/** "Couchers de soleil" -> "couchers-de-soleil" : sans accents ni majuscules, lettres, chiffres et tirets seulement. */
export function slugify(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "")
}
