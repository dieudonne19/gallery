"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DeletePhotoButtonProps {
  title: string
  /** Action serveur déjà liée à l'identifiant de la photo. */
  action: () => Promise<void>
}

export function DeletePhotoButton({ title, action }: DeletePhotoButtonProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="ghost" className="h-11 text-destructive" aria-label={`Supprimer « ${title} »`} />}
      >
        Supprimer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer « {title} » ?</DialogTitle>
          <DialogDescription>
            La photo disparaît du site et son fichier est effacé. Cette action est définitive.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" className="h-11" />}>Garder la photo</DialogClose>
          <form action={action}>
            <Button type="submit" variant="destructive" className="h-11 w-full">
              Supprimer la photo
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
