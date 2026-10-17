import Link from "next/link"

import { Eyebrow } from "@/components/shared/Eyebrow"
import { Button } from "@/components/ui/button"
import { PhotoTable } from "@/features/admin/components/PhotoTable"
import { getPhotos } from "@/features/photos/lib/queries"
import { requireAdmin } from "@/lib/auth"

export default async function Page() {
  await requireAdmin()
  const photos = await getPhotos()

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <Eyebrow>{photos.length} photos</Eyebrow>
          <h1 className="font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-4xl">Photos</h1>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/admin/photos/nouveau" />}
          className="h-11 px-6 text-base"
        >
          Ajouter une photo
        </Button>
      </div>

      {photos.length === 0 ? (
        <p className="max-w-md text-xl text-muted-foreground">
          Aucune photo pour l’instant. Ajoutez la première pour la voir apparaître sur le site.
        </p>
      ) : (
        <PhotoTable photos={photos} />
      )}
    </>
  )
}
