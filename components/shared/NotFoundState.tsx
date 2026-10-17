import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StatusMessage } from "./StatusMessage";

/** Contenu des not-found.tsx. */
export function NotFoundState() {
  return (
    <StatusMessage title="Cette page n’existe pas." text="Le lien est peut-être ancien, ou la photo a été retirée.">
      <Button nativeButton={false} render={<Link href="/" />} className="h-11 px-6 text-base">
        Retourner à l’accueil
      </Button>
    </StatusMessage>
  );
}
