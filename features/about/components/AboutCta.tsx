import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutCta() {
  return (
    <section className="flex flex-col gap-5 bg-muted px-4 py-16 md:items-center md:px-16 md:py-28 md:text-center">
      <h2 className="font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-4xl">
        Une photo vous parle ?
      </h2>
      <p className="text-xl text-muted-foreground">
        Dites-moi laquelle. J’aime en parler.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/contact" />}
        className="h-[52px] px-8 text-base"
      >
        Me contacter
      </Button>
    </section>
  );
}
