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

interface ConfirmDeleteButtonProps {
  /** Nom accessible du bouton, qui dit quoi supprimer (ex. « Supprimer « Orange et silence » »). */
  ariaLabel: string
  title: string
  description: string
  cancelLabel: string
  confirmLabel: string
  /** Action serveur déjà liée à l'identifiant de l'élément. */
  action: () => Promise<void>
}

/** Bouton « Supprimer » avec confirmation : la suppression est définitive, donc on demande avant. */
export function ConfirmDeleteButton({
  ariaLabel,
  title,
  description,
  cancelLabel,
  confirmLabel,
  action,
}: ConfirmDeleteButtonProps) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" className="h-11 text-destructive" aria-label={ariaLabel} />}>
        Supprimer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" className="h-11" />}>{cancelLabel}</DialogClose>
          <form action={action}>
            <Button type="submit" variant="destructive" className="h-11 w-full">
              {confirmLabel}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
