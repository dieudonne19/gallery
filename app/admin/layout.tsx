import type { Metadata } from "next"

import { AdminHeader } from "@/components/layout/AdminHeader"
import { AdminNav } from "@/features/admin/components/AdminNav"
import { isAdmin } from "@/lib/auth"

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Administration" },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const loggedIn = await isAdmin()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AdminHeader />
      <main id="contenu" className="flex-1 px-4 py-8 md:px-16 md:py-12">
        {loggedIn ? <AdminNav /> : null}
        {children}
      </main>
    </div>
  )
}
