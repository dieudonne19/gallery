import type { Metadata } from "next"

import { createPhoto } from "@/features/admin/actions/photos"
import { PhotoForm } from "@/features/admin/components/PhotoForm"
import { requireAdmin } from "@/lib/auth"

export const metadata: Metadata = { title: "Ajouter une photo" }

export default async function Page() {
  await requireAdmin()

  return (
    <>
      <h1 className="mb-8 font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-4xl">
        Ajouter une photo
      </h1>
      <PhotoForm action={createPhoto} />
    </>
  )
}
