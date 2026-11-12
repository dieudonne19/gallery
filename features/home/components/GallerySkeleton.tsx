import { heightVars, layoutAll, placementVars } from "@/features/photos/lib/masonry";

// Formats variés (largeur ÷ hauteur), comme une vraie galerie.
const ratios = [1.5, 0.75, 1, 0.75, 1.5, 0.8, 1.33, 0.66, 1, 1.5];

/** Place réservée à la galerie pendant son chargement : même mosaïque et mêmes marges que la vraie grille. */
export function GallerySkeleton() {
  const layouts = layoutAll(ratios);
  return (
    <section className="px-4 pb-16 pt-4 md:px-8 md:pb-24 md:pt-6" aria-busy="true">
      <p className="sr-only" role="status">
        Chargement des photos…
      </p>
      <div className="mx-auto w-full max-w-[1800px]" aria-hidden="true">
        <div className="mb-4 h-4" />
        <div className="masonry">
          <div className="masonry-grid" style={heightVars(layouts) as React.CSSProperties}>
            {ratios.map((ratio, i) => (
              <div key={i} className="masonry-item" style={placementVars(layouts, i) as React.CSSProperties}>
                <div className="animate-pulse rounded-xl bg-muted" style={{ aspectRatio: ratio }} />
                <div className="masonry-caption" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
