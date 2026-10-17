import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CONTACT_REPLY_DELAY } from "@/features/contact/config";

export function AboutCta() {
  return (
    <section className="flex flex-col gap-5 bg-muted px-4 py-16 md:items-center md:px-16 md:py-28 md:text-center">
      <h2 className="font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-4xl">
        Une photo vous parle ?
      </h2>
      <p className="text-xl text-muted-foreground">
        Écrivez-moi, je réponds sous {CONTACT_REPLY_DELAY}.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/contact" />}
        className="h-[52px] rounded-sm px-8 text-base"
      >
        Me contacter
      </Button>
    </section>
  );
}
