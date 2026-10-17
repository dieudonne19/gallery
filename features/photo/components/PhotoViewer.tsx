import Link from "next/link";
import Image from "next/image";
import type { Photo } from "@/features/photos/types";

export function PhotoViewer({ photo }: { photo: Photo }) {
  const link = "flex min-h-11 items-center underline underline-offset-4";

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 md:px-16 md:py-4">
        <Link href={`/?categorie=${photo.category}`} className={link}>
          ← {photo.categoryLabel}
        </Link>
        <a href={photo.src} target="_blank" rel="noreferrer" className={link}>
          Plein écran
        </a>
      </div>

      {/* La photo entière, à son format : centrée, jamais plus haute que 80 % de l'écran. */}
      <div className="flex justify-center px-4 md:px-16">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          priority
          sizes="(min-width: 768px) calc(100vw - 8rem), 100vw"
          className="h-auto max-h-[80svh] w-auto max-w-full rounded-xl bg-muted object-contain"
        />
      </div>
    </>
  );
}
