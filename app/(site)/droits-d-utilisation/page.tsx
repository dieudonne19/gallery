import type { Metadata } from "next";
import Link from "next/link";

import { LEGAL } from "@/features/legal/config";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage, LegalSection, legalLink } from "@/features/legal/components/LegalPage";

export const metadata: Metadata = pageMetadata(
  "Droits d’utilisation",
  "Ce que vous pouvez faire librement des photographies de ce site, et comment demander une autorisation.",
);

export default function Page() {
  const { editor, updatedAt } = LEGAL;

  return (
    <LegalPage title="Droits d’utilisation" updatedAt={updatedAt}>
      <LegalSection title="En bref">
        <p>
          Les photographies de ce site sont mon œuvre&nbsp;: <strong>© {editor}, tous droits réservés</strong>. Je les
          partage par passion, et je tiens à ce qu’elles restent associées à mon nom.
        </p>
      </LegalSection>

      <LegalSection title="Ce que vous pouvez faire librement">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>Parcourir le site et regarder les photographies.</li>
          <li>Partager le lien d’une page ou d’une photo, y compris sur les réseaux sociaux.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Ce qui demande mon accord écrit">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>Copier, télécharger ou imprimer une photographie pour la diffuser ou la conserver au-delà de votre usage privé.</li>
          <li>La publier ailleurs&nbsp;: site, réseau social, article, livre, affiche, présentation.</li>
          <li>La modifier, la recadrer, la retoucher ou l’intégrer à une autre création.</li>
          <li>L’utiliser dans un cadre commercial&nbsp;: produit, publicité, vente.</li>
          <li>
            L’utiliser pour entraîner un système d’intelligence artificielle, ou pour en extraire des données. Je me
            réserve expressément ce droit d’opposition.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Demander une autorisation">
        <p>
          Écrivez-moi depuis la{" "}
          <Link href="/contact" className={legalLink}>
            page Contact
          </Link>{" "}
          en indiquant la photographie concernée, l’usage prévu et sa durée. Si je donne mon accord, la photographie
          doit être accompagnée de la mention «&nbsp;© {editor}&nbsp;».
        </p>
      </LegalSection>

      <LegalSection title="Une photographie utilisée sans accord&nbsp;?">
        <p>
          Si vous voyez l’une de mes photographies utilisée ailleurs sans mention ni autorisation, vous pouvez me le
          signaler par la{" "}
          <Link href="/contact" className={legalLink}>
            page Contact
          </Link>
          . Merci d’avance.
        </p>
      </LegalSection>

      <LegalSection title="À savoir">
        <p>
          Ces conditions peuvent évoluer. Pour les autres informations sur le site (éditeur, données personnelles),
          consultez les{" "}
          <Link href="/mentions-legales" className={legalLink}>
            mentions légales
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
