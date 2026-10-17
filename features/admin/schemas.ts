import { z } from "zod"

const yearMessage = "Indiquez une année valide, par exemple 2024."

export const photoSchema = z.object({
  title: z.string().trim().min(1, "Indiquez un titre.").max(120, "Le titre dépasse 120 caractères."),
  alt: z
    .string()
    .trim()
    .min(1, "Décrivez la photo pour les personnes qui ne la voient pas.")
    .max(250, "La description dépasse 250 caractères."),
  category: z.string().trim().min(1, "Choisissez une catégorie.").max(40, "Choisissez une catégorie."),
  place: z
    .string()
    .trim()
    .max(120, "Le lieu dépasse 120 caractères.")
    .transform((v) => v || null),
  year: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : Number(v)))
    .pipe(z.number(yearMessage).int(yearMessage).min(1800, yearMessage).max(2200, yearMessage).nullable()),
})

export type PhotoField = "title" | "alt" | "category" | "place" | "year" | "image"

export interface PhotoFormState {
  errors?: Partial<Record<PhotoField, string>>
  /** Message général (échec d'enregistrement, photo introuvable). */
  message?: string
  /** Saisie renvoyée pour que le formulaire ne se vide pas après une erreur. */
  values?: Record<string, string>
}

const text = (formData: FormData, name: string) => {
  const value = formData.get(name)
  return typeof value === "string" ? value : ""
}

export function parsePhotoForm(formData: FormData) {
  const values = Object.fromEntries(
    ["title", "alt", "category", "place", "year"].map((name) => [name, text(formData, name)]),
  )
  const result = photoSchema.safeParse(values)
  const errors: NonNullable<PhotoFormState["errors"]> = {}
  if (result.success) return { data: result.data, values, errors }
  for (const issue of result.error.issues) errors[issue.path[0] as PhotoField] ??= issue.message
  return { data: null, values, errors }
}
