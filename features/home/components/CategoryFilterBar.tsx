import { getCategories } from "@/features/categories/lib/queries";
import { CategoryFilter } from "./CategoryFilter";

/** Filtre branché sur la base : une catégorie inconnue dans l'adresse est ignorée (toutes les photos). */
export async function CategoryFilterBar({ category }: { category?: string }) {
  const categories = await getCategories();
  const active = categories.some((c) => c.id === category) ? category : undefined;
  return <CategoryFilter categories={categories} active={active} />;
}
