"use client"

import { CheckCircle2Icon, ImagePlusIcon, LoaderIcon, TriangleAlertIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Category } from "@/features/photos/types"
import { addBatchPhoto, finishBatch } from "../actions/photos"
import { type ExifData, readExif } from "../lib/exif"
import { MAX_IMAGE_BYTES } from "../lib/limits"
import { resizeForUpload } from "../lib/resize-image"
import { SHOOTING_FIELDS } from "../schemas"

/** Au-delà, mieux vaut faire plusieurs séries : la page reste légère et les erreurs lisibles. */
const MAX_FILES = 30
/** Envois simultanés : assez pour aller vite, sans saturer la connexion ni l'hébergeur. */
const CONCURRENCY = 2

type Status = "preparing" | "ready" | "sending" | "done" | "error"

interface Item {
  key: string
  name: string
  file?: File
  preview?: string
  exif: ExifData
  status: Status
  title: string
  alt: string
  errors?: { title?: string; alt?: string }
  message?: string
}

const STATUS_TEXT: Record<Status, string> = {
  preparing: "Préparation…",
  ready: "Prête à envoyer",
  sending: "Envoi en cours…",
  done: "Envoyée",
  error: "Non envoyée",
}

/**
 * Envoi de plusieurs photos : on les dépose (ou les choisit) d'un coup, on remplit ce qui est commun à la série
 * (catégorie, lieu, année), puis le titre et la description de chacune. Chaque photo part dans sa propre requête
 * (limite de 4,5 Mo par requête de l'hébergeur), deux à la fois ; un échec n'arrête pas les autres.
 */
