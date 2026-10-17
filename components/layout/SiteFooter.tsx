import Link from "next/link";
import { SITE_NAME } from "./nav";

export function SiteFooter() {
  return (
    <footer className="flex flex-col gap-3 border-t border-border px-4 pb-10 pt-6 text-muted-foreground md:flex-row md:items-center md:justify-between md:px-16 md:py-12">
      <span>{SITE_NAME} · Photographie de paysages</span>
      <span className="flex gap-6">
        <Link href="/mentions-legales" className="flex min-h-11 items-center underline underline-offset-4">
          Mentions légales
        </Link>
        <Link href="/droits-d-utilisation" className="flex min-h-11 items-center underline underline-offset-4">
          Droits d’utilisation
        </Link>
      </span>
    </footer>
  );
}
