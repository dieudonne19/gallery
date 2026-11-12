import { cache } from "react";

import { sql } from "@/lib/db";
import { getPhotoUrl } from "@/lib/storage";
import type { CategoryId, Photo } from "../types";
import { encodeCursor, type PhotoCursor } from "./cursor";
import { searchPatterns } from "./search";

/** Nombre de photos par paquet dans la galerie (le premier paquet est rendu par le serveur). */
export const PAGE_SIZE = 24;

interface PhotoRow {
  id: string;
  src: string;
  title: string;
  alt: string;
  category: CategoryId;
  categoryLabel: string;
  place: string | null;
  year: number | null;
  width: number;
  height: number;
  color: string | null;
}

// Les colonnes facultatives vides (null en base) deviennent absentes ; src devient une URL affichable.
async function toPhoto(row: PhotoRow): Promise<Photo> {
  return {
    id: row.id,
    src: await getPhotoUrl(row.src),
    title: row.title,
    alt: row.alt,
    category: row.category,
    categoryLabel: row.categoryLabel,
    width: row.width,
    height: row.height,
    place: row.place ?? undefined,
    year: row.year ?? undefined,
    color: row.color ?? undefined,
  };
}

const toPhotos = (rows: Record<string, unknown>[]) => Promise.all((rows as unknown as PhotoRow[]).map(toPhoto));

/**
 * Toutes les photos, dans l'ordre de la galerie : pour l'administration seulement.
 * Le site public charge les photos par paquets (getPhotoPage) : signer toutes les URL à chaque visite coûterait cher.
 */
export async function getAllPhotos(): Promise<Photo[]> {
  const rows = await sql`
    select p.id, p.src, p.title, p.alt, p.category, c.label as "categoryLabel", p.place, p.year, p.width, p.height, p.color
    from photos p
    join categories c on c.id = p.category
    order by p.position, p.created_at desc, p.id`;
  return toPhotos(rows);
}

export interface PhotoPage {
  photos: Photo[];
  /** À passer à l'appel suivant ; absent quand il n'y a plus de photos. */
  nextCursor?: string;
}

/**
 * Recherche : chaque mot doit apparaître dans le titre, le lieu, la description, l'année ou le nom de la catégorie,
 * sans tenir compte des accents ni des majuscules. À cette échelle (quelques centaines de photos), un parcours
 * complet prend moins d'une milliseconde : un index de recherche n'apporterait rien.
 */

/**
 * Un paquet de photos de la galerie, éventuellement filtré par catégorie et par recherche. Sans curseur : le début.
 * L'ordre (position, date d'ajout récente d'abord, id) est total : le curseur désigne une place exacte.
 */
export async function getPhotoPage({
  category,
  search,
  cursor,
  limit = PAGE_SIZE,
}: {
  category?: CategoryId;
  search?: string;
  cursor?: PhotoCursor | null;
  limit?: number;
}): Promise<PhotoPage> {
  const patterns = searchPatterns(search);
  const rows = await sql`
    select p.id, p.src, p.title, p.alt, p.category, c.label as "categoryLabel", p.place, p.year, p.width, p.height, p.color,
           p.position, p.created_at::text as "createdAt"
    from photos p
    join categories c on c.id = p.category
    where (${category ?? null}::text is null or p.category = ${category ?? null})
      and not exists (
        select 1 from unnest(${patterns}::text[]) as w(pattern)
        where unaccent(lower(concat_ws(' ', p.title, p.place, p.alt, p.year, c.label)))
          not like unaccent(lower(w.pattern)) escape '\\'
      )
      and (
        ${cursor ? 1 : null}::int is null
        or p.position > ${cursor?.position ?? 0}
        or (p.position = ${cursor?.position ?? 0} and (
          p.created_at < ${cursor?.createdAt ?? null}::timestamptz
          or (p.created_at = ${cursor?.createdAt ?? null}::timestamptz and p.id > ${cursor?.id ?? ""})
        ))
      )
    order by p.position, p.created_at desc, p.id
    limit ${limit + 1}`;

  // Une ligne de plus que demandé : elle indique seulement qu'il reste des photos après ce paquet.
  const page = rows.slice(0, limit);
  const last = page.at(-1);
  const nextCursor =
    rows.length > limit && last
      ? encodeCursor({ position: last.position as number, createdAt: last.createdAt as string, id: last.id as string })
      : undefined;
  return { photos: await toPhotos(page), nextCursor };
}

