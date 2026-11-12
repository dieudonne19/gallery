import { BottomNav } from "./BottomNav";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/** Enveloppe commune du site public : en-tête, pied de page et, sur mobile, barre de navigation du bas. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    // Sur mobile, la barre du bas ne doit rien cacher : la page réserve sa hauteur.
    <div className="flex min-h-screen flex-col bg-background pb-(--bottom-nav-h) text-foreground">
      <SiteHeader />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
