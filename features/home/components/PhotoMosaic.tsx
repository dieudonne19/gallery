import { cn } from "@/lib/utils";
import { PhotoThumb } from "@/features/photos/components/PhotoThumb";
import type { Photo } from "@/features/photos/types";

function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += size) groups.push(items.slice(i, i + size));
  return groups;
}

/**
 * Grille éditoriale : une grande photo et deux petites, puis l'inverse.
 * Mobile : la grande photo en pleine largeur, les deux petites côte à côte.
 */
export function PhotoMosaic({ photos }: { photos: Photo[] }) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {chunk(photos, 3).map((group, index) => {
        const flip = index % 2 === 1;
        const [big, ...smalls] = group;

        if (group.length < 3) {
          return (
            <div key={big.id} className="grid grid-cols-2 gap-3 md:gap-4">
              {group.map((photo) => (
                <PhotoThumb key={photo.id} photo={photo} />
              ))}
            </div>
          );
        }

        return (
          <div
            key={big.id}
            className={cn(
              "grid grid-cols-2 gap-3 md:grid-rows-2 md:gap-4",
              flip ? "md:grid-cols-[1fr_2fr]" : "md:grid-cols-[2fr_1fr]",
            )}
          >
            <PhotoThumb
              photo={big}
              fill
              priority={index === 0}
              className={cn(
                "col-span-2 md:col-span-1 md:row-span-2",
                flip ? "order-last md:order-none md:col-start-2" : "md:col-start-1",
              )}
            />
            {smalls.map((photo, i) => (
              <PhotoThumb
                key={photo.id}
                photo={photo}
                className={cn(flip ? "md:col-start-1" : "md:col-start-2", i === 0 ? "md:row-start-1" : "md:row-start-2")}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
