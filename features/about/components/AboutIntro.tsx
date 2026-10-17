import { Eyebrow } from "@/components/shared/Eyebrow";
import { ABOUT_PARAGRAPHS, ABOUT_TITLE } from "../content";

export function AboutIntro() {
  return (
    <section className="grid gap-6 px-4 py-12 md:grid-cols-[5fr_7fr] md:gap-24 md:px-16 md:pb-16 md:pt-24">
      <div>
        <Eyebrow className="mb-4">À propos</Eyebrow>
        <h1 className="font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-4xl">
          {ABOUT_TITLE}
        </h1>
      </div>
      <div className="flex flex-col gap-5 text-xl text-muted-foreground">
        {ABOUT_PARAGRAPHS.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
    </section>
  );
}
