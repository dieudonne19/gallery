/** Lien dans un texte légal. */
export const legalLink = "underline underline-offset-4";

interface LegalPageProps {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

/** Mise en page commune des pages légales : un titre, la date de mise à jour, puis des rubriques. */
export function LegalPage({ title, updatedAt, children }: LegalPageProps) {
  return (
    <section className="px-4 pb-24 pt-8 md:px-16 md:pt-[72px]">
      <div className="max-w-2xl">
        <h1 className="font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Dernière mise à jour&nbsp;: {updatedAt}</p>
        <div className="mt-10 flex flex-col gap-10">{children}</div>
      </div>
    </section>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl font-normal leading-tight tracking-tight">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-base leading-7">{children}</div>
    </section>
  );
}
