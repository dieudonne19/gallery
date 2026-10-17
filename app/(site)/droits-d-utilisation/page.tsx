import type { Metadata } from "next";

import { Eyebrow } from "@/components/shared/Eyebrow";

export const metadata: Metadata = { title: "Droits d’utilisation", robots: { index: false } };

// TODO: texte à fournir par le propriétaire du site, ne pas inventer de mentions légales.
export default function Page() {
  return (
    <section className="px-4 pb-24 pt-8 md:px-16 md:pt-[72px]">
      <Eyebrow className="mb-4">Droits d’utilisation</Eyebrow>
      <h1 className="font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-4xl">
        Droits d’utilisation
      </h1>
      <p className="mt-4 max-w-xl text-xl text-muted-foreground">Texte à venir.</p>
    </section>
  );
}
