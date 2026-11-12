"use client"

import { ChevronDown, ChevronUp, GripVertical } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Photo } from "@/features/photos/types"
import { deletePhoto, reorderPhotos } from "../actions/photos"
import { useReorder } from "../lib/use-reorder"
import { ConfirmDeleteButton } from "./ConfirmDeleteButton"

const handle =
  "flex size-11 cursor-grab items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:cursor-grabbing"

/**
 * Liste des photos de l'administration, dans l'ordre de la galerie. On la réordonne en glissant une ligne par sa poignée
 * (souris ou doigt), ou au clavier : poignée + flèches, ou boutons ↑ / ↓.
 */
export function PhotoTable({ photos }: { photos: Photo[] }) {
  const { items, move, handleProps, listRef, announcement } = useReorder(photos, {
    save: reorderPhotos,
    label: (photo) => photo.title,
  })

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        Glissez une ligne par sa poignée pour changer l’ordre de la galerie.
      </p>
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <span className="sr-only">Déplacer</span>
            </TableHead>
            <TableHead className="w-20">Photo</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Année</TableHead>
            <TableHead>Ordre</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody ref={listRef}>
          {items.map((photo, index) => (
            <TableRow key={photo.id} data-sort-row className="bg-background data-dragging:bg-card">
              <TableCell>
                <button type="button" className={handle} {...handleProps(photo)}>
                  <GripVertical aria-hidden="true" className="size-5" />
                </button>
              </TableCell>
              <TableCell>
                <div className="relative aspect-[4/3] w-16 overflow-hidden rounded-md bg-muted" style={{ backgroundColor: photo.color }}>
                  <Image src={photo.src} alt="" fill sizes="64px" className="object-cover" draggable={false} />
                </div>
              </TableCell>
              <TableCell className="font-medium">{photo.title}</TableCell>
              <TableCell>{photo.categoryLabel}</TableCell>
              <TableCell>{photo.year ?? "—"}</TableCell>
              <TableCell>
                <div className="flex">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={index === 0}
                    onClick={() => move(photo.id, index - 1)}
                    aria-label={`Monter « ${photo.title} »`}
                    className="size-11"
                  >
                    <ChevronUp />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={index === items.length - 1}
                    onClick={() => move(photo.id, index + 1)}
                    aria-label={`Descendre « ${photo.title} »`}
                    className="size-11"
                  >
                    <ChevronDown />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    nativeButton={false}
                    render={<Link href={`/admin/photos/${photo.id}`} aria-label={`Modifier « ${photo.title} »`} />}
                    variant="outline"
                    className="h-11"
                  >
                    Modifier
                  </Button>
                  <ConfirmDeleteButton
                    ariaLabel={`Supprimer « ${photo.title} »`}
                    title={`Supprimer « ${photo.title} » ?`}
                    description="La photo disparaît du site et son fichier est effacé. Cette action est définitive."
                    cancelLabel="Garder la photo"
                    confirmLabel="Supprimer la photo"
                    action={deletePhoto.bind(null, photo.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
