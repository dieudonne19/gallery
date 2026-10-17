"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const SECTIONS = [
  { href: "/admin", label: "Photos" },
  { href: "/admin/categories", label: "Catégories" },
] as const

/** Navigation entre les sections de l'administration. */
export function AdminNav() {
  const pathname = usePathname()
  // « Photos » couvre aussi l'ajout et la modification (/admin/photos/…).
  const isCurrent = (href: string) =>
    href === "/admin" ? pathname === href || pathname.startsWith("/admin/photos") : pathname.startsWith(href)

  return (
    <nav aria-label="Sections de l’administration" className="mb-8 flex gap-6 border-b border-border">
      {SECTIONS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={isCurrent(href) ? "page" : undefined}
          className={cn(
            "-mb-px flex min-h-11 items-center border-b-2 border-transparent text-muted-foreground",
            isCurrent(href) && "border-foreground text-foreground",
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
