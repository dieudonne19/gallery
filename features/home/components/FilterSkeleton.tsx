import { chip } from "./CategoryFilter";

/** Place réservée au filtre pendant son chargement : cinq pastilles vides, même hauteur que les vraies. */
export function FilterSkeleton() {
  return (
    <div className="flex justify-center gap-2" aria-hidden="true">
      {[56, 96, 72, 150, 64].map((width, i) => (
        <span key={i} style={{ width }} className={`${chip} animate-none bg-muted/60 px-0`} />
      ))}
    </div>
  );
}
