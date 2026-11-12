import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Category, CategoryId } from "@/features/photos/types";

interface CategoryFilterProps {
  categories: Category[];
  active?: CategoryId;
  /** Recherche en cours : elle reste active quand on change de catégorie. */
  search?: string;
}

export const chip =
  "inline-flex min-h-11 shrink-0 items-center rounded-full bg-secondary px-[18px] font-medium transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)]";
const activeChip = "bg-foreground text-background hover:bg-foreground";

export function CategoryFilter({ categories, active, search }: CategoryFilterProps) {
  const href = (category?: CategoryId) => {
    const params = new URLSearchParams();
    if (category) params.set("categorie", category);
    if (search) params.set("q", search);
    return params.size ? `/?${params}` : "/";
  };

  return (
    <nav
      aria-label="Catégories"
      // Une seule ligne, centrée si elle tient, sinon elle défile ; les bords s'estompent pour montrer qu'il y a une suite.
      className="flex gap-2 overflow-x-auto px-4 [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden [&>:first-child]:ml-auto [&>:last-child]:mr-auto"
    >
      <Link
        href={href()}
        aria-current={!active ? "page" : undefined}
        className={cn(chip, !active && activeChip)}
      >
        Tout
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={href(category.id)}
          aria-current={active === category.id ? "page" : undefined}
          className={cn(chip, active === category.id && activeChip)}
        >
          {category.label}
        </Link>
      ))}
    </nav>
  );
}
