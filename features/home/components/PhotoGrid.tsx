import { PhotoThumb } from "@/features/photos/components/PhotoThumb";
import type { Photo } from "@/features/photos/types";

/**
 * Grille en colonnes : chaque photo garde son format, verticale ou horizontale, sans recadrage.
 * Les photos se rangent colonne par colonne (la plus récente en haut à gauche).
 */
export function PhotoGrid({ photos }: { photos: Photo[] }) {
  return (
    <div className="columns-2 gap-3 md:gap-4 lg:columns-3">
      {photos.map((photo, index) => (
        <PhotoThumb
          key={photo.id}
          photo={photo}
          index={index}
          priority={index < 3}
          className="mb-3 break-inside-avoid md:mb-4"
        />
      ))}
    </div>
  );
}
