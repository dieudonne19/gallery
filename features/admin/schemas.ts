import { z } from "zod"

const yearMessage = "Indiquez une année valide, par exemple 2024."

/** Texte facultatif : vide → null. */
const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .transform((v) => v || null)

/** Nombre facultatif, virgule ou point (« 5,6 »), avec un préfixe toléré (« f/8 »). Vide → null. */
const optionalNumber = (min: number, max: number, message: string, prefix?: RegExp) =>
  z
    .string()
    .trim()
    .transform((v) => (prefix ? v.replace(prefix, "") : v).replace(",", ".").trim())
    .transform((v) => (v === "" ? null : Number(v)))
    .pipe(z.number(message).min(min, message).max(max, message).nullable())

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
  // Prise de vue (facultatif), pré-remplie depuis l'EXIF dans le navigateur. Les limites suivent db/schema.sql.
  camera: optionalText(80, "L’appareil dépasse 80 caractères."),
  lens: optionalText(120, "L’objectif dépasse 120 caractères."),
  focalLength: optionalNumber(1, 2000, "Indiquez une focale en millimètres, par exemple 35.").transform((v) =>
    v === null ? null : Math.round(v * 10) / 10,
  ),
  aperture: optionalNumber(0.5, 64, "Indiquez une ouverture, par exemple 5,6.", /^f\s*\/?\s*/i).transform((v) =>
    v === null ? null : Math.round(v * 10) / 10,
  ),
  exposureTime: z
    .string()
    .trim()
    .transform((v) => v.replace(/\s*s$/i, "").replace(",", "."))
    .pipe(
      z
        .string()
        .regex(/^(|1\/\d{1,5}|\d{1,4}(\.\d)?)$/, "Indiquez une vitesse comme 1/250 ou 2.")
        .transform((v) => v || null),
    ),
  iso: optionalNumber(1, 1_000_000, "Indiquez une sensibilité ISO, par exemple 200.").pipe(
    z.number().int("Indiquez une sensibilité ISO entière, par exemple 200.").nullable(),
  ),
})

export const SHOOTING_FIELDS = ["camera", "lens", "focalLength", "aperture", "exposureTime", "iso"] as const

export type PhotoField =
  | "title"
  | "alt"
  | "category"
  | "place"
  | "year"
  | "image"
  | (typeof SHOOTING_FIELDS)[number]

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
    ["title", "alt", "category", "place", "year", ...SHOOTING_FIELDS].map((name) => [name, text(formData, name)]),
  )
  const result = photoSchema.safeParse(values)
  const errors: NonNullable<PhotoFormState["errors"]> = {}
  if (result.success) return { data: result.data, values, errors }
  for (const issue of result.error.issues) errors[issue.path[0] as PhotoField] ??= issue.message
  return { data: null, values, errors }
}
