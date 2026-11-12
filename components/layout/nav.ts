export const NAV_LINKS = [
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

export const SITE_NAME = "Hitako";

export const PORTFOLIO_URL = "https://dieudonneandrianjato.vercel.app";

/** Lien de l'en-tête et du pied de page : pastille grise au survol, noire quand c'est la page en cours. */
export const pillLink =
  "inline-flex min-h-11 items-center rounded-full px-4 font-medium transition-colors hover:bg-secondary aria-[current=page]:bg-foreground aria-[current=page]:text-background";
