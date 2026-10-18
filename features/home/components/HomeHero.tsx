import Link from "next/link";

import { HeroScenes } from "./HeroScenes";

// Moment fort de la page : montagne, coucher de soleil puis lune se dessinent (HeroScenes, gsap).
// Les textes n'ont qu'un fondu discret (.hero-reveal dans globals.css).
const reveal = (index: number) => ({ "--i": index }) as React.CSSProperties;

export function HomeHero() {
  return (
    <section className="flex min-h-[60svh] flex-col items-center justify-center px-4 py-12 text-center md:px-16 md:py-16">
      <HeroScenes className="mb-8 h-auto w-56 md:w-72" />
      <h1
        className="hero-reveal max-w-3xl text-balance font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-5xl"
        style={reveal(0)}
      >
        Je vois, je capture, je partage.
      </h1>
      <div className="hero-reveal mt-5 flex flex-col items-center gap-1 md:mt-6" style={reveal(1)}>
        <p className="max-w-xl text-balance text-lg text-muted-foreground">
          Ce monde qui nous entoure est plein de surprises. On le découvre ensemble.
        </p>
        <Link href="/contact" className="flex min-h-11 items-center underline underline-offset-4">
          Une photo vous parle ? Écrivez-moi
        </Link>
      </div>
    </section>
  );
}
