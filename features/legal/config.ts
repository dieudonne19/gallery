import { CONTACT_EMAIL } from "@/features/contact/config";

/** Informations des pages légales. À relire à chaque changement du site (hébergeur, services utilisés…). */
export const LEGAL = {
  editor: "Dieudonné Andrianjato",
  email: CONTACT_EMAIL,
  updatedAt: "17 octobre 2026",
  // Hébergeur : obligatoire pour un site publié (loi française LCEN, art. 6). À renseigner au moment du déploiement,
  // dans les variables d'environnement de l'hébergeur (voir .env.example). Sans nom, la rubrique n'est pas affichée.
  host: {
    name: process.env.LEGAL_HOST_NAME,
    address: process.env.LEGAL_HOST_ADDRESS,
    phone: process.env.LEGAL_HOST_PHONE,
  },
};
