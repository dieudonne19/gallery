import { Suspense, ViewTransition } from "react";

import { CategoryFilterBar } from "./CategoryFilterBar";
import { FilterSkeleton } from "./FilterSkeleton";
import { GallerySkeleton } from "./GallerySkeleton";
import { HomeGallery } from "./HomeGallery";
import { HomeHero } from "./HomeHero";

interface HomePageProps {
  /** Catégorie demandée dans l'adresse (?categorie=). Vérifiée plus loin, avec la base. */
  category?: string;
  /** Paquets de photos affichés d'emblée (?page=, lien « Voir plus » sans JavaScript). */
  pages?: number;
}

export function HomePage({ category, pages }: HomePageProps) {
  return (
    <>
      {/* L'introduction et le filtre ne dépendent pas de la base : ils s'affichent tout de suite. */}
      <HomeHero />

      {/* Filtre collant : se cale sous l'en-tête, et monte avec lui quand il se masque. */}
      <div className="sticky-under-header sticky top-(--header-h) z-30 bg-background/95 py-2 backdrop-blur-md">
        <Suspense fallback={<FilterSkeleton />}>
          <CategoryFilterBar category={category} />
        </Suspense>
      </div>

      <Suspense fallback={<GallerySkeleton />}>
        {/* Nouveau filtre : l'ancienne mosaïque laisse place à la nouvelle en fondu enchaîné.
            default="none" : l'ajout de photos pendant le défilement, lui, ne déclenche rien. */}
        <ViewTransition key={category ?? "tout"} name="gallery" share="auto" enter="auto" default="none">
          <HomeGallery category={category} pages={pages} />
        </ViewTransition>
      </Suspense>
    </>
  );
}
