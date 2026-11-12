import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/JsonLd";
import { HomePage } from "@/features/home";
import { cleanSearch } from "@/features/photos/lib/search";
import { AUTHOR_NAME, SITE_NAME, SITE_URL } from "@/lib/site";

type SearchParams = Promise<{ categorie?: string | string[]; page?: string | string[]; q?: string | string[] }>;

/** Résultats de recherche : utiles au visiteur, pas aux moteurs de recherche (contenu en double de l'accueil). */
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const search = cleanSearch((await searchParams).q);
  if (!search) return {};
  return { title: `Recherche : ${search}`, robots: { index: false, follow: true } };
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const { categorie, page, q } = await searchParams;
  const pages = typeof page === "string" && /^\d{1,2}$/.test(page) ? Number(page) : 1;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              inLanguage: "fr",
              potentialAction: {
                "@type": "SearchAction",
                target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
                "query-input": "required name=search_term_string",
              },
            },
            { "@type": "Person", name: AUTHOR_NAME, url: SITE_URL, jobTitle: "Développeur web et designer" },
          ],
        }}
      />
      <HomePage
        category={typeof categorie === "string" ? categorie : undefined}
        search={cleanSearch(q)}
        pages={pages}
      />
    </>
  );
}
