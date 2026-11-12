import { PhotoThumb } from "./PhotoThumb"
import { cardRatio, heightVars, layoutAll, placementVars } from "../lib/masonry"
import type { Photo } from "../types"

interface PhotoGridProps {
  photos: Photo[]
  /** Nombre de photos chargées en priorité (visibles dès l'ouverture). */
  priorityCount?: number
}

/**
 * Mosaïque : chaque photo garde son format et va dans la colonne la moins haute, dans l'ordre de la liste
 * (la plus récente en haut à gauche, puis de gauche à droite). Le nombre de colonnes suit la largeur de la grille.
 * Dans la page, les photos restent dans l'ordre chronologique : le clavier et les lecteurs d'écran les lisent dans cet ordre.
 */
export function PhotoGrid({ photos, priorityCount = 3 }: PhotoGridProps) {
  const layouts = layoutAll(photos.map(cardRatio))

  return (
    <div className="masonry">
      <ul className="masonry-grid" style={heightVars(layouts) as React.CSSProperties}>
        {photos.map((photo, index) => (
          <li key={photo.id} className="masonry-item" style={placementVars(layouts, index) as React.CSSProperties}>
            <PhotoThumb photo={photo} index={index} priority={index < priorityCount} />
          </li>
        ))}
      </ul>
    </div>
  )
}
