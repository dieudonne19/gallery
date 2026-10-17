import { ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Photo } from "@/features/photos/types"
import { deletePhoto, movePhoto } from "../actions/photos"
import { ConfirmDeleteButton } from "./ConfirmDeleteButton"

export function PhotoTable({ photos }: { photos: Photo[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Photo</TableHead>
          <TableHead>Titre</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Année</TableHead>
          <TableHead>Ordre</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {photos.map((photo, index) => (
          <TableRow key={photo.id}>
            <TableCell>
              <div className="relative aspect-[4/3] w-16 bg-muted">
                <Image src={photo.src} alt="" fill sizes="64px" className="object-cover" />
              </div>
            </TableCell>
            <TableCell className="font-medium">{photo.title}</TableCell>
            <TableCell>{photo.categoryLabel}</TableCell>
            <TableCell>{photo.year ?? "—"}</TableCell>
            <TableCell>
              <div className="flex">
                <form action={movePhoto.bind(null, photo.id, "up")}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    disabled={index === 0}
                    aria-label={`Monter « ${photo.title} »`}
                    className="size-11"
                  >
                    <ChevronUp />
                  </Button>
                </form>
                <form action={movePhoto.bind(null, photo.id, "down")}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    disabled={index === photos.length - 1}
                    aria-label={`Descendre « ${photo.title} »`}
                    className="size-11"
                  >
                    <ChevronDown />
                  </Button>
                </form>
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
  )
}
