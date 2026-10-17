"use client"

import Image from "next/image"
import Link from "next/link"
import { useActionState, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Category, Photo } from "@/features/photos/types"
import { resizeForUpload } from "../lib/resize-image"
import type { PhotoField, PhotoFormState } from "../schemas"

interface PhotoFormProps {
  action: (state: PhotoFormState, formData: FormData) => Promise<PhotoFormState>
  /** Photo à modifier ; absente pour un ajout. */
  photo?: Photo
  categories: Category[]
}

function Field({
  name,
  label,
  hint,
  error,
  children,
}: {
  name: PhotoField
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      {hint ? (
        <p id={`${name}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${name}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function PhotoForm({ action, photo, categories }: PhotoFormProps) {
  const categoryItems = Object.fromEntries(categories.map((c) => [c.id, c.label]))
  const [state, formAction, pending] = useActionState(action, {})
  // Réduction de la photo dans le navigateur avant l'envoi (limite de 4,5 Mo de l'hébergeur).
  const [imageStatus, setImageStatus] = useState<{ preparing: boolean; message?: string }>({ preparing: false })
  const errors = state.errors ?? {}

  async function prepareImage(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) return setImageStatus({ preparing: false })

    setImageStatus({ preparing: true, message: "Préparation de la photo…" })
    const resized = await resizeForUpload(file)
    if (resized !== file) {
      const transfer = new DataTransfer()
      transfer.items.add(resized)
      input.files = transfer.files
    }
    const megabytes = (resized.size / 1048576).toFixed(1).replace(".", ",")
    setImageStatus({ preparing: false, message: `Photo prête (${megabytes} Mo).` })
  }
  const initial: Record<string, string> = {
    title: photo?.title ?? "",
    alt: photo?.alt ?? "",
    category: photo?.category ?? "",
    place: photo?.place ?? "",
    year: photo?.year ? String(photo.year) : "",
  }
  const value = (name: string) => state.values?.[name] ?? initial[name]
  const describe = (name: PhotoField, hint = false) =>
    [hint ? `${name}-hint` : null, errors[name] ? `${name}-error` : null].filter(Boolean).join(" ") || undefined

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-6">
      {state.message ? (
        <p role="alert" className="border border-destructive px-4 py-3 text-destructive">
          {state.message}
        </p>
      ) : null}

      <Field
        name="image"
        label={photo ? "Remplacer la photo" : "Photo"}
        hint="JPEG, PNG ou WebP. La photo est réduite automatiquement avant l’envoi."
        error={errors.image}
      >
        {photo ? (
          <div className="relative aspect-[3/2] w-48 bg-muted">
            <Image src={photo.src} alt={photo.alt} fill sizes="192px" className="object-cover" />
          </div>
        ) : null}
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={!photo}
          aria-invalid={errors.image ? true : undefined}
          aria-describedby={describe("image", true)}
          onChange={prepareImage}
          className="h-11 py-2"
        />
        <p role="status" className="text-sm text-muted-foreground">
          {imageStatus.message}
        </p>
      </Field>

      <Field name="title" label="Titre" error={errors.title}>
        <Input
          id="title"
          name="title"
          defaultValue={value("title")}
          required
          maxLength={120}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={describe("title")}
          className="h-11"
        />
      </Field>

      <Field
        name="alt"
        label="Description de la photo"
        hint="Décrivez ce qu'on y voit, pour les personnes qui ne la voient pas."
        error={errors.alt}
      >
        <Textarea
          id="alt"
          name="alt"
          defaultValue={value("alt")}
          required
          maxLength={250}
          rows={3}
          aria-invalid={errors.alt ? true : undefined}
          aria-describedby={describe("alt", true)}
        />
      </Field>

      <Field name="category" label="Catégorie" error={errors.category}>
        <Select name="category" defaultValue={value("category") || null} items={categoryItems} required>
          <SelectTrigger
            id="category"
            aria-invalid={errors.category ? true : undefined}
            aria-describedby={describe("category")}
            className="w-full data-[size=default]:h-11"
          >
            <SelectValue placeholder="Choisir une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="place" label="Lieu (facultatif)" error={errors.place}>
          <Input
            id="place"
            name="place"
            defaultValue={value("place")}
            maxLength={120}
            aria-describedby={describe("place")}
            className="h-11"
          />
        </Field>
        <Field name="year" label="Année (facultatif)" error={errors.year}>
          <Input
            id="year"
            name="year"
            defaultValue={value("year")}
            inputMode="numeric"
            maxLength={4}
            aria-invalid={errors.year ? true : undefined}
            aria-describedby={describe("year")}
            className="h-11"
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending || imageStatus.preparing} className="h-11 px-6 text-base">
          {pending ? "Envoi en cours…" : photo ? "Enregistrer les modifications" : "Ajouter la photo"}
        </Button>
        <Link href="/admin" className="flex min-h-11 items-center underline underline-offset-4">
          Annuler
        </Link>
      </div>
    </form>
  )
}
