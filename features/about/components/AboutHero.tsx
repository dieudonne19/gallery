import { ABOUT_COVER } from "../content";

export function AboutHero() {
  return (
    <div className="px-4 pt-4 md:px-16 md:pt-8">
      <img
        src={ABOUT_COVER.src}
        alt={ABOUT_COVER.alt}
        className="aspect-[3/2] w-full bg-muted object-cover md:aspect-[21/9]"
      />
    </div>
  );
}
