/** Premier élément atteint au clavier : permet de passer l'en-tête et d'aller au contenu. */
export function SkipLink() {
  return (
    <a
      href="#contenu"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-3 focus:text-background"
    >
      Aller au contenu
    </a>
  );
}
