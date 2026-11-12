import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/shared/JsonLd";
import { PhotoPage } from "@/features/photo";
import { getAdjacentPhotos, getPhotoById } from "@/features/photos/lib/queries";
import { baseOpenGraph } from "@/lib/metadata";
import { AUTHOR_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

/** Courte description pour les moteurs de recherche et les aperçus : la description de la photo, puis lieu et année. */
function describe(photo: { alt: string; place?: string; year?: number }) {
  const where = [photo.place, photo.year].filter(Boolean).join(", ");
  const text = where ? `${photo.alt} (${where})` : photo.alt;
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}…` : text;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const photo = await getPhotoById(id);
  if (!photo) return {};

  const description = describe(photo);
  const image = { url: `/photos/${id}/og`, width: 1200, height: 630, alt: photo.alt };
  return {
    title: photo.title,
    description,
    alternates: { canonical: `/photos/${id}` },
    openGraph: { ...baseOpenGraph, title: photo.title, description, url: `/photos/${id}`, images: [image] },
    twitter: { card: "summary_large_image", title: photo.title, description, images: [image.url] },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const [photo, adjacent] = await Promise.all([getPhotoById(id), getAdjacentPhotos(id)]);
  if (!photo || !adjacent) notFound();

  const author = { "@type": "Person", name: AUTHOR_NAME, url: SITE_URL };
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ImageObject",
          name: photo.title,
          description: photo.alt,
          contentUrl: `${SITE_URL}/photos/${id}/og`,
          url: `${SITE_URL}/photos/${id}`,
          creator: author,
          copyrightHolder: author,
          creditText: `© ${AUTHOR_NAME}`,
          acquireLicensePage: `${SITE_URL}/droits-d-utilisation`,
        }}
      />
      <PhotoPage photo={photo} prev={adjacent.prev} next={adjacent.next} />
    </>
  );
}
