"use client"

import { useEffect, useOptimistic, useRef, useState, useTransition } from "react"
import { toast } from "sonner"

import { moveItem } from "./same-order-set"

interface Options<T> {
  /** Enregistre le nouvel ordre (action serveur). En cas d'erreur, l'ancien ordre revient. */
  save: (ids: string[]) => Promise<{ error?: string }>
  /** Nom d'un élément, pour les annonces aux lecteurs d'écran. */
  label: (item: T) => string
}

type Drag = {
  id: string
  from: number
  to: number
  startY: number
  rows: HTMLElement[]
  /** Milieu vertical de chaque ligne au début du geste (coordonnées de la page). */
  middles: number[]
  height: number
}

/**
 * Réordonner une liste dans l'administration :
 * - glisser-déposer à la souris ou au doigt, par la poignée de chaque ligne (Pointer Events, sans bibliothèque) ;
 * - au clavier, sur la poignée : ↑ / ↓ déplacent d'un rang, Début / Fin envoient en tête ou en fin de liste ;
 * - mise à jour immédiate à l'écran, une seule requête au serveur ; en cas d'échec, l'ancien ordre revient (toast).
 * Le nouveau rang est annoncé aux lecteurs d'écran (`announcement`, à placer dans une zone aria-live).
 */
export function useReorder<T extends { id: string }>(items: T[], { save, label }: Options<T>) {
  const [ordered, setOrdered] = useOptimistic(items)
  const [announcement, setAnnouncement] = useState("")
  const [pending, startTransition] = useTransition()
  const list = useRef<HTMLElement | null>(null)
  const drag = useRef<Drag | null>(null)
  const refocus = useRef<string | null>(null)

  // Après un déplacement au clavier, la poignée de la ligne déplacée garde le focus.
  useEffect(() => {
    if (!refocus.current) return
    list.current?.querySelector<HTMLElement>(`[data-sort-handle="${CSS.escape(refocus.current)}"]`)?.focus()
    refocus.current = null
  })

  function commit(from: number, to: number) {
    if (from === to || to < 0 || to >= ordered.length) return
    const next = moveItem(ordered, from, to)
    const moved = ordered[from]
    setAnnouncement(`« ${label(moved)} » : place ${to + 1} sur ${next.length}.`)
    startTransition(async () => {
      setOrdered(next)
      try {
        const result = await save(next.map((item) => item.id))
        if (result.error) {
          toast.error(result.error)
          setAnnouncement("Le nouvel ordre n’a pas été enregistré.")
        }
      } catch {
        toast.error("Le nouvel ordre n’a pas pu être enregistré. Réessayez.")
        setAnnouncement("Le nouvel ordre n’a pas été enregistré.")
      }
    })
  }

  function move(id: string, to: number) {
    commit(
      ordered.findIndex((item) => item.id === id),
      to,
    )
  }

  function reset(state: Drag) {
    for (const row of state.rows) {
      row.style.transform = ""
      row.style.transition = ""
      row.style.position = ""
      row.style.zIndex = ""
      row.style.boxShadow = ""
      row.removeAttribute("data-dragging")
    }
  }

  function handleProps(item: T) {
    const index = ordered.findIndex((i) => i.id === item.id)
    return {
      "data-sort-handle": item.id,
      "aria-label": `Déplacer « ${label(item)} » (place ${index + 1} sur ${ordered.length}). Flèches haut et bas pour changer de place.`,
      // Le doigt sur la poignée déplace la ligne au lieu de faire défiler la page.
      style: { touchAction: "none" } as React.CSSProperties,

      onKeyDown(event: React.KeyboardEvent) {
        const to =
          event.key === "ArrowUp" ? index - 1
          : event.key === "ArrowDown" ? index + 1
          : event.key === "Home" ? 0
          : event.key === "End" ? ordered.length - 1
          : null
        if (to === null) return
        event.preventDefault()
        refocus.current = item.id
        commit(index, to)
      },

      onPointerDown(event: React.PointerEvent<HTMLElement>) {
        if (event.button !== 0 || pending || !list.current) return
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        const rows = [...list.current.querySelectorAll<HTMLElement>("[data-sort-row]")]
        const middles = rows.map((row) => {
          const rect = row.getBoundingClientRect()
          return rect.top + window.scrollY + rect.height / 2
        })
        const dragged = rows[index]
        if (!dragged) return
        drag.current = {
          id: item.id,
          from: index,
          to: index,
          startY: event.clientY + window.scrollY,
          rows,
          middles,
          height: dragged.getBoundingClientRect().height,
        }
        dragged.setAttribute("data-dragging", "")
        dragged.style.position = "relative"
        dragged.style.zIndex = "10"
        dragged.style.boxShadow = "var(--shadow-card)"
        for (const row of rows) if (row !== dragged) row.style.transition = "transform 150ms ease-out"
      },

      onPointerMove(event: React.PointerEvent<HTMLElement>) {
        const state = drag.current
        if (!state) return
        // Près du bord de l'écran, la page défile pour atteindre les lignes cachées.
        if (event.clientY < 80) window.scrollBy(0, -16)
        else if (event.clientY > window.innerHeight - 80) window.scrollBy(0, 16)

        const y = event.clientY + window.scrollY
        const dy = y - state.startY
        state.rows[state.from].style.transform = `translateY(${dy}px)`

        // Nouvelle place : nombre de lignes dont le milieu est passé au-dessus du milieu de la ligne tirée.
        const center = state.middles[state.from] + dy
        let to = 0
        state.middles.forEach((middle, i) => {
          if (i !== state.from && middle < center) to++
        })
        state.to = to
        state.rows.forEach((row, i) => {
          if (i === state.from) return
          const shift = i > state.from && i <= to ? -state.height : i < state.from && i >= to ? state.height : 0
          row.style.transform = shift ? `translateY(${shift}px)` : ""
        })
      },

      onPointerUp() {
        const state = drag.current
        if (!state) return
        drag.current = null
        reset(state)
        refocus.current = state.id
        commit(state.from, state.to)
      },

      onPointerCancel() {
        const state = drag.current
        if (!state) return
        drag.current = null
        reset(state)
      },
    }
  }

  /** À poser sur l'élément qui contient les lignes (chaque ligne porte data-sort-row). */
  const listRef = (element: HTMLElement | null) => {
    list.current = element
  }

  return { items: ordered, move, handleProps, listRef, announcement, pending }
}
