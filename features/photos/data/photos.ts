import type { Category, Photo } from "../types";

export const CATEGORIES: Category[] = [
  { id: "collines", label: "Collines" },
  { id: "cotes", label: "Côtes" },
  { id: "couchers-de-soleil", label: "Couchers de soleil" },
  { id: "ciels", label: "Ciels" },
];

// Titres de travail décrits d'après les images : à remplacer par les vrais.
// `place` et `year` sont facultatifs.
export const PHOTOS: Photo[] = [
  { id: "p03", src: "/photos/p03.jpg", title: "Coucher de soleil sur les collines", alt: "Soleil couchant derrière des collines", category: "couchers-de-soleil" },
  { id: "p01", src: "/photos/p01.jpg", title: "Rizières en vallée", alt: "Rizières au creux d'une vallée", category: "collines" },
  { id: "p04", src: "/photos/p04.jpg", title: "Palmier et mer au coucher", alt: "Palmier face à la mer au coucher du soleil", category: "cotes" },
  { id: "p10", src: "/photos/p10.jpg", title: "Nuage orange", alt: "Nuage orange dans le ciel du soir", category: "ciels" },
  { id: "p07", src: "/photos/p07.jpg", title: "Plage au bord de la mer", alt: "Plage et palmiers", category: "cotes" },
  { id: "p02", src: "/photos/p02.jpg", title: "Collines dorées", alt: "Collines éclairées par une lumière dorée", category: "collines" },
  { id: "p12", src: "/photos/p12.jpg", title: "Ciel rouge sur la ville", alt: "Ciel rouge au-dessus des toits", category: "couchers-de-soleil" },
  { id: "p05", src: "/photos/p05.jpg", title: "Mer au coucher", alt: "Horizon sur la mer au coucher du soleil", category: "cotes" },
  { id: "p09", src: "/photos/p09.jpg", title: "Ponton sur le lac", alt: "Ponton en bois au bord d'un lac calme", category: "cotes" },
  { id: "p08", src: "/photos/p08.jpg", title: "Plage sous ciel gris", alt: "Plage sous un ciel gris", category: "cotes" },
  { id: "p14", src: "/photos/p14.jpg", title: "Arbres au coucher du soleil", alt: "Rangée d'arbres devant le soleil couchant", category: "couchers-de-soleil" },
  { id: "p06", src: "/photos/p06.jpg", title: "Vagues et palmier", alt: "Vagues au pied d'un palmier", category: "cotes" },
  { id: "p11", src: "/photos/p11.jpg", title: "Ciel orange", alt: "Ciel orange après le coucher du soleil", category: "ciels" },
  { id: "p13", src: "/photos/p13.jpg", title: "Nuages bleus", alt: "Gros nuages bleus au crépuscule", category: "ciels" },
];
