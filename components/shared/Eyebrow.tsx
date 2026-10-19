import { cn } from "@/lib/utils"

type EyebrowProps = React.ComponentProps<"p">

/** Petit libellé en capitales espacées (lieu, année, titres de champ). */
export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
