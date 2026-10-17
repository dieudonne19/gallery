"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { StatusMessage } from "./StatusMessage";

/** Contenu des error.tsx : réessayer (action principale) ou revenir à l'accueil. */
export function ErrorState({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusMessage title="La page ne s’est pas chargée." text="Un incident est survenu. Réessayez dans un instant.">
      <Button onClick={reset} className="h-11 px-6 text-base">
        Réessayer
      </Button>
      <Link href="/" className="flex min-h-11 items-center underline underline-offset-4">
        Retourner à l’accueil
      </Link>
    </StatusMessage>
  );
}
