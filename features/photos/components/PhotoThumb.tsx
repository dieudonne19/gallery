import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/shared/Eyebrow";
import type { Photo } from "../types";

interface PhotoThumbProps {
  photo: Photo;
  /** Grande vignette : remplit la hauteur de sa zone sur desktop. */
  fill?: boolean;
  /** Première photo visible : chargée en priorité. */
  priority?: boolean;
  className?: string;
}

export function PhotoThumb({ photo, fill = false, priority = false, className }: PhotoThumbProps) {
  return (
    <figure className={cn("flex flex-col", className)}>
      <Link
        href={`/photos/${photo.id}`}
        className={cn(
          "group relative block aspect-[3/2] overflow-hidden bg-muted",
          fill && "md:aspect-auto md:min-h-96 md:flex-1",
        )}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        <span className="absolute inset-x-0 bottom-0 hidden items-center justify-between bg-gradient-to-t from-foreground/55 to-transparent p-3 text-white opacity-0 transition-opacity group-hover:opacity-100 md:flex">
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
