"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Lien de navigation qui se signale comme page en cours (aria-current), pour le style et les lecteurs d'écran. */
export function NavLink({ href, exact = false, ...props }: React.ComponentProps<typeof Link> & { href: string; exact?: boolean }) {
  const pathname = usePathname();
  const current = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return <Link href={href} aria-current={current ? "page" : undefined} {...props} />;
}
