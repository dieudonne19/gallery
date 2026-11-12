/** Identifiant (adresse) d'une catégorie, ex. "couchers-de-soleil". Les catégories se gèrent depuis /admin/categories. */
export type CategoryId = string;

export interface Category {
  id: CategoryId;
  label: string;
}

/** Réglages de prise de vue (tous facultatifs). */
export interface ShootingInfo {
  camera?: string;
  lens?: string;
  /** Focale, en millimètres. */
  focalLength?: number;
  /** Ouverture (le nombre f). */
  aperture?: number;
  /** Vitesse d'obturation, telle qu'on l'écrit : « 1/250 » ou « 2 » (secondes). */
  exposureTime?: string;
  iso?: number;
}

export interface Photo {
  id: string;
  src: string;
  title: string;
  alt: string;
  category: CategoryId;
  /** Nom de la catégorie, tel qu'il s'affiche. */
  categoryLabel: string;
  /** Dimensions de la photo enregistrée : chaque carte garde le format réel de sa photo. */
  width: number;
  height: number;
  /** Couleur dominante (#rrggbb), affichée pendant le chargement. Absente pour une photo ancienne pas encore traitée. */
  color?: string;
  /** Facultatif : la page n'affiche rien si absent. */
  place?: string;
  /** Facultatif : peut venir des données EXIF de la photo. */
  year?: number;
  /** Réglages de prise de vue : lus seulement pour la grande vue et l'administration (getPhotoById). */
  shooting?: ShootingInfo;
}
