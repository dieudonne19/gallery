import { ArrowUpRight } from "lucide-react"

import { PORTFOLIO_URL } from "./nav"

/** Lien vers mon portfolio, dans un nouvel onglet : le texte caché le dit aux lecteurs d'écran. */
export function PortfolioLink({ className }: { className?: string }) {
  return (
    <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className={className}>
      Portfolio
      <ArrowUpRight className="ml-1 size-4" aria-hidden="true" />
      <span className="sr-only"> (nouvel onglet)</span>
    </a>
  )
}
