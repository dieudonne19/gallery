/** Place réservée à la galerie pendant son chargement : mêmes marges et mêmes proportions que la mosaïque. */
export function GallerySkeleton() {
  return (
    <section className="px-4 pb-16 pt-4 md:px-16 md:pb-24 md:pt-6" aria-busy="true">
      <p className="sr-only" role="status">
        Chargement des photos…
      </p>
      <div className="mx-auto w-full max-w-6xl" aria-hidden="true">
        <div className="mb-4 h-4" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[2fr_1fr] md:grid-rows-2 md:gap-4">
          <div className="col-span-2 aspect-[3/2] rounded-xl bg-muted md:col-span-1 md:row-span-2 md:aspect-auto md:min-h-96" />
          <div className="aspect-[3/2] rounded-xl bg-muted" />
          <div className="aspect-[3/2] rounded-xl bg-muted" />
        </div>
      </div>
    </section>
  );
}
