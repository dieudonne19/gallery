"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState, useTransition } from "react"

import { loadMorePhotos } from "@/features/photos/actions/load-more"
import { PhotoGrid } from "@/features/photos/components/PhotoGrid"
import type { Photo } from "@/features/photos/types"

interface InfiniteGalleryProps {
  initialPhotos: Photo[]
  initialCursor?: string
  category?: string
  /** Lien « Voir plus » sans JavaScript : la même page avec un paquet de plus, rendue par le serveur. */
  moreHref: string
}

/**
 * Fil sans fin : le serveur rend le premier paquet, les suivants arrivent à l'approche du bas de la page.
 * Les nouvelles cartes s'ajoutent à la mosaïque sans déplacer celles déjà affichées (le placement d'une carte
 * ne dépend que des cartes qui la précèdent). Sans JavaScript, le lien « Voir plus » recharge la page avec plus de photos.
 */
export function InfiniteGallery({ initialPhotos, initialCursor, category, moreHref }: InfiniteGalleryProps) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [cursor, setCursor] = useState(initialCursor)
  const [failed, setFailed] = useState(false)
  const [pending, startTransition] = useTransition()
  const sentinel = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(() => {
    if (!cursor || pending) return
    setFailed(false)
    startTransition(async () => {
      try {
        const page = await loadMorePhotos(cursor, category)
        setPhotos((current) => {
          // Une photo déjà affichée (ordre changé entre-temps dans l'administration) n'est pas ajoutée deux fois.
          const seen = new Set(current.map((p) => p.id))
          return [...current, ...page.photos.filter((p) => !seen.has(p.id))]
        })
        setCursor(page.nextCursor)
      } catch {
        setFailed(true)
      }
    })
  }, [cursor, category, pending])

  // Le paquet suivant se charge un peu avant d'atteindre le bas : le défilement ne bute pas.
  useEffect(() => {
    const element = sentinel.current
    if (!element || !cursor || failed) return
    const observer = new IntersectionObserver((entries) => entries[0]?.isIntersecting && loadMore(), {
      rootMargin: "0px 0px 1200px 0px",
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [cursor, failed, loadMore])

  return (
    <>
      <PhotoGrid photos={photos} />
      <div ref={sentinel} className="flex min-h-24 flex-col items-center justify-center gap-2 pt-8">
        <p role="status" className="sr-only">
          {pending ? "Chargement de nouvelles photos…" : `${photos.length} photos affichées`}
        </p>
        {failed ? <p className="text-muted-foreground">Les photos suivantes n’ont pas pu être chargées.</p> : null}
        {cursor ? (
          <Link
            href={moreHref}
            scroll={false}
            onClick={(event) => {
              event.preventDefault()
              loadMore()
            }}
            aria-disabled={pending || undefined}
            className="inline-flex min-h-12 items-center rounded-full bg-secondary px-6 font-medium transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)]"
          >
            {pending ? "Chargement…" : failed ? "Réessayer" : "Voir plus de photos"}
          </Link>
        ) : null}
      </div>
    </>
  )
}
