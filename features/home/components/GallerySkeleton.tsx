import { MasonrySkeleton } from "@/features/photos/components/MasonrySkeleton";

/** Place réservée à la galerie pendant son chargement : même mosaïque et mêmes marges que la vraie grille. */
export function GallerySkeleton() {
  return (
    <section className="px-4 pb-16 pt-4 md:px-8 md:pb-24 md:pt-6" aria-busy="true">
      <p className="sr-only" role="status">
        Chargement des photos…
      </p>
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="mb-4 h-4" />
        <MasonrySkeleton />
      </div>
    </section>
  );
}
