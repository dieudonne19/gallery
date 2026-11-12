"use client"

import Image from "next/image"
import { useLayoutEffect, useRef } from "react"

import { takeOpenedThumb } from "@/features/photos/lib/opened-thumb"
import type { Photo } from "@/features/photos/types"

/**
 * La photo entière, à son format, jamais plus haute que l'écran.
 * Ouverte depuis la galerie, elle s'agrandit à partir de la carte cliquée (sauf si l'animation est réduite).
 */
export function DetailImage({ photo }: { photo: Photo }) {
  const ref = useRef<HTMLImageElement>(null)

  // Avant le premier affichage : la photo part exactement de la place de la carte, sans clignoter.
  useLayoutEffect(() => {
    const from = takeOpenedThumb(photo.id)
    const image = ref.current
    if (!image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // Sans carte de départ (photo voisine, page ouverte directement) : simple fondu.
    if (!from) {
      image.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: "ease-out" })
      return
    }
    const to = image.getBoundingClientRect()
    if (!to.width || !to.height) return

    // Le cadre de la photo la rogne (coins arrondis) : pendant l'agrandissement, elle doit pouvoir en sortir.
    const frame = image.parentElement
    if (frame) frame.style.overflow = "visible"
    const animation = image.animate(
      [
        {
          transformOrigin: "top left",
          transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
          borderRadius: "12px",
        },
        { transformOrigin: "top left", transform: "none", borderRadius: "0px" },
      ],
      { duration: 420, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
    )
    const restore = () => frame?.style.removeProperty("overflow")
    animation.onfinish = restore
    animation.oncancel = restore
  }, [photo.id])

  return (
    <Image
      ref={ref}
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      priority
      sizes="(min-width: 1100px) 660px, (min-width: 768px) 60vw, 100vw"
      className="h-auto max-h-[85svh] w-full object-contain md:w-auto md:max-w-full"
    />
  )
}
