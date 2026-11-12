/**
 * Vrai si `ids` contient exactement les mêmes éléments que `existing`, chacun une seule fois :
 * un nouvel ordre envoyé par le navigateur ne peut ni ajouter, ni oublier, ni doubler une ligne.
 */
export function isPermutationOf(ids: string[], existing: string[]): boolean {
  if (ids.length !== existing.length) return false
  const remaining = new Set(existing)
  for (const id of ids) {
    if (!remaining.delete(id)) return false
  }
  return remaining.size === 0
}

/** Déplace l'élément d'indice `from` à l'indice `to` (nouvelle liste). */
export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}
