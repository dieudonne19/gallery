import type { Metadata } from "next"

import { Eyebrow } from "@/components/shared/Eyebrow"
import { CategoryAddForm } from "@/features/admin/components/CategoryAddForm"
import { CategoryList } from "@/features/admin/components/CategoryList"
import { getCategoriesWithCounts } from "@/features/categories/lib/queries"
import { requireAdmin } from "@/lib/auth"

export const metadata: Metadata = { title: "Catégories" }

export default async function Page() {
  await requireAdmin()
  const categories = await getCategoriesWithCounts()

  return (
    <>
      <div className="mb-8 flex flex-col gap-3">
        <Eyebrow>
          {categories.length} {categories.length > 1 ? "catégories" : "catégorie"}
        </Eyebrow>
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight md:text-4xl">Catégories</h1>
        <p className="max-w-xl text-muted-foreground">
          Elles servent de filtre sur l’accueil et classent chaque photo. L’ordre ci-dessous est celui du filtre : glissez une ligne par sa poignée pour le changer.
        </p>
      </div>

      <CategoryAddForm />

      {categories.length === 0 ? (
        <p className="mt-10 max-w-md text-xl text-muted-foreground">
          Aucune catégorie pour l’instant. Ajoutez-en une pour pouvoir classer vos photos.
        </p>
      ) : (
        <CategoryList categories={categories} />
      )}
    </>
  )
}
