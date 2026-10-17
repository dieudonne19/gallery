import { Eyebrow } from "@/components/shared/Eyebrow";
import type { Photo } from "@/features/photos/types";
import { ShareButton } from "./ShareButton";

export function PhotoCaption({ photo }: { photo: Photo }) {
  // Lieu et année sont facultatifs : on n'affiche que ce qui existe.
  const meta = [photo.place, photo.year].filter(Boolean).join(" · ");

  return (
    <section className="flex flex-col gap-4 px-4 pb-8 pt-6 md:flex-row md:items-end md:justify-between md:gap-8 md:px-16 md:pb-[72px] md:pt-8">
      <div className="flex flex-col gap-3">
        {meta ? <Eyebrow>{meta}</Eyebrow> : null}
        <h1 className="font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-4xl">
          {photo.title}
        </h1>
      </div>

      <div className="flex gap-6">
        <ShareButton title={photo.title} />
        <a
          href={`/contact?photo=${encodeURIComponent(photo.id)}`}
          className="flex min-h-11 items-center underline underline-offset-4"
        >
          Écrire à propos de cette photo
        </a>
      </div>
    </section>
  );
}
