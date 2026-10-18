import Image from "next/image"

import { cn } from "@/lib/utils"
import { SITE_NAME } from "./nav"

/** Logo « Hitako » (tracés, sans fond : à poser sur le fond clair du site). L'alt sert de nom au lien qui l'entoure. */
export function Logo({ className }: { className?: string }) {
  // unoptimized : un SVG n'a rien à gagner à passer par l'optimiseur d'images.
  return (
    <Image src="/logo-hitako.svg" alt={SITE_NAME} width={295} height={89} unoptimized priority className={cn("h-6 w-auto", className)} />
  )
}
