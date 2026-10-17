const WORDS = ["passion", "amour", "partage"];
const REPEATS = 8; // une copie doit être plus large que le bandeau (étroit) pour que la boucle ne montre pas de trou

// Brouillard aux deux bouts : voile de la couleur du fond + léger flou, qui s'estompent vers le centre.
const fog =
  "pointer-events-none absolute inset-y-0 w-20 from-background via-background/70 to-transparent backdrop-blur-[3px]";

function Words({ extra = false }: { extra?: boolean }) {
  return WORDS.map((word) => (
    <span
      key={word}
      className={`shrink-0 pr-8 font-serif text-base text-muted-foreground ${extra ? "marquee-extra" : ""}`}
    >
      {word}
    </span>
  ));
}

/**
 * Mini bandeau défilant : passion, amour, partage. Étroit, petit texte, défilement très lent,
 * pour rester calme à côté du filtre. CSS seul (voir .marquee dans globals.css).
 */
export function WordsMarquee() {
  return (
    <div className="marquee relative mx-auto my-8 w-full max-w-sm overflow-hidden py-3 md:my-12">
      {/* Décoratif : un seul texte pour les lecteurs d'écran, pas la boucle répétée. */}
      <p className="sr-only">Passion, amour, partage.</p>
      <div aria-hidden="true" className="marquee-track flex w-max">
        {/* Deux copies identiques : la piste glisse de -50 % puis recommence sans saut. */}
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-copy flex shrink-0">
            {Array.from({ length: REPEATS }, (_, set) => (
              <Words key={set} extra={set > 0} />
            ))}
          </div>
        ))}
      </div>
      <span
        aria-hidden="true"
        className={`${fog} left-0 bg-gradient-to-r [mask-image:linear-gradient(to_right,black_35%,transparent)]`}
      />
      <span
        aria-hidden="true"
        className={`${fog} right-0 bg-gradient-to-l [mask-image:linear-gradient(to_left,black_35%,transparent)]`}
      />
    </div>
  );
}
