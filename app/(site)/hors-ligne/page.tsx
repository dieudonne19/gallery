import type { Metadata } from "next";
import Link from "next/link";

import { StatusMessage } from "@/components/shared/StatusMessage";
import { Button } from "@/components/ui/button";

// Affichée par le service worker (public/sw.js) quand une page ne peut pas se charger sans réseau.
export const metadata: Metadata = { title: "Hors ligne", robots: { index: false } };

export default function OfflinePage() {
  return (
    <StatusMessage
      title="Pas de connexion."
      text="Cette page a besoin d’Internet pour afficher les photos. Vérifiez votre connexion, puis réessayez."
    >
      <Button nativeButton={false} render={<Link href="/" prefetch={false} />} className="h-11 px-6 text-base">
        Réessayer
      </Button>
    </StatusMessage>
  );
}
