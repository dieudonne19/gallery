import { MobileMenu } from "./MobileMenu";
import { NAV_LINKS, SITE_NAME } from "./nav";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3 md:px-16 md:py-5">
      <a href="/" className="font-serif text-xl">
        {SITE_NAME}
      </a>

      <nav aria-label="Navigation principale" className="hidden items-center gap-7 md:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex min-h-11 items-center underline-offset-4 hover:underline"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <MobileMenu />
    </header>
  );
}
