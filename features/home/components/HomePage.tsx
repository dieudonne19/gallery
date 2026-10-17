import { Eyebrow } from "@/components/shared/Eyebrow";
import { getPhotos } from "@/features/photos/lib/queries";
import type { CategoryId } from "@/features/photos/types";
import { CategoryFilter } from "./CategoryFilter";
import { HomeHero } from "./HomeHero";
import { PhotoMosaic } from "./PhotoMosaic";
import { WordsMarquee } from "./WordsMarquee";

interface HomePageProps {
  /** Catégorie active (ex. lue dans ?categorie=). */
  category?: CategoryId;
}

export async function HomePage({ category }: HomePageProps) {
  const photos = await getPhotos(category);

  return (
    <>
      <HomeHero />

      {/* Filtre sticky : se cale sous le header fixe (--header-h) pendant le défilement de la galerie. */}
      <div className="sticky top-(--header-h) z-30 border-b border-border bg-background px-4 py-2 md:px-16 md:py-3">
        <CategoryFilter active={category} />
      </div>

      <WordsMarquee />

      <section className="px-4 pb-16 pt-4 md:px-16 md:pb-24 md:pt-6">
        {/* Largeur limitée : sur grand écran la galerie reste lisible d'un coup d'œil. */}
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-4 flex justify-between">
            <Eyebrow>{photos.length} photos</Eyebrow>
            <Eyebrow>Plus récentes d’abord</Eyebrow>
          </div>
          <PhotoMosaic photos={photos} />
        </div>
      </section>
    </>
  );
}
