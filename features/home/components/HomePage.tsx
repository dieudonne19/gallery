import { Eyebrow } from "@/components/shared/Eyebrow";
import { getPhotos } from "@/features/photos/lib/queries";
import type { CategoryId } from "@/features/photos/types";
import { CategoryFilter } from "./CategoryFilter";
import { PhotoMosaic } from "./PhotoMosaic";

interface HomePageProps {
  /** Catégorie active (ex. lue dans ?categorie=). */
  category?: CategoryId;
}

export function HomePage({ category }: HomePageProps) {
  const photos = getPhotos(category);

  return (
    <>
      <h1 className="sr-only">Photographies de paysages</h1>

      <div className="px-4 pt-2 md:px-16 md:pt-8">
        <CategoryFilter active={category} />
      </div>

      <section className="px-4 pb-16 pt-6 md:px-16 md:pb-24 md:pt-8">
        <div className="mb-4 flex justify-between">
          <Eyebrow>{photos.length} photos</Eyebrow>
          <Eyebrow>Plus récentes d’abord</Eyebrow>
        </div>
        <PhotoMosaic photos={photos} />
      </section>
    </>
  );
}
