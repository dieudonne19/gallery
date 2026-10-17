import Link from "next/link"

import { Button } from "@/components/ui/button"
import { logout } from "@/features/admin/actions/auth"
import { isAdmin } from "@/lib/auth"
import { SITE_NAME } from "./nav"

// Header fixe, comme celui du site.
export async function AdminHeader() {
  const loggedIn = await isAdmin()

  return (
    <header className="sticky top-0 z-40 flex h-(--header-h) items-center justify-between border-b border-border bg-background px-4 md:px-16">
      <Link href={loggedIn ? "/admin" : "/"} className="flex min-h-11 items-center gap-3 font-serif text-xl">
        {SITE_NAME}
        <span className="hidden font-mono text-xs uppercase tracking-wider text-muted-foreground sm:inline">
          Administration
        </span>
      </Link>

      <nav aria-label="Administration" className="flex items-center gap-2 md:gap-5">
        <Link href="/" className="flex min-h-11 items-center underline-offset-4 hover:underline">
          Voir le site
        </Link>
        {loggedIn ? (
          <form action={logout}>
            <Button type="submit" variant="ghost" className="h-11 px-2">
              Se déconnecter
            </Button>
          </form>
        ) : null}
      </nav>
    </header>
  )
}
