import { Eyebrow } from "@/components/shared/Eyebrow";
import { getPhotoById } from "@/features/photos/lib/queries";
import { PostcardForm } from "./PostcardForm";

interface ContactPageProps {
  /** Identifiant de photo (ex. lu dans ?photo=). Préremplit le champ. */
  photoId?: string;
}

export async function ContactPage({ photoId }: ContactPageProps) {
  const photo = photoId ? await getPhotoById(photoId) : undefined;

  return (
    <>
      <section className="px-4 pb-10 pt-8 md:px-16 md:pb-14 md:pt-[72px]">
        <Eyebrow className="mb-4">Contact</Eyebrow>
        <h1 className="font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-4xl">
          Envoyez-moi une carte postale.
        </h1>
        <p className="mt-4 max-w-xl text-xl text-muted-foreground">
          Dites-moi quelle photo vous a plu, ou posez votre question. Votre message m’arrive sur WhatsApp.
        </p>
      </section>

      <PostcardForm
        backdropSrc="/photos/p09.jpg"
        stampSrc="/photos/p08.jpg"
        initialPhoto={photo?.title}
      />
    </>
  );
}
