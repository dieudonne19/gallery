import { cache } from "react";

import { sql } from "@/lib/db";
import { getPhotoUrl } from "@/lib/storage";
import { CATEGORIES } from "../data/categories";
import type { CategoryId, Photo } from "../types";

interface PhotoRow {
  id: string;
  src: string;
  title: string;
  alt: string;
  category: CategoryId;
  place: string | null;
  year: number | null;
}

// Les colonnes facultatives vides (null en base) deviennent absentes ; src devient une URL affichable.
async function toPhoto(row: PhotoRow): Promise<Photo> {
  return { ...row, src: await getPhotoUrl(row.src), place: row.place ?? undefined, year: row.year ?? undefined };
}

// cache() : une seule requête par rendu, même si plusieurs composants la demandent.
const getAllPhotos = cache(async (): Promise<Photo[]> => {
  const rows = await sql`
    select id, src, title, alt, category, place, year
    from photos
    order by position, created_at desc`;
  return Promise.all((rows as PhotoRow[]).map(toPhoto));
});

export async function getPhotos(category?: CategoryId): Promise<Photo[]> {
  const photos = await getAllPhotos();
  return category ? photos.filter((p) => p.category === category) : photos;
}

export async function getPhotoById(id: string): Promise<Photo | undefined> {
  return (await getAllPhotos()).find((p) => p.id === id);
}

/** Photo précédente et suivante (la liste boucle). */
export async function getAdjacentPhotos(id: string): Promise<{ prev: Photo; next: Photo } | null> {
  const photos = await getAllPhotos();
  const index = photos.findIndex((p) => p.id === id);
  if (index === -1) return null;
  return {
    prev: photos[(index - 1 + photos.length) % photos.length],
    next: photos[(index + 1) % photos.length],
  };
}

export function isCategoryId(value: string | undefined): value is CategoryId {
  return CATEGORIES.some((c) => c.id === value);
}
