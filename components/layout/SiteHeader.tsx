import Link from "next/link";
import { Suspense } from "react";

import { HeaderOnScroll } from "./HeaderOnScroll";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";
import { PortfolioLink } from "./PortfolioLink";
import { SearchBar, SearchBarFallback } from "./SearchBar";
import { NAV_LINKS, pillLink } from "./nav";

/** En-tête collant et compact. Sur mobile, la navigation passe dans la barre du bas (BottomNav). */
export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-40 flex h-(--header-h) items-center gap-3 bg-background/95 px-4 backdrop-blur-md md:gap-6 md:px-8">
      <HeaderOnScroll />
      <Link href="/" className="flex min-h-11 shrink-0 items-center rounded-full px-1">
        <Logo />
      </Link>

      {/* Grande barre de recherche, au centre. */}
      <div className="min-w-0 flex-1">
        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>
      </div>

      <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
        {NAV_LINKS.map((link) => (
          <NavLink key={link.href} href={link.href} className={pillLink}>
            {link.label}
          </NavLink>
        ))}
        <PortfolioLink className={pillLink} />
      </nav>
    </header>
  );
}
