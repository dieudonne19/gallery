"use client"

import type { AdminCategory } from "@/features/categories/lib/queries"
import { reorderCategories } from "../actions/categories"
import { useReorder } from "../lib/use-reorder"
import { CategoryRow } from "./CategoryRow"

/** Catégories dans l'ordre du filtre de l'accueil : on les réordonne en glissant une ligne, ou au clavier. */
export function CategoryList({ categories }: { categories: AdminCategory[] }) {
  const { items, move, handleProps, listRef, announcement } = useReorder(categories, {
    save: reorderCategories,
    label: (category) => category.label,
  })

  return (
    <>
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
      <ul ref={listRef} className="mt-10 max-w-4xl">
        {items.map((category, index) => (
          <CategoryRow
            key={category.id}
            category={category}
            isFirst={index === 0}
            isLast={index === items.length - 1}
            onMove={(step) => move(category.id, index + step)}
            handleProps={handleProps(category)}
          />
        ))}
      </ul>
    </>
  )
}
