import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Category, CategoryId } from "@/features/photos/types";

interface CategoryFilterProps {
  categories: Category[];
  active?: CategoryId;
}

export const chip = "inline-flex min-h-11 shrink-0 items-center rounded-full border border-border px-[18px]";

export function CategoryFilter({ categories, active }: CategoryFilterProps) {
  return (
    <nav
      aria-label="Catégories"
      // Mobile : centré s'il tient, sinon défile (marges auto sur les extrémités). Bureau : lignes centrées.
      className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-center md:px-0 [&::-webkit-scrollbar]:hidden [&>:first-child]:ml-auto [&>:last-child]:mr-auto md:[&>:first-child]:ml-0 md:[&>:last-child]:mr-0"
    >
      <Link
        href="/"
        aria-current={!active ? "page" : undefined}
        className={cn(chip, !active && "border-foreground bg-foreground text-background")}
      >
        Tout
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/?categorie=${category.id}`}
          aria-current={active === category.id ? "page" : undefined}
          className={cn(
            chip,
            active === category.id && "border-foreground bg-foreground text-background",
          )}
        >
          {category.label}
        </Link>
      ))}
    </nav>
  );
}
