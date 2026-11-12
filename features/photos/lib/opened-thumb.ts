/**
 * Dernière carte cliquée dans la galerie, et sa position à l'écran : la grande vue de la photo
 * part de là pour s'agrandir (features/photo/components/DetailImage.tsx). Navigateur seulement.
 */
let opened: { id: string; rect: DOMRect; at: number } | null = null

export function rememberOpenedThumb(id: string, element: Element) {
  opened = { id, rect: element.getBoundingClientRect(), at: Date.now() }
}

/** Position de la carte de cette photo, si on vient de cliquer dessus (et une seule fois). */
export function takeOpenedThumb(id: string): DOMRect | null {
  const found = opened && opened.id === id && Date.now() - opened.at < 5000 ? opened.rect : null
  opened = null
  return found
}
