import { PHOTOS } from "../data/photos";
import type { CategoryId, Photo } from "../types";

export function getPhotos(category?: CategoryId): Photo[] {
  return category ? PHOTOS.filter((p) => p.category === category) : PHOTOS;
}

export function getPhotoById(id: string): Photo | undefined {
  return PHOTOS.find((p) => p.id === id);
}

/** Photo précédente et suivante (la liste boucle). */
export function getAdjacentPhotos(id: string): { prev: Photo; next: Photo } | null {
  const index = PHOTOS.findIndex((p) => p.id === id);
  if (index === -1) return null;
  return {
    prev: PHOTOS[(index - 1 + PHOTOS.length) % PHOTOS.length],
    next: PHOTOS[(index + 1) % PHOTOS.length],
  };
}

export function isCategoryId(value: string | undefined): value is CategoryId {
  return !!value && ["collines", "cotes", "couchers-de-soleil", "ciels"].includes(value);
}
