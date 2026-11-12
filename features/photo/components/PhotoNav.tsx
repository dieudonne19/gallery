import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import type { Photo } from "@/features/photos/types"

interface PhotoNavProps {
  prev: Photo
  next: Photo
}

function NavItem({ photo, label, direction }: { photo: Photo; label: string; direction: "prev" | "next" }) {
  const Icon = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon
  return (
    <Link
      href={`/photos/${photo.id}`}
      className={`flex min-w-0 items-center gap-3 rounded-2xl bg-secondary p-2 transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)] ${direction === "next" ? "flex-row-reverse text-right" : ""}`}
    >
      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted" style={{ backgroundColor: photo.color }}>
        <Image src={photo.src} alt="" fill sizes="56px" className="object-cover" />
      </div>
      <Icon aria-hidden="true" className="hidden size-5 shrink-0 text-muted-foreground sm:block" />
      <span className="flex min-w-0 flex-col">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="truncate font-semibold">{photo.title}</span>
      </span>
    </Link>
  )
}

/** Photos précédente et suivante, sous la grande vue (page complète). */
export function PhotoNav({ prev, next }: PhotoNavProps) {
  return (
    <nav aria-label="Photos voisines" className="mx-auto mt-4 w-full max-w-[1100px] px-4 md:mt-6 md:px-0">
      <div className="grid grid-cols-2 gap-3">
        <NavItem photo={prev} label="Précédente" direction="prev" />
        <NavItem photo={next} label="Suivante" direction="next" />
      </div>
    </nav>
  )
}
