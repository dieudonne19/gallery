import { CATEGORIES } from "@/features/photos/data/photos";
import type { Photo } from "@/features/photos/types";

export function PhotoViewer({ photo }: { photo: Photo }) {
  const category = CATEGORIES.find((c) => c.id === photo.category);
  const link = "flex min-h-11 items-center underline underline-offset-4";

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 md:px-16 md:py-4">
        <a href={`/?categorie=${photo.category}`} className={link}>
          ← {category?.label ?? "Retour"}
        </a>
        <a href={photo.src} target="_blank" rel="noreferrer" className={link}>
          Plein écran
        </a>
      </div>

      <div className="md:px-16">
        <img
          src={photo.src}
          alt={photo.alt}
          className="aspect-[4/3] w-full bg-muted object-cover md:aspect-[3/2]"
        />
      </div>
    </>
  );
}
