import { Suspense } from "react";

import { SmoothScroll } from "@/components/shared/SmoothScroll";
import type { CategoryId } from "@/features/photos/types";
import { CategoryFilter } from "./CategoryFilter";
import { GallerySkeleton } from "./GallerySkeleton";
import { HomeGallery } from "./HomeGallery";
import { HomeHero } from "./HomeHero";
import { WordsMarquee } from "./WordsMarquee";

interface HomePageProps {
  /** Catégorie active (ex. lue dans ?categorie=). */
  category?: CategoryId;
}

export function HomePage({ category }: HomePageProps) {
  return (
    <>
      <SmoothScroll />

      {/* La hero, le filtre et le bandeau ne dépendent pas de la base : ils s'affichent tout de suite. */}
      <HomeHero />

      {/* Filtre sticky : se cale sous le header fixe (--header-h) pendant le défilement de la galerie. */}
      <div className="sticky top-(--header-h) z-30 border-b border-border bg-background px-4 py-2 md:px-16 md:py-3">
        <CategoryFilter active={category} />
      </div>

      <WordsMarquee />

      <Suspense fallback={<GallerySkeleton />}>
        <HomeGallery category={category} />
      </Suspense>
    </>
  );
}
