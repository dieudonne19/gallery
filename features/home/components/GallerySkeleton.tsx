const heights = ["aspect-[3/2]", "aspect-[3/4]", "aspect-[3/4]", "aspect-[3/2]", "aspect-square", "aspect-[3/4]"];

/** Place réservée à la galerie pendant son chargement : mêmes colonnes et mêmes marges que la grille. */
export function GallerySkeleton() {
  return (
    <section className="px-4 pb-16 pt-4 md:px-16 md:pb-24 md:pt-6" aria-busy="true">
      <p className="sr-only" role="status">
        Chargement des photos…
      </p>
      <div className="mx-auto w-full max-w-6xl" aria-hidden="true">
        <div className="mb-4 h-4" />
        <div className="columns-2 gap-3 md:gap-4 lg:columns-3">
          {heights.map((ratio, i) => (
            <div key={i} className={`mb-3 break-inside-avoid rounded-xl bg-muted md:mb-4 ${ratio}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
