import Image from "next/image";
import { ABOUT_COVER } from "../content";

export function AboutHero() {
  return (
    <div className="px-4 pt-4 md:px-16 md:pt-8">
      <div className="relative aspect-[3/2] w-full bg-muted md:aspect-[21/9]">
        <Image
          src={ABOUT_COVER.src}
          alt={ABOUT_COVER.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
