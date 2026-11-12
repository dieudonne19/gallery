import { Suspense } from "react";

import type { Photo } from "@/features/photos/types";
import { PhotoDetail } from "./PhotoDetail";
import { PhotoNav } from "./PhotoNav";
import { RelatedPhotos, RelatedPhotosSkeleton } from "./RelatedPhotos";

interface PhotoPageProps {
  photo: Photo;
  prev: Photo;
  next: Photo;
}

/** Page complète d'une photo (lien partagé, rechargement) : la même grande vue que la fenêtre de la galerie. */
export function PhotoPage({ photo, prev, next }: PhotoPageProps) {
  return (
    <>
      <div className="md:px-8 md:pt-8">
        <PhotoDetail photo={photo} />
      </div>
      <PhotoNav prev={prev} next={next} />
      <Suspense fallback={<RelatedPhotosSkeleton />}>
        <RelatedPhotos photoId={photo.id} />
      </Suspense>
    </>
  );
}
