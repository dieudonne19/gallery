import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/** Enveloppe commune (en-tête + pied de page). À utiliser dans app/layout.tsx. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
