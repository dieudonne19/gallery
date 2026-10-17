import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/shared/Eyebrow";
import type { Photo } from "../types";

interface PhotoThumbProps {
  photo: Photo;
  /** Rang dans la liste : sert à échelonner l'entrée des premières cartes (voir .photo-card dans globals.css). */
  index?: number;
  /** Photos visibles dès l'ouverture : chargées en priorité. */
  priority?: boolean;
  className?: string;
}

// La carte garde le format réel de la photo (verticale, horizontale, carrée).
// Seuls les formats extrêmes sont légèrement recadrés, pour éviter une carte démesurée.
const cardRatio = ({ width, height }: Photo) => Math.min(Math.max(width / height, 0.66), 2);

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
            sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        </span>
        <span className="absolute inset-x-0 bottom-0 hidden translate-y-2 items-center justify-between bg-gradient-to-t from-foreground/55 to-transparent p-3 text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none md:flex">
          <span>{photo.title}</span>
          <span className="font-mono text-xs uppercase tracking-wider">Voir</span>
        </span>
      </Link>
      {/* Pas de survol sur mobile : la légende reste visible. */}
      <figcaption className="mt-2 flex justify-between gap-2 md:hidden">
        <Eyebrow>{photo.place ?? photo.title}</Eyebrow>
        {photo.year ? <Eyebrow>{photo.year}</Eyebrow> : null}
      </figcaption>
    </figure>
  );
}
