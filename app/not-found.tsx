import { NotFoundState } from "@/components/shared/NotFoundState";

// Adresse inconnue : hors du site (donc sans en-tête), d'où la page seule.
export default function NotFound() {
  return (
    <main id="contenu">
      <NotFoundState />
    </main>
  );
}
