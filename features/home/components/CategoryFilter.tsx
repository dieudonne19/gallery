import Link from "next/link";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/features/photos/data/photos";
import type { CategoryId } from "@/features/photos/types";

interface CategoryFilterProps {
  active?: CategoryId;
}

const chip =
  "inline-flex min-h-11 shrink-0 items-center rounded-full border border-border px-[18px]";

export function CategoryFilter({ active }: CategoryFilterProps) {
  return (
    <nav
      aria-label="Catégories"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <Link
        href="/"
        aria-current={!active ? "page" : undefined}
        className={cn(chip, !active && "border-foreground bg-foreground text-background")}
      >
        Tout
      </Link>
      {CATEGORIES.map((category) => (
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
