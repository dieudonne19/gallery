import { JsonLd } from "@/components/shared/JsonLd";
import { HomePage } from "@/features/home";
import { AUTHOR_NAME, SITE_NAME, SITE_URL } from "@/lib/site";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string | string[] }>;
}) {
  const { categorie } = await searchParams;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", name: SITE_NAME, url: SITE_URL, inLanguage: "fr" },
            { "@type": "Person", name: AUTHOR_NAME, url: SITE_URL, jobTitle: "Développeur web et designer" },
          ],
        }}
      />
      <HomePage category={typeof categorie === "string" ? categorie : undefined} />
    </>
  );
}
