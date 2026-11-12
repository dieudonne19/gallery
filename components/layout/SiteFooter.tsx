import { Heart } from "lucide-react";
import Link from "next/link";

import { PortfolioLink } from "./PortfolioLink";
import { SITE_NAME } from "./nav";

const footerLink = "inline-flex min-h-11 items-center rounded-full px-3 transition-colors hover:bg-secondary hover:text-foreground";

export function SiteFooter() {
  return (
    <footer className="flex flex-col items-center gap-2 px-4 pb-8 pt-10 text-sm text-muted-foreground md:flex-row md:justify-between md:px-8">
      <span className="flex flex-wrap items-center gap-x-2">
        {SITE_NAME} ·
        <span lang="en" className="flex items-center gap-1.5">
          Made with Love
          <Heart aria-hidden="true" className="size-4 fill-primary stroke-primary" />
        </span>
      </span>
      <span className="flex flex-wrap justify-center">
        <Link href="/mentions-legales" className={footerLink}>
          Mentions légales
        </Link>
        <Link href="/droits-d-utilisation" className={footerLink}>
          Droits d’utilisation
        </Link>
        {/* Sur mobile, l'en-tête n'a pas de lien vers le portfolio : il est ici. */}
        <PortfolioLink className={`${footerLink} md:hidden`} />
      </span>
    </footer>
  );
}
