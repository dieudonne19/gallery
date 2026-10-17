import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/features/photos/data/photos";
import type { Photo } from "@/features/photos/types";

export function PhotoViewer({ photo }: { photo: Photo }) {
  const category = CATEGORIES.find((c) => c.id === photo.category);
  const link = "flex min-h-11 items-center underline underline-offset-4";

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 md:px-16 md:py-4">
        <Link href={`/?categorie=${photo.category}`} className={link}>
          ← {category?.label ?? "Retour"}
        </Link>
        <a href={photo.src} target="_blank" rel="noreferrer" className={link}>
          Plein écran
        </a>
      </div>

      <div className="md:px-16">
        <div className="relative aspect-[4/3] w-full bg-muted md:aspect-[3/2]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="(min-width: 768px) calc(100vw - 8rem), 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
}
