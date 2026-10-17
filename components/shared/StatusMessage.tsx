import { cn } from "@/lib/utils";

interface StatusMessageProps {
  title: string;
  text: string;
  /** Boutons ou liens d'action (un seul principal). */
  children?: React.ReactNode;
  className?: string;
}

/** Page de message (introuvable, erreur) : titre, explication, puis la suite possible. */
export function StatusMessage({ title, text, children, className }: StatusMessageProps) {
  return (
    <section className={cn("mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center md:py-32", className)}>
      <h1 className="font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-4xl">{title}</h1>
      <p className="text-lg text-muted-foreground">{text}</p>
      {children ? <div className="mt-2 flex flex-wrap items-center justify-center gap-4">{children}</div> : null}
    </section>
  );
}
