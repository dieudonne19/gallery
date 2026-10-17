import type { Metadata } from "next"

import { Eyebrow } from "@/components/shared/Eyebrow"
import { CategoryAddForm } from "@/features/admin/components/CategoryAddForm"
import { CategoryRow } from "@/features/admin/components/CategoryRow"
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
        <h1 className="font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-4xl">Catégories</h1>
        <p className="max-w-xl text-muted-foreground">
          Elles servent de filtre sur l’accueil et classent chaque photo. L’ordre ci-dessous est celui du filtre.
        </p>
      </div>

      <CategoryAddForm />

      {categories.length === 0 ? (
        <p className="mt-10 max-w-md text-xl text-muted-foreground">
          Aucune catégorie pour l’instant. Ajoutez-en une pour pouvoir classer vos photos.
        </p>
      ) : (
        <ul className="mt-10 max-w-4xl">
          {categories.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              isFirst={index === 0}
              isLast={index === categories.length - 1}
            />
          ))}
        </ul>
      )}
    </>
  )
}
