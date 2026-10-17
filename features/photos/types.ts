export type CategoryId = "collines" | "cotes" | "couchers-de-soleil" | "ciels";

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
  /** Facultatif : la page n'affiche rien si absent. */
  place?: string;
  /** Facultatif : peut venir des données EXIF de la photo. */
  year?: number;
}
