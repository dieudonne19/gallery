import { Suspense } from "react"

import { PhotoDetail, PhotoModal, photoTitleId, RelatedPhotos, RelatedPhotosSkeleton } from "@/features/photo"
import { getAdjacentPhotos, getPhotoById } from "@/features/photos/lib/queries"

/** Photo ouverte depuis la galerie : même contenu que sa page, dans une fenêtre par-dessus l'accueil. */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [photo, adjacent] = await Promise.all([getPhotoById(id), getAdjacentPhotos(id)])
  if (!photo || !adjacent) return null

  return (
    <PhotoModal
      photoId={photo.id}
      labelledBy={photoTitleId(photo.id)}
      prevId={adjacent.prev.id}
      nextId={adjacent.next.id}
    >
      <PhotoDetail photo={photo} headingLevel={2} />
      <Suspense fallback={<RelatedPhotosSkeleton />}>
        <RelatedPhotos photoId={photo.id} />
      </Suspense>
    </PhotoModal>
  )
}
