"use client"

import { ShareIcon } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
  title: string
  /** Adresse à partager (ex. /photos/ab12) ; par défaut, celle de la page. */
  path?: string
  className?: string
}

/** Partage une adresse (feuille de partage du téléphone, sinon copie du lien). */
export function ShareButton({ title, path, className }: ShareButtonProps) {
  async function share() {
    const url = path ? new URL(path, window.location.origin).href : window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        /* partage annulé */
      }
      return
    }
    await navigator.clipboard.writeText(url)
    toast.success("Lien copié")
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label={path ? `Partager « ${title} »` : "Partager"}
      title="Partager"
      className={className}
    >
      <ShareIcon aria-hidden="true" className="size-5" />
    </button>
  )
}
