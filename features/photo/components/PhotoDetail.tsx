import { ApertureIcon, ExpandIcon, MailIcon, MapPinIcon } from "lucide-react"
import Link from "next/link"

import { formatShooting } from "@/features/photos/lib/shooting"
import type { Photo } from "@/features/photos/types"
import { DetailImage } from "./DetailImage"
import { ShareButton } from "./ShareButton"

interface PhotoDetailProps {
  photo: Photo
  /** h1 sur la page de la photo ; h2 dans la fenêtre ouverte par-dessus la galerie (la page a déjà son h1). */
  headingLevel?: 1 | 2
}

/** Bouton rond (partager, plein écran) : cible de 44 px. */
export const roundAction =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)]"

export const photoTitleId = (id: string) => `photo-title-${id}`

/**
 * Grande vue d'une photo : la photo d'un côté, ses informations de l'autre (l'une sous l'autre sur mobile).
 * Sert à la page de la photo et à la fenêtre qui s'ouvre par-dessus la galerie.
 */
export function PhotoDetail({ photo, headingLevel = 1 }: PhotoDetailProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2"
  // Lieu et année sont facultatifs : on n'affiche que ce qui existe.
  const meta = [photo.place, photo.year].filter(Boolean).join(" · ")
  const shooting = formatShooting(photo.shooting)

  return (
    <article className="mx-auto grid w-full max-w-[1100px] bg-card md:grid-cols-[minmax(0,3fr)_minmax(300px,2fr)] md:rounded-[32px] md:shadow-[0_1px_20px_rgb(0_0_0/0.1)]">
      <div
        className="flex items-center justify-center overflow-hidden bg-muted md:rounded-l-[32px]"
        style={{ backgroundColor: photo.color }}
      >
        <DetailImage photo={photo} />
      </div>

      <div className="photo-detail-info flex flex-col gap-6 p-5 md:p-8">
        <div className="flex items-center gap-2">
          <ShareButton title={photo.title} className={roundAction} />
          <a
            href={photo.src}
            target="_blank"
            rel="noreferrer"
            aria-label="Voir la photo en plein écran (nouvel onglet)"
            title="Plein écran"
            className={roundAction}
          >
            <ExpandIcon aria-hidden="true" className="size-5" />
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href={`/?categorie=${photo.category}`}
            className="inline-flex min-h-11 w-fit items-center rounded-full bg-secondary px-4 text-sm font-medium"
          >
            {photo.categoryLabel}
          </Link>
          <Heading id={photoTitleId(photo.id)} className="text-balance text-[28px] font-semibold leading-tight tracking-tight md:text-4xl">
            {photo.title}
          </Heading>
          {meta ? (
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPinIcon aria-hidden="true" className="size-4 shrink-0" />
              {meta}
            </p>
          ) : null}
          {shooting ? (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <ApertureIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <p>
                <span className="sr-only">Prise de vue : </span>
                {shooting.settings}
                {shooting.lens ? (
                  <>
                    {shooting.settings ? <br /> : null}
                    {shooting.lens}
                  </>
                ) : null}
              </p>
            </div>
          ) : null}
        </div>

        <Link
          href={`/contact?photo=${encodeURIComponent(photo.id)}`}
          className="mt-auto inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-primary/85"
        >
          <MailIcon aria-hidden="true" className="size-4" />
          Écrire à propos de cette photo
        </Link>
      </div>
    </article>
  )
}
