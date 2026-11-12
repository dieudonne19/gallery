"use client"

import { ShareIcon } from "lucide-react"
import { toast } from "sonner"

/** Partage l'adresse de la page (feuille de partage du téléphone, sinon copie du lien). */
export function ShareButton({ title, className }: { title: string; className?: string }) {
  async function share() {
    const url = window.location.href
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
    <button type="button" onClick={share} aria-label="Partager" title="Partager" className={className}>
      <ShareIcon aria-hidden="true" className="size-5" />
    </button>
  )
}
