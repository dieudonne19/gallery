"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"

import { cn } from "@/lib/utils"

/**
 * Image qui apparaît en fondu une fois chargée, par-dessus la couleur dominante de la photo (fond du parent).
 * Les images prioritaires (visibles dès l'ouverture) s'affichent sans attendre le script : pas de fondu pour elles,
 * sinon elles resteraient invisibles jusqu'à l'hydratation de la page. Sans JavaScript, app/layout.tsx les rend visibles.
 */
export function FadeInImage({ alt, className, onLoad, priority, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false)
  const hidden = !priority && !loaded

  return (
    <Image
      {...props}
      alt={alt}
      priority={priority}
      onLoad={(event) => {
        setLoaded(true)
        onLoad?.(event)
      }}
      className={cn(
        "fade-in-image transition-opacity duration-500 ease-out motion-reduce:transition-none",
        hidden && "opacity-0",
        className,
      )}
    />
  )
}
