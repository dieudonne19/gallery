import { PhotoGrid } from "@/features/photos/components/PhotoGrid"
import { MasonrySkeleton } from "@/features/photos/components/MasonrySkeleton"
import { getRelatedPhotos } from "@/features/photos/lib/queries"

const heading = "Plus de photos comme celle-ci"
const section = "mx-auto mt-4 w-full max-w-[1100px] bg-background px-4 pt-6 pb-10 md:mt-6 md:rounded-[32px] md:px-6"

/** Mosaïque de photos proches, sous la grande vue d'une photo (page et fenêtre). */
export async function RelatedPhotos({ photoId }: { photoId: string }) {
  const photos = await getRelatedPhotos(photoId)
  if (photos.length === 0) return null

  return (
    <section aria-labelledby={`related-title-${photoId}`} className={section}>
      <h2 id={`related-title-${photoId}`} className="mb-5 text-center text-xl font-semibold tracking-tight md:text-2xl">
        {heading}
      </h2>
      <PhotoGrid photos={photos} priorityCount={0} />
    </section>
  )
}

/** Place réservée pendant le chargement des suggestions : la grande vue s'affiche sans les attendre. */
export function RelatedPhotosSkeleton() {
  return (
    <section aria-busy="true" className={section}>
      <p className="mb-5 text-center text-xl font-semibold tracking-tight text-muted-foreground md:text-2xl">{heading}</p>
      <MasonrySkeleton count={6} />
    </section>
  )
}
