import { ArrowDownWideNarrow, Images } from "lucide-react";
import Link from "next/link";

import { Eyebrow } from "@/components/shared/Eyebrow";
import { getPhotos } from "@/features/photos/lib/queries";
import type { CategoryId } from "@/features/photos/types";
import { PhotoMosaic } from "./PhotoMosaic";

/** Galerie : la seule partie de l'accueil qui attend la base de données (voir le Suspense de HomePage). */
export async function HomeGallery({ category }: { category?: CategoryId }) {
  const photos = await getPhotos(category);

  return (
    <section className="px-4 pb-16 pt-4 md:px-16 md:pb-24 md:pt-6">
      {/* Largeur limitée : sur grand écran la galerie reste lisible d'un coup d'œil. */}
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4 flex justify-between">
          <Eyebrow className="flex items-center gap-2 normal-case">
            <Images aria-hidden="true" className="size-4" />
            {photos.length} {photos.length > 1 ? "photos" : "photo"}
          </Eyebrow>
          <Eyebrow className="flex items-center gap-2 normal-case">
            <ArrowDownWideNarrow aria-hidden="true" className="size-4" />
            plus récentes d’abord
          </Eyebrow>
        </div>
        {photos.length > 0 ? (
          <PhotoMosaic photos={photos} />
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
