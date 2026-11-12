"use client"

import { ChevronDown, ChevronUp, GripVertical } from "lucide-react"
import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AdminCategory } from "@/features/categories/lib/queries"
import { deleteCategory, renameCategory, type CategoryFormState } from "../actions/categories"
import { ConfirmDeleteButton } from "./ConfirmDeleteButton"

interface CategoryRowProps {
  category: AdminCategory
  isFirst: boolean
  isLast: boolean
  /** Monter (-1) ou descendre (+1) d'un rang. */
  onMove: (step: -1 | 1) => void
  /** Poignée de glisser-déposer (voir useReorder). */
  handleProps: React.ComponentProps<"button">
}

const photosLabel = (n: number) => (n === 0 ? "Aucune photo" : n === 1 ? "1 photo" : `${n} photos`)

export function CategoryRow({ category, isFirst, isLast, onMove, handleProps }: CategoryRowProps) {
  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(
    renameCategory.bind(null, category.id),
    {},
  )
  const inputId = `category-${category.id}`
  const hintId = `${inputId}-hint`
  const canDelete = category.photoCount === 0

  return (
    <li data-sort-row className="flex flex-wrap items-start gap-x-4 gap-y-2 border-t border-border bg-background py-4">
      <div className="flex">
        <button
          type="button"
          className="flex size-11 cursor-grab items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:cursor-grabbing"
          {...handleProps}
        >
          <GripVertical aria-hidden="true" className="size-5" />
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isFirst}
          onClick={() => onMove(-1)}
          aria-label={`Monter « ${category.label} »`}
          className="size-11"
        >
          <ChevronUp />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isLast}
          onClick={() => onMove(1)}
          aria-label={`Descendre « ${category.label} »`}
          className="size-11"
        >
          <ChevronDown />
        </Button>
      </div>

      <form action={formAction} className="flex min-w-64 flex-1 flex-col gap-1">
        <Label htmlFor={inputId} className="sr-only">
          Nom de la catégorie
        </Label>
        <div className="flex gap-2">
          <Input
            id={inputId}
            name="label"
            defaultValue={category.label}
            required
            maxLength={40}
            autoComplete="off"
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? `${inputId}-error` : undefined}
            className="h-11"
          />
          <Button type="submit" variant="outline" disabled={pending} className="h-11">
            Renommer
          </Button>
        </div>
        {state.error ? (
          <p id={`${inputId}-error`} role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        ) : null}
      </form>

      <div className="flex min-h-11 flex-col justify-center sm:w-44">
        <span>{photosLabel(category.photoCount)}</span>
        {canDelete ? null : (
          <span id={hintId} className="text-sm text-muted-foreground">
            Déplacez-les pour la supprimer.
          </span>
        )}
      </div>

      {canDelete ? (
        <ConfirmDeleteButton
          ariaLabel={`Supprimer « ${category.label} »`}
          title={`Supprimer « ${category.label} » ?`}
          description="La catégorie disparaît du filtre de l’accueil. Cette action est définitive."
          cancelLabel="Garder la catégorie"
          confirmLabel="Supprimer la catégorie"
          action={deleteCategory.bind(null, category.id)}
        />
      ) : (
        <Button variant="ghost" disabled aria-describedby={hintId} className="h-11 text-destructive">
          Supprimer
        </Button>
      )}
    </li>
  )
}
