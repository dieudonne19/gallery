import { cn } from "@/lib/utils";

type EyebrowProps = React.ComponentProps<"p">;

/** Petit libellé en capitales, police mono (lieu, année, titres de champ). */
export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-xs uppercase tracking-wider text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