export function BatchUpload({ categories }: { categories: Category[] }) {
  const [items, setItems] = useState<Item[]>([])
  const [category, setCategory] = useState<string | null>(null)
  const [place, setPlace] = useState("")
  const [year, setYear] = useState("")
  const [commonError, setCommonError] = useState<string>()
  const [sending, setSending] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const previews = useRef(new Set<string>())

  const update = (key: string, patch: Partial<Item>) =>
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)))

  // Aperçus libérés en quittant la page.
  useEffect(() => {
    const urls = previews.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  function addFiles(list: FileList | File[]) {
    const images = [...list].filter((file) => /^image\/(jpeg|png|webp)$/.test(file.type))
    const room = MAX_FILES - items.length
    if (images.length > room) toast.error(`${MAX_FILES} photos au plus par série : les suivantes sont ignorées.`)
    const added = images.slice(0, Math.max(0, room)).map((original) => ({ key: crypto.randomUUID(), original }))
    setItems((current) => [
      ...current,
      ...added.map(({ key, original }) => ({ key, name: original.name, exif: {}, status: "preparing" as const, title: "", alt: "" })),
    ])

    for (const { key, original } of added) {
      void (async () => {
        // L'EXIF se lit sur l'original, avant que la réduction ne l'efface (jamais le GPS).
        const exif = await original.arrayBuffer().then(readExif, () => ({}))
        const file = await resizeForUpload(original)
        if (file.size > MAX_IMAGE_BYTES) {
          update(key, { exif, status: "error", message: "La photo dépasse 4 Mo même réduite. Choisissez une version plus légère." })
          return
        }
        const preview = URL.createObjectURL(file)
        previews.current.add(preview)
        update(key, { exif, file, preview, status: "ready" })
      })()
    }
  }

  function remove(item: Item) {
    if (item.preview) {
      URL.revokeObjectURL(item.preview)
      previews.current.delete(item.preview)
    }
    setItems((current) => current.filter((i) => i.key !== item.key))
  }

  function formData(item: Item): FormData {
    const data = new FormData()
    data.set("image", item.file!)
    data.set("title", item.title)
    data.set("alt", item.alt)
    data.set("category", category ?? "")
    data.set("place", place)
    // Année commune à la série, sinon celle de chaque photo (EXIF).
    data.set("year", year.trim() || (item.exif.year ? String(item.exif.year) : ""))
    for (const name of SHOOTING_FIELDS) {
      const value = item.exif[name]
      data.set(name, value === undefined ? "" : String(value))
    }
    return data
  }

  async function sendAll() {
    if (!category) {
      setCommonError("Choisissez une catégorie pour la série.")
      return
    }
    setCommonError(undefined)

    // Titre et description obligatoires : on le signale sur chaque photo concernée, sans rien envoyer.
    const pending = items.filter((item) => item.file && (item.status === "ready" || item.status === "error"))
    let incomplete = 0
    for (const item of pending) {
      const errors = {
        title: item.title.trim() ? undefined : "Indiquez un titre.",
        alt: item.alt.trim() ? undefined : "Décrivez la photo pour les personnes qui ne la voient pas.",
      }
      if (errors.title || errors.alt) incomplete++
      update(item.key, { errors })
    }
    if (incomplete) {
      toast.error(incomplete > 1 ? `${incomplete} photos n’ont pas de titre ou de description.` : "Une photo n’a pas de titre ou de description.")
      return
    }
    if (pending.length === 0) return

    setSending(true)
    let sent = 0
    let failed = 0
    const queue = [...pending]
    const worker = async () => {
      for (let item = queue.shift(); item; item = queue.shift()) {
        update(item.key, { status: "sending", message: undefined, errors: undefined })
        try {
          const result = await addBatchPhoto(formData(item))
          if (result.ok) {
            sent++
            update(item.key, { status: "done" })
          } else {
            failed++
            const { title, alt, ...others } = result.errors ?? {}
            update(item.key, {
              status: "error",
              errors: { title, alt },
              message: result.message ?? Object.values(others).find(Boolean) ?? (title || alt ? undefined : "Erreur inconnue."),
            })
          }
        } catch {
          failed++
          update(item.key, { status: "error", message: "La connexion a été interrompue. Réessayez." })
        }
      }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker))

    // Les pages du site ne sont rafraîchies qu'une fois, à la fin de la série.
    if (sent) await finishBatch()
    setSending(false)
    if (failed) toast.error(`${sent} photo${sent > 1 ? "s" : ""} envoyée${sent > 1 ? "s" : ""}, ${failed} en échec : corrigez puis renvoyez.`)
    else toast.success(`${sent} photo${sent > 1 ? "s" : ""} ajoutée${sent > 1 ? "s" : ""}.`)
  }

  const waiting = items.filter((i) => i.status === "ready" || i.status === "error").length
  const preparing = items.some((i) => i.status === "preparing")
  const allDone = items.length > 0 && items.every((i) => i.status === "done")

  return (
    <div className="flex flex-col gap-8">
      <label
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          addFiles(event.dataTransfer.files)
        }}
        className={`flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-8 text-center transition-colors focus-within:ring-2 focus-within:ring-ring ${dragging ? "border-primary bg-secondary" : "border-input"}`}
      >
        <ImagePlusIcon aria-hidden="true" className="size-10 text-muted-foreground" />
        <span className="text-lg font-semibold">Déposez vos photos ici</span>
        <span className="text-muted-foreground">
          ou cliquez pour les choisir. JPEG, PNG ou WebP, {MAX_FILES} au plus. Elles sont réduites avant l’envoi.
        </span>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files)
            event.target.value = ""
          }}
        />
      </label>

      {items.length > 0 ? (
        <>
          <fieldset className="flex flex-col gap-4 rounded-3xl bg-secondary p-5">
            <legend className="sr-only">Commun à toute la série</legend>
            <p className="font-semibold">Commun à toute la série</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="batch-category">Catégorie</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as string | null)}
                  items={Object.fromEntries(categories.map((c) => [c.id, c.label]))}
                >
                  <SelectTrigger
                    id="batch-category"
                    aria-invalid={commonError ? true : undefined}
                    aria-describedby={commonError ? "batch-category-error" : undefined}
                    className="w-full bg-background data-[size=default]:h-11"
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
                {commonError ? (
                  <p id="batch-category-error" role="alert" className="text-sm text-destructive">
                    {commonError}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="batch-place">Lieu (facultatif)</Label>
                <Input id="batch-place" value={place} maxLength={120} onChange={(e) => setPlace(e.target.value)} className="h-11 bg-background" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="batch-year">Année (facultatif)</Label>
                <Input
                  id="batch-year"
                  value={year}
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="Sinon, celle de chaque photo"
                  onChange={(e) => setYear(e.target.value)}
                  className="h-11 bg-background"
                />
              </div>
            </div>
          </fieldset>

          <ol className="flex flex-col gap-4">
            {items.map((item, index) => (
              <li key={item.key}>
                <fieldset className="grid gap-4 rounded-3xl border border-border p-4 sm:grid-cols-[160px_1fr]" disabled={item.status === "sending" || item.status === "done"}>
                  <legend className="sr-only">
                    Photo {index + 1} : {item.name}
                  </legend>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                    {item.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element -- aperçu local (blob:), rien à optimiser
                      <img src={item.preview} alt="" className="size-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm text-muted-foreground" title={item.name}>
                        {index + 1}. {item.name}
                      </p>
                      {item.status !== "sending" && item.status !== "done" ? (
                        <button
                          type="button"
                          onClick={() => remove(item)}
                          aria-label={`Retirer ${item.name} de la série`}
                          className="-mt-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-secondary"
                        >
                          <XIcon aria-hidden="true" className="size-5" />
                        </button>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`${item.key}-title`}>Titre</Label>
                      <Input
                        id={`${item.key}-title`}
                        value={item.title}
                        maxLength={120}
                        aria-invalid={item.errors?.title ? true : undefined}
                        aria-describedby={item.errors?.title ? `${item.key}-title-error` : undefined}
                        onChange={(e) => update(item.key, { title: e.target.value, errors: { ...item.errors, title: undefined } })}
                        className="h-11"
                      />
                      {item.errors?.title ? (
                        <p id={`${item.key}-title-error`} className="text-sm text-destructive">
                          {item.errors.title}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`${item.key}-alt`}>Description de la photo</Label>
                      <Textarea
                        id={`${item.key}-alt`}
                        value={item.alt}
                        rows={2}
                        maxLength={250}
                        placeholder="Ce qu’on y voit, pour les personnes qui ne la voient pas."
                        aria-invalid={item.errors?.alt ? true : undefined}
                        aria-describedby={item.errors?.alt ? `${item.key}-alt-error` : undefined}
                        onChange={(e) => update(item.key, { alt: e.target.value, errors: { ...item.errors, alt: undefined } })}
                      />
                      {item.errors?.alt ? (
                        <p id={`${item.key}-alt-error`} className="text-sm text-destructive">
                          {item.errors.alt}
                        </p>
                      ) : null}
                    </div>
                    <p role="status" className={`flex items-center gap-2 text-sm ${item.status === "error" ? "text-destructive" : "text-muted-foreground"}`}>
                      {item.status === "done" ? <CheckCircle2Icon aria-hidden="true" className="size-4 text-green-700 dark:text-green-400" /> : null}
                      {item.status === "error" ? <TriangleAlertIcon aria-hidden="true" className="size-4" /> : null}
                      {item.status === "sending" || item.status === "preparing" ? <LoaderIcon aria-hidden="true" className="size-4 animate-spin" /> : null}
                      {item.message ?? STATUS_TEXT[item.status]}
                    </p>
                  </div>
                </fieldset>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-4">
            {allDone ? (
              <Button nativeButton={false} render={<Link href="/admin" />} className="h-11 px-6 text-base">
                Voir toutes les photos
              </Button>
            ) : (
              <Button type="button" onClick={sendAll} disabled={sending || preparing || waiting === 0} className="h-11 px-6 text-base">
                {sending ? "Envoi en cours…" : `Envoyer ${waiting} photo${waiting > 1 ? "s" : ""}`}
              </Button>
            )}
            <Button type="button" variant="outline" className="h-11 px-6 text-base" onClick={() => fileInput.current?.click()} disabled={sending}>
              Ajouter d’autres photos
            </Button>
          </div>
        </>
      ) : null}
    </div>
  )
}
