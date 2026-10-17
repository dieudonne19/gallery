import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PhotoPage } from "@/features/photo";
import { getAdjacentPhotos, getPhotoById } from "@/features/photos/lib/queries";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const photo = await getPhotoById((await params).id);
  return { title: photo?.title };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const [photo, adjacent] = await Promise.all([getPhotoById(id), getAdjacentPhotos(id)]);
  if (!photo || !adjacent) notFound();

  return <PhotoPage photo={photo} prev={adjacent.prev} next={adjacent.next} />;
}
