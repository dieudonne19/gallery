import { ArrowDownWideNarrow, Images } from "lucide-react";
import Link from "next/link";

import { getCategories } from "@/features/categories/lib/queries";
import { getPhotoCount, getPhotoPage, PAGE_SIZE } from "@/features/photos/lib/queries";
import { InfiniteGallery } from "./InfiniteGallery";

/** Paquets rendus d'un coup sans JavaScript (?page=) : assez pour feuilleter, sans page démesurée. */
const MAX_PAGES = 20;

interface HomeGalleryProps {
  category?: string;
  /** Nombre de paquets à afficher d'emblée (lien « Voir plus » sans JavaScript). */
  pages?: number;
}

/** Galerie : la seule partie de l'accueil qui attend la base de données (voir le Suspense de HomePage). */
export async function HomeGallery({ category: requested, pages = 1 }: HomeGalleryProps) {
  // Une catégorie inconnue dans l'adresse est ignorée : on montre toutes les photos.
  const categories = await getCategories();
  const category = categories.some((c) => c.id === requested) ? requested : undefined;
  const shown = Math.min(Math.max(1, pages), MAX_PAGES);
  const [{ photos, nextCursor }, count] = await Promise.all([
    getPhotoPage({ category, limit: PAGE_SIZE * shown }),
    getPhotoCount(category),
  ]);

  const more = new URLSearchParams();
  if (category) more.set("categorie", category);
  more.set("page", String(shown + 1));

  return (
    <section className="px-4 pb-16 pt-4 md:px-8 md:pb-24 md:pt-6">
      {/* Sur très grand écran, la mosaïque s'arrête à cinq colonnes confortables. */}
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="mb-3 flex justify-between">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Images aria-hidden="true" className="size-4" />
            {count} {count > 1 ? "photos" : "photo"}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowDownWideNarrow aria-hidden="true" className="size-4" />
            plus récentes d’abord
          </p>
        </div>
        {photos.length > 0 ? (
          <InfiniteGallery
            // Nouveau filtre : la galerie repart du premier paquet.
            key={`${category ?? ""}-${shown}`}
            initialPhotos={photos}
            initialCursor={nextCursor}
            category={category}
            moreHref={`/?${more}`}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-xl text-muted-foreground">
              {category ? "Aucune photo dans cette catégorie pour l’instant." : "Les premières photos arrivent bientôt."}
            </p>
            {category ? (
              <Link href="/" className="flex min-h-11 items-center underline underline-offset-4">
                Voir toutes les photos
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
