import { HouseIcon, InfoIcon, MailIcon } from "lucide-react";

import { NavLink } from "./NavLink";
import { SearchShortcut } from "./SearchShortcut";

const item =
  "flex min-h-12 min-w-16 flex-col items-center justify-center gap-0.5 rounded-2xl px-3 text-xs font-medium text-muted-foreground transition-colors aria-[current=page]:text-foreground";

/** Barre de navigation du bas, sur mobile : à portée de pouce, toujours visible. */
export function BottomNav() {
  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-40 flex h-(--bottom-nav-h) items-center justify-around border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <NavLink href="/" exact className={item}>
        <HouseIcon aria-hidden="true" className="size-6" />
        Accueil
      </NavLink>
      <SearchShortcut className={item} />
      <NavLink href="/a-propos" className={item}>
        <InfoIcon aria-hidden="true" className="size-6" />
        À propos
      </NavLink>
      <NavLink href="/contact" className={item}>
        <MailIcon aria-hidden="true" className="size-6" />
        Contact
      </NavLink>
    </nav>
  );
}
