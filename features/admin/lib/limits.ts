/** Limites partagées par le navigateur (réduction avant l'envoi) et le serveur (contrôle à la réception). */

/** Plus grand côté de la photo enregistrée. Assez pour un écran large, bien plus léger que l'original. */
export const MAX_DIMENSION = 2000

/**
 * Poids maximal d'une photo envoyée. Vercel refuse les requêtes de plus de 4,5 Mo (erreur 413) :
 * on reste en dessous, avec de la marge pour les autres champs du formulaire.
 */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024
