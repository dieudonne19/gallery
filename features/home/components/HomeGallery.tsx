import { ArrowDownWideNarrow, Images } from "lucide-react";
import Link from "next/link";

import { getCategories } from "@/features/categories/lib/queries";
import { getPhotoCount, getPhotoPage, PAGE_SIZE } from "@/features/photos/lib/queries";
import { InfiniteGallery } from "./InfiniteGallery";

/** Paquets rendus d'un coup sans JavaScript (?page=) : assez pour feuilleter, sans page démesurée. */
const MAX_PAGES = 20;

interface HomeGalleryProps {
  category?: string;
  /** Recherche (?q=), déjà nettoyée. */
  search?: string;
  /** Nombre de paquets à afficher d'emblée (lien « Voir plus » sans JavaScript). */
  pages?: number;
}

/** Galerie : la seule partie de l'accueil qui attend la base de données (voir le Suspense de HomePage). */
export async function HomeGallery({ category: requested, search, pages = 1 }: HomeGalleryProps) {
  // Une catégorie inconnue dans l'adresse est ignorée : on montre toutes les photos.
  const categories = await getCategories();
  const category = categories.some((c) => c.id === requested) ? requested : undefined;
  const shown = Math.min(Math.max(1, pages), MAX_PAGES);
  const [{ photos, nextCursor }, count] = await Promise.all([
    getPhotoPage({ category, search, limit: PAGE_SIZE * shown }),
    getPhotoCount({ category, search }),
  ]);

  const more = new URLSearchParams();
  if (category) more.set("categorie", category);
  if (search) more.set("q", search);
  more.set("page", String(shown + 1));

  return (
    <section className="px-4 pb-16 pt-4 md:px-8 md:pb-24 md:pt-6">
      {/* Sur très grand écran, la mosaïque s'arrête à cinq colonnes confortables. */}
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="mb-3 flex justify-between">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Images aria-hidden="true" className="size-4" />
            {count} {count > 1 ? "photos" : "photo"}
            {search ? ` pour « ${search} »` : ""}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowDownWideNarrow aria-hidden="true" className="size-4" />
            plus récentes d’abord
          </p>
        </div>
        {photos.length > 0 ? (
          <InfiniteGallery
            // Nouveau filtre : la galerie repart du premier paquet.
            key={`${category ?? ""}-${search ?? ""}-${shown}`}
            initialPhotos={photos}
            initialCursor={nextCursor}
            category={category}
            search={search}
            moreHref={`/?${more}`}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-xl text-muted-foreground">
              {search
                ? `Aucune photo pour « ${search} »${category ? " dans cette catégorie" : ""}.`
                : category
                  ? "Aucune photo dans cette catégorie pour l’instant."
                  : "Les premières photos arrivent bientôt."}
            </p>
            {search || category ? (
              <Link
                href={search && category ? `/?categorie=${category}` : "/"}
                className="inline-flex min-h-11 items-center rounded-full bg-secondary px-5 font-medium"
              >
                {search ? "Effacer la recherche" : "Voir toutes les photos"}
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
