import { AboutCta } from "./AboutCta";
import { AboutFacts } from "./AboutFacts";
import { AboutHero } from "./AboutHero";
import { AboutIntro } from "./AboutIntro";

export function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutIntro />
      <AboutFacts />
      <AboutCta />
    </>
  );
}
