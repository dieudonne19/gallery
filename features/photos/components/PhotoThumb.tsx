import { ExpandIcon } from "lucide-react";

import { ShareButton } from "@/features/photo/components/ShareButton";
import { cn } from "@/lib/utils";
import { cardRatio } from "../lib/masonry";
import type { Photo } from "../types";
import { FadeInImage } from "./FadeInImage";
import { ThumbLink } from "./ThumbLink";

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

const cardAction =
  "inline-flex size-11 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm transition-colors hover:bg-white";

/**
 * Carte de la mosaïque : la photo seule, coins arrondis. Au survol (souris) : voile léger, boutons ronds
 * (partager, plein écran) et titre. À l'appui, la carte se tasse un peu avant de s'ouvrir.
 */
export function PhotoThumb({ photo, index = 0, priority = false, className }: PhotoThumbProps) {
  return (
    <figure className={cn("photo-card group/card flex flex-col", className)} style={{ "--i": index } as React.CSSProperties}>
      <div
        // Couleur dominante de la photo en attendant qu'elle se charge (bg-muted si elle n'est pas connue).
        style={{ aspectRatio: cardRatio(photo), backgroundColor: photo.color }}
        className="relative isolate overflow-hidden rounded-2xl bg-muted transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none"
      >
        <ThumbLink href={`/photos/${photo.id}`} photoId={photo.id} className="absolute inset-0 block rounded-2xl">
          {/* Le conteneur porte l'entrée (la photo se dépose dans sa carte). */}
          <span className="photo-card-image absolute inset-0 block">
            <FadeInImage src={photo.src} alt={photo.alt} fill priority={priority} sizes={SIZES} className="object-cover" />
          </span>
        </ThumbLink>

        {/* Survol : le voile laisse passer le clic vers la photo, seuls les boutons le captent. */}
        <div className="masonry-overlay pointer-events-none absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-200 group-focus-within/card:opacity-100 group-hover/card:opacity-100 motion-reduce:transition-none">
          <div className="pointer-events-auto absolute top-3 right-3 flex gap-2">
            <ShareButton title={photo.title} path={`/photos/${photo.id}`} className={cardAction} />
            <a
              href={photo.src}
              target="_blank"
              rel="noreferrer"
              aria-label={`Voir « ${photo.title} » en plein écran (nouvel onglet)`}
              title="Plein écran"
              className={cardAction}
            >
              <ExpandIcon aria-hidden="true" className="size-5" />
            </a>
          </div>
          <p className="absolute right-3 bottom-3 left-3 truncate text-sm font-semibold text-white">
            {photo.place ?? photo.title}
          </p>
        </div>
      </div>
      {/* Grille étroite (mobile) : pas de survol, le titre reste visible sous la photo. Hauteur fixe : la mosaïque en tient compte. */}
      <figcaption className="masonry-caption gap-2 text-sm font-medium">
        <span className="truncate">{photo.title}</span>
      </figcaption>
    </figure>
  );
}
