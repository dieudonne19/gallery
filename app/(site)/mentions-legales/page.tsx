import type { Metadata } from "next";
import Link from "next/link";

import { LEGAL } from "@/features/legal/config";
import { pageMetadata } from "@/lib/metadata";
import { LegalPage, LegalSection, legalLink } from "@/features/legal/components/LegalPage";

export const metadata: Metadata = pageMetadata(
  "Mentions légales",
  "Éditeur du site, propriété intellectuelle, données personnelles et cookies.",
);

export default function Page() {
  const { editor, email, host, updatedAt } = LEGAL;

  return (
    <LegalPage title="Mentions légales" updatedAt={updatedAt}>
      <LegalSection title="Éditeur du site">
        <p>
          Ce site est édité à titre personnel et non commercial par <strong>{editor}</strong>, développeur web et
          designer, qui en est aussi le directeur de la publication.
        </p>
        <p>
          Pour me joindre&nbsp;:{" "}
          {email ? (
            <>
              <a href={`mailto:${email}`} className={legalLink}>
                {email}
              </a>{" "}
              ou{" "}
            </>
          ) : null}
          la{" "}
          <Link href="/contact" className={legalLink}>
            page Contact
          </Link>
          .
        </p>
      </LegalSection>

      {host.name ? (
        <LegalSection title="Hébergement">
          <p>
            Ce site est hébergé par <strong>{host.name}</strong>
            {host.address ? `, ${host.address}` : ""}
            {host.phone ? `, tél. : ${host.phone}` : ""}.
          </p>
        </LegalSection>
      ) : null}

      <LegalSection title="Propriété intellectuelle">
        <p>
          Les photographies, les textes, les illustrations et la mise en page de ce site sont mon œuvre, sauf mention
          contraire. Ils sont protégés par le droit d’auteur.
        </p>
        <p>
          Les conditions d’utilisation des photographies sont détaillées dans la page{" "}
          <Link href="/droits-d-utilisation" className={legalLink}>
            Droits d’utilisation
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles et cookies">
        <p>
          Ce site ne vous demande aucune information. Il ne contient ni publicité, ni outil de mesure d’audience, ni
          service tiers de suivi.
        </p>
        <p>
          Aucun cookie n’est déposé sur votre appareil quand vous consultez le site. Le seul cookie qui existe sert à
          la connexion de l’espace d’administration, qui m’est réservé.
        </p>
        <p>
          La page Contact compose votre message dans votre navigateur, puis ouvre WhatsApp ou votre messagerie. Le
          message n’est donc pas transmis à ce site&nbsp;: il part de votre côté, selon les règles de confidentialité
          de l’application que vous choisissez. Si vous m’écrivez, j’utilise vos coordonnées uniquement pour vous
          répondre.
        </p>
        <p>
          Comme sur tout site, l’hébergeur peut conserver des journaux techniques de connexion (adresse IP, date, page
          demandée) pour assurer la sécurité et le bon fonctionnement du service.
        </p>
        <p>
          Vous pouvez demander l’accès, la rectification ou la suppression des données qui vous concernent en m’écrivant
          par les moyens indiqués plus haut.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilité">
        <p>
          Je soigne le contenu de ce site, sans pouvoir garantir qu’il soit toujours exempt d’erreur ni disponible en
          permanence. Je ne suis pas responsable du contenu des sites vers lesquels il peut renvoyer.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
