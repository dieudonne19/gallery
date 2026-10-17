import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { updatePhoto } from "@/features/admin/actions/photos"
import { PhotoForm } from "@/features/admin/components/PhotoForm"
import { getCategories } from "@/features/categories/lib/queries"
import { getPhotoById } from "@/features/photos/lib/queries"
import { requireAdmin } from "@/lib/auth"

export const metadata: Metadata = { title: "Modifier une photo" }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const photo = await getPhotoById(id)
  if (!photo) notFound()

  return (
    <>
      <h1 className="mb-8 font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-4xl">
        Modifier la photo
      </h1>
      <PhotoForm action={updatePhoto.bind(null, id)} photo={photo} categories={await getCategories()} />
    </>
  )
}
