import { HomePage } from "@/features/home";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string | string[] }>;
}) {
  const { categorie } = await searchParams;
  return <HomePage category={typeof categorie === "string" ? categorie : undefined} />;
}
