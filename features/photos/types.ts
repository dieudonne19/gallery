/** Identifiant (adresse) d'une catégorie, ex. "couchers-de-soleil". Les catégories se gèrent depuis /admin/categories. */
export type CategoryId = string;

export interface Category {
  id: CategoryId;
  label: string;
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
  /** Facultatif : la page n'affiche rien si absent. */
  place?: string;
  /** Facultatif : peut venir des données EXIF de la photo. */
  year?: number;
}
