import type { Metadata } from "next"

import { BatchUpload } from "@/features/admin/components/BatchUpload"
import { getCategories } from "@/features/categories/lib/queries"
import { requireAdmin } from "@/lib/auth"

export const metadata: Metadata = { title: "Ajouter plusieurs photos" }

export default async function Page() {
  await requireAdmin()

  return (
    <>
      <h1 className="mb-2 text-[28px] font-semibold leading-tight tracking-tight md:text-4xl">Ajouter plusieurs photos</h1>
      <p className="mb-8 max-w-2xl text-muted-foreground">
        Les réglages de prise de vue sont repris de chaque photo ; vous pourrez les corriger ensuite, photo par photo.
      </p>
      <BatchUpload categories={await getCategories()} />
    </>
  )
}
