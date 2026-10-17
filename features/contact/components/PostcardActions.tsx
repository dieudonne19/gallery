import { Button } from "@/components/ui/button";

interface PostcardActionsProps {
  whatsappUrl: string;
  mailtoUrl: string;
}

export function PostcardActions({ whatsappUrl, mailtoUrl }: PostcardActionsProps) {
  return (
    <section className="flex flex-col gap-4 px-4 pb-16 pt-10 md:items-center md:px-16 md:pb-28 md:pt-14 md:text-center">
      <Button
        nativeButton={false}
        render={<a href={whatsappUrl} target="_blank" rel="noreferrer" />}
        className="h-[52px] px-8 text-base"
      >
        Poster sur WhatsApp
      </Button>
      <p className="text-muted-foreground">
        WhatsApp s’ouvre avec votre message déjà écrit.
      </p>
      <a
        href={mailtoUrl}
        className="flex min-h-11 items-center underline underline-offset-4 md:justify-center"
      >
        Pas de WhatsApp ? Envoyer par e-mail
      </a>
    </section>
  );
}
