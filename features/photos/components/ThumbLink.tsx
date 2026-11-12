"use client"

import Link from "next/link"
import { useContext } from "react"

import { InPhotoModal } from "../lib/in-modal"
import { rememberOpenedThumb } from "../lib/opened-thumb"

/**
 * Lien d'une carte de la galerie. Retient la position de la carte pour que la photo s'agrandisse depuis elle,
 * et ne fait pas remonter la page : la photo s'ouvre par-dessus la galerie, qui garde sa position.
 */
export function ThumbLink({ photoId, ...props }: React.ComponentProps<typeof Link> & { photoId: string }) {
  const inModal = useContext(InPhotoModal)
  return (
    <Link
      {...props}
      replace={inModal}
      scroll={false}
      onClick={(event) => {
        rememberOpenedThumb(photoId, event.currentTarget)
        props.onClick?.(event)
      }}
    />
  )
}
