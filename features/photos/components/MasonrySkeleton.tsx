import { heightVars, layoutAll, placementVars } from "../lib/masonry"

// Formats variés (largeur ÷ hauteur), comme une vraie galerie.
const RATIOS = [1.5, 0.75, 1, 0.75, 1.5, 0.8, 1.33, 0.66, 1, 1.5]

/** Mosaïque de cartes vides, aux mêmes colonnes que PhotoGrid, pendant le chargement des photos. */
export function MasonrySkeleton({ count = RATIOS.length }: { count?: number }) {
  const ratios = RATIOS.slice(0, count)
  const layouts = layoutAll(ratios)
  return (
    <div className="masonry" aria-hidden="true">
      <div className="masonry-grid" style={heightVars(layouts) as React.CSSProperties}>
        {ratios.map((ratio, i) => (
          <div key={i} className="masonry-item" style={placementVars(layouts, i) as React.CSSProperties}>
            <div className="animate-pulse rounded-xl bg-muted" style={{ aspectRatio: ratio }} />
            <div className="masonry-caption" />
          </div>
        ))}
      </div>
    </div>
  )
}
