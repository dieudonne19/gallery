import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { cardRatio } from "../lib/masonry";
import type { Photo } from "../types";

interface PhotoThumbProps {
  photo: Photo;
  /** Rang dans la liste : sert à échelonner l'entrée des premières cartes (voir .photo-card dans globals.css). */
  index?: number;
  /** Photos visibles dès l'ouverture : chargées en priorité. */
  priority?: boolean;
  className?: string;
}

// Largeur affichée selon le nombre de colonnes (voir .masonry dans globals.css).
const SIZES = "(min-width: 1460px) 20vw, (min-width: 1060px) 25vw, (min-width: 640px) 33vw, 50vw";

export function PhotoThumb({ photo, index = 0, priority = false, className }: PhotoThumbProps) {
  return (
    <figure className={cn("photo-card flex flex-col", className)} style={{ "--i": index } as React.CSSProperties}>
      <Link
        href={`/photos/${photo.id}`}
        style={{ aspectRatio: cardRatio(photo) }}
        className="group relative isolate block overflow-hidden rounded-xl bg-muted"
      >
        {/* Le conteneur porte l'entrée (la photo se dépose) ; l'image garde le zoom au survol. */}
        <span className="photo-card-image absolute inset-0 block">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority={priority}
            sizes={SIZES}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        </span>
        <span className="masonry-overlay absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between bg-gradient-to-t from-foreground/55 to-transparent p-3 text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none">
          <span>{photo.title}</span>
          <span className="text-xs font-medium uppercase tracking-[0.12em]">Voir</span>
        </span>
      </Link>
      {/* Grille étroite (mobile) : pas de survol, la légende reste visible. Hauteur fixe : la mosaïque en tient compte. */}
      <figcaption className="masonry-caption justify-between gap-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        <span className="truncate">{photo.place ?? photo.title}</span>
        {photo.year ? <span>{photo.year}</span> : null}
      </figcaption>
    </figure>
  );
}
