import { Eyebrow } from "@/components/shared/Eyebrow";
import type { Photo } from "@/features/photos/types";

interface PhotoNavProps {
  prev: Photo;
  next: Photo;
}

function NavItem({ photo, label, align }: { photo: Photo; label: string; align: "start" | "end" }) {
  return (
    <a
      href={`/photos/${photo.id}`}
      className={`flex flex-col gap-3 ${align === "end" ? "items-end" : "items-start"}`}
    >
      <Eyebrow>{label}</Eyebrow>
      <img
        src={photo.src}
        alt={photo.alt}
        className="aspect-[3/2] w-full bg-muted object-cover md:w-[280px]"
      />
    </a>
  );
}

export function PhotoNav({ prev, next }: PhotoNavProps) {
  return (
    <nav
      aria-label="Photos voisines"
      className="px-4 pb-16 md:px-16 md:pb-32"
    >
      <div className="grid grid-cols-2 gap-3 border-t border-border pt-6 md:gap-8 md:pt-10">
        <NavItem photo={prev} label="← Précédente" align="start" />
        <NavItem photo={next} label="Suivante →" align="end" />
      </div>
    </nav>
  );
}
