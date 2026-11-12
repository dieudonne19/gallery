import Link from "next/link"
import Image from "next/image"
import { Eyebrow } from "@/components/shared/Eyebrow"
import type { Photo } from "@/features/photos/types"

interface PhotoNavProps {
  prev: Photo
  next: Photo
}

function NavItem({
  photo,
  label,
  align,
}: {
  photo: Photo
  label: string
  align: "start" | "end"
}) {
  return (
    <Link
      href={`/photos/${photo.id}`}
      className={`flex flex-col gap-3 ${align === "end" ? "items-end" : "items-start"}`}
    >
      <Eyebrow>{label}</Eyebrow>
      <div
        className="relative aspect-[3/2] w-full rounded-xl bg-muted md:w-[280px]"
        style={{ backgroundColor: photo.color }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 768px) 280px, 50vw"
          className="rounded-xl object-cover"
        />
      </div>
    </Link>
  )
}

export function PhotoNav({ prev, next }: PhotoNavProps) {
  return (
    <nav aria-label="Photos voisines" className="mx-auto mt-6 w-full max-w-[1100px] px-4 md:mt-10 md:px-0">
      <div className="grid grid-cols-2 gap-3 md:gap-8">
        <NavItem photo={prev} label="← Précédente" align="start" />
        <NavItem photo={next} label="Suivante →" align="end" />
      </div>
    </nav>
  )
}
