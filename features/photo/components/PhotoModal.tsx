"use client"

import { Dialog } from "@base-ui/react/dialog"
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { InPhotoModal } from "@/features/photos/lib/in-modal"

interface PhotoModalProps {
  children: React.ReactNode
  photoId: string
  /** Id du titre de la photo : nom de la fenêtre pour les lecteurs d'écran. */
  labelledBy: string
  prevId: string
  nextId: string
}

const sideButton =
  "fixed top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-md transition-transform hover:scale-105 md:flex"

/**
 * Fenêtre qui affiche une photo par-dessus la galerie (route interceptée, voir app/(site)/(gallery)/@modal).
 * L'adresse devient celle de la photo : un lien partagé ou un rechargement ouvre la page complète.
 * Fermeture : Échap, ✕, clic à côté ou retour du navigateur. ← et → passent à la photo voisine.
 */
export function PhotoModal({
  children,
  photoId,
  labelledBy,
  prevId,
  nextId,
}: PhotoModalProps) {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const viewport = useRef<HTMLDivElement>(null)

  // Nouvelle photo dans la même fenêtre (voisine, suggestion) : on repart du haut.
  useEffect(() => {
    viewport.current?.scrollTo({ top: 0 })
  }, [photoId])

  // Photo voisine : on remplace l'adresse (au lieu d'en ajouter une), pour que « retour » ferme la fenêtre.
  const go = (id: string) => router.replace(`/photos/${id}`, { scroll: false })

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        return
      const target = event.target as HTMLElement | null
      if (target?.closest("input, textarea, select, [contenteditable]")) return
      const id =
        event.key === "ArrowLeft"
          ? prevId
          : event.key === "ArrowRight"
            ? nextId
            : null
      if (!id) return
      event.preventDefault()
      router.replace(`/photos/${id}`, { scroll: false })
    }
    // Phase de capture : la fenêtre (Base UI) arrête la propagation des touches qui la traversent.
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [router, prevId, nextId])

  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}
      // Une fois l'animation de fermeture finie, on revient à la galerie (à la même position).
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) router.back()
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="photo-modal-backdrop fixed inset-0 z-50 bg-black/60" />
        {/* data-lenis-prevent : le défilement doux de la page ne doit pas agir derrière la fenêtre. */}
        <Dialog.Viewport
          ref={viewport}
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain"
          data-lenis-prevent
        >
          <Dialog.Popup
            aria-labelledby={labelledBy}
            className="photo-modal relative min-h-full bg-background outline-none md:mx-auto md:min-h-0 md:w-[calc(100%-10rem)] md:max-w-[1100px] md:bg-transparent md:py-10"
          >
            <Dialog.Close
              aria-label="Fermer"
              className="fixed top-3 left-3 z-10 flex size-12 items-center justify-center rounded-full bg-background text-foreground shadow-md transition-transform hover:scale-105 md:top-5 md:left-5"
            >
              <XIcon aria-hidden="true" className="size-6" />
            </Dialog.Close>
            <button
              type="button"
              aria-label="Photo précédente"
              onClick={() => go(prevId)}
              className={`${sideButton} left-5`}
            >
              <ChevronLeftIcon aria-hidden="true" className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Photo suivante"
              onClick={() => go(nextId)}
              className={`${sideButton} right-5`}
            >
              <ChevronRightIcon aria-hidden="true" className="size-6" />
            </button>
            <InPhotoModal value={true}>{children}</InPhotoModal>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
