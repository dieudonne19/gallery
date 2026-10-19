import Link from "next/link"
import { Eyebrow } from "@/components/shared/Eyebrow"
import type { Photo } from "@/features/photos/types"
import { ShareButton } from "./ShareButton"
import { MapPinIcon } from "lucide-react"

export function PhotoCaption({ photo }: { photo: Photo }) {
  // Lieu et année sont facultatifs : on n'affiche que ce qui existe.
  const meta = [photo.place, photo.year].filter(Boolean).join(" · ")

  return (
    <section className="flex flex-col gap-4 px-4 pt-6 pb-8 md:flex-row md:items-end md:justify-between md:gap-8 md:px-16 md:pt-8 md:pb-[72px]">
      <div className="flex flex-col gap-3">
        {meta ? (
          <Eyebrow className="flex items-center gap-2">
            <MapPinIcon className="size-4" />
            {meta}
          </Eyebrow>
        ) : null}
        <h1 className="font-serif text-[28px] leading-[1.1] font-normal tracking-tight md:text-4xl">
          {photo.title}
        </h1>
      </div>

      <div className="flex gap-6">
        <ShareButton title={photo.title} />
        <Link
          href={`/contact?photo=${encodeURIComponent(photo.id)}`}
          className="flex min-h-11 items-center underline underline-offset-4"
        >
          Écrire à propos de cette photo
        </Link>
      </div>
    </section>
  )
}
