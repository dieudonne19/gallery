import { HomePage } from "@/features/home";
import { isCategoryId } from "@/features/photos/lib/queries";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  return <HomePage category={isCategoryId(categorie) ? categorie : undefined} />;
}
