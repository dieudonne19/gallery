import Link from "next/link";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { PortfolioLink } from "./PortfolioLink";
import { NAV_LINKS } from "./nav";

export function SiteHeader() {
  // Header fixe : même comportement sur le site et dans /admin.
  return (
    <header className="sticky top-0 z-40 flex h-(--header-h) items-center justify-between border-b border-border bg-background px-4 md:px-16">
      <Link href="/" className="flex min-h-11 items-center">
        <Logo />
      </Link>

      <nav aria-label="Navigation principale" className="hidden items-center gap-7 md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex min-h-11 items-center underline-offset-4 hover:underline"
          >
            {link.label}
          </Link>
        ))}
        <PortfolioLink className="flex min-h-11 items-center underline-offset-4 hover:underline" />
      </nav>

      <MobileMenu />
    </header>
  );
}
