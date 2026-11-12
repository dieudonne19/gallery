/** Introduction courte : la mosaïque doit être visible dès le premier écran. */
export function HomeHero() {
  return (
    <section className="px-4 pt-4 pb-2 text-center md:px-8 md:pt-6">
      <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">Je vois, je capture, je partage.</h1>
      <p className="mx-auto mt-1 max-w-xl text-balance text-muted-foreground">
        Des paysages de Madagascar et d’ailleurs, à découvrir ensemble.
      </p>
    </section>
  );
}
