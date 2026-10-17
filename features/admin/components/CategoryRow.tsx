"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AdminCategory } from "@/features/categories/lib/queries"
import { deleteCategory, moveCategory, renameCategory, type CategoryFormState } from "../actions/categories"
import { ConfirmDeleteButton } from "./ConfirmDeleteButton"

interface CategoryRowProps {
  category: AdminCategory
  isFirst: boolean
  isLast: boolean
}

const photosLabel = (n: number) => (n === 0 ? "Aucune photo" : n === 1 ? "1 photo" : `${n} photos`)

export function CategoryRow({ category, isFirst, isLast }: CategoryRowProps) {
  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(
    renameCategory.bind(null, category.id),
    {},
  )
  const inputId = `category-${category.id}`
  const hintId = `${inputId}-hint`
  const canDelete = category.photoCount === 0

  return (
    <li className="flex flex-wrap items-start gap-x-4 gap-y-2 border-t border-border py-4">
      <div className="flex">
        <form action={moveCategory.bind(null, category.id, "up")}>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={isFirst}
            aria-label={`Monter « ${category.label} »`}
            className="size-11"
          >
            <ChevronUp />
          </Button>
        </form>
        <form action={moveCategory.bind(null, category.id, "down")}>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={isLast}
            aria-label={`Descendre « ${category.label} »`}
            className="size-11"
          >
            <ChevronDown />
          </Button>
        </form>
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