/** Nombre de photos de la galerie (ou d'une catégorie, ou d'une recherche : mêmes règles que getPhotoPage). */
export async function getPhotoCount({ category, search }: { category?: CategoryId; search?: string } = {}): Promise<number> {
  const patterns = searchPatterns(search);
  const [row] = await sql`
    select count(*)::int as count
    from photos p
    join categories c on c.id = p.category
    where (${category ?? null}::text is null or p.category = ${category ?? null})
      and not exists (
        select 1 from unnest(${patterns}::text[]) as w(pattern)
        where unaccent(lower(concat_ws(' ', p.title, p.place, p.alt, p.year, c.label)))
          not like unaccent(lower(w.pattern)) escape '\\'
      )`;
  return row.count as number;
}

/** Clé du fichier dans le bucket (sans URL signée) : pour les routes qui lisent la photo elles-mêmes. */
export async function getPhotoKey(id: string): Promise<string | undefined> {
  const [row] = await sql`select src from photos where id = ${id}`;
  return row?.src as string | undefined;
}

/** Identifiant et date d'ajout de chaque photo, sans signer les URLs : pour le plan du site. */
export async function getPhotoDates(): Promise<{ id: string; createdAt: Date }[]> {
  const rows = await sql`select id, created_at from photos order by position, created_at desc, id`;
  return rows.map((r) => ({ id: r.id as string, createdAt: new Date(r.created_at as string) }));
}

// cache() : la page et ses métadonnées demandent la même photo, une seule requête par rendu.
export const getPhotoById = cache(async (id: string): Promise<Photo | undefined> => {
  const rows = await sql`
    select p.id, p.src, p.title, p.alt, p.category, c.label as "categoryLabel", p.place, p.year, p.width, p.height, p.color
    from photos p
    join categories c on c.id = p.category
    where p.id = ${id}`;
  const [photo] = await toPhotos(rows);
  return photo;
});

/**
 * Photos proches d'une photo, pour « Plus de photos comme celle-ci » : d'abord la même catégorie,
 * puis le même lieu, puis la même année, et les plus récentes pour compléter. La photo elle-même est exclue.
 */
export async function getRelatedPhotos(id: string, limit = 12): Promise<Photo[]> {
  const rows = await sql`
    select p.id, p.src, p.title, p.alt, p.category, c.label as "categoryLabel", p.place, p.year, p.width, p.height, p.color
    from photos p
    join categories c on c.id = p.category
    cross join (select category, place, year from photos where id = ${id}) t
    where p.id <> ${id}
    order by
      (case when p.category = t.category then 4 else 0 end)
        + (case when p.place is not null and p.place = t.place then 2 else 0 end)
        + (case when p.year = t.year then 1 else 0 end) desc,
      p.position, p.created_at desc, p.id
    limit ${limit}`;
  return toPhotos(rows);
}

/** Photo précédente et suivante dans l'ordre de la galerie (la liste boucle). Seules ces deux photos sont lues. */
export async function getAdjacentPhotos(id: string): Promise<{ prev: Photo; next: Photo } | null> {
  const rows = await sql`
    with ordered as (
      select id, row_number() over (order by position, created_at desc, id) as rank, count(*) over () as total
      from photos
    ),
    target as (select rank, total from ordered where id = ${id})
    select o.id, case when o.rank = (t.rank - 2 + t.total) % t.total + 1 then 'prev' else 'next' end as side
    from ordered o, target t
    where o.rank in ((t.rank - 2 + t.total) % t.total + 1, t.rank % t.total + 1)`;
  if (rows.length === 0) return null;

  const prevId = (rows.find((r) => r.side === "prev") ?? rows[0]).id as string;
  const nextId = (rows.find((r) => r.side === "next") ?? rows[0]).id as string;
  const [prev, next] = await Promise.all([getPhotoById(prevId), getPhotoById(nextId)]);
  return prev && next ? { prev, next } : null;
}
