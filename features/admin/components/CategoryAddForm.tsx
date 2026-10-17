"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCategory, type CategoryFormState } from "../actions/categories"

export function CategoryAddForm() {
  const [state, formAction, pending] = useActionState<CategoryFormState, FormData>(createCategory, {})

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <Label htmlFor="new-category">Nouvelle catégorie</Label>
      <div className="flex flex-wrap items-center gap-3">
        <Input
          id="new-category"
          name="label"
          required
          maxLength={40}
          autoComplete="off"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "new-category-error" : undefined}
          className="h-11 w-full max-w-72"
        />
        <Button type="submit" disabled={pending} className="h-11 px-6 text-base">
          {pending ? "Ajout en cours…" : "Ajouter la catégorie"}
        </Button>
      </div>
      {state.error ? (
        <p id="new-category-error" role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
    </form>
  )
}
