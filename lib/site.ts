function siteUrl() {
  const url = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    "http://localhost:3000"
  ).replace(/\/$/, "")
  try {
    new URL(url)
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL est invalide : "${url}". Écrivez l'adresse complète, par exemple https://mon-domaine.com`)
  }
  return url
}

/**
 * Adresse publique du site, sans "/" final : sert aux adresses canoniques, au plan du site et aux images de partage.
 * Ordre : NEXT_PUBLIC_SITE_URL, sinon le domaine de production donné par Vercel, sinon l'adresse locale.
 */
export const SITE_URL = siteUrl()

export const SITE_NAME = "Hitako"
export const SITE_TITLE = `${SITE_NAME} — photographie de paysages`
export const SITE_DESCRIPTION =
  "Les paysages qui m’ont arrêté en chemin, classés par catégorie. Photographies de Dieudonné Andrianjato."
export const AUTHOR_NAME = "Dieudonné Andrianjato"
