import type { Photo } from "@/features/photos/types";
import { PhotoCaption } from "./PhotoCaption";
import { PhotoNav } from "./PhotoNav";
import { PhotoViewer } from "./PhotoViewer";

interface PhotoPageProps {
  photo: Photo;
  prev: Photo;
  next: Photo;
}

export function PhotoPage({ photo, prev, next }: PhotoPageProps) {
  return (
    <>
      <PhotoViewer photo={photo} />
      <PhotoCaption photo={photo} />
      <PhotoNav prev={prev} next={next} />
    </>
  );
}
