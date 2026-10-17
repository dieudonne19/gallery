import type { Metadata } from "next"

import { Eyebrow } from "@/components/shared/Eyebrow"
import { LoginForm } from "@/features/admin/components/LoginForm"

export const metadata: Metadata = { title: "Connexion" }

export default function Page() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-4 md:pt-16">
      <div className="flex flex-col gap-3">
        <Eyebrow>Administration</Eyebrow>
        <h1 className="font-serif text-[28px] font-normal leading-[1.1] tracking-tight md:text-4xl">Connexion</h1>
        <p className="text-muted-foreground">Cet espace est réservé à la gestion des photos du site.</p>
      </div>
      <LoginForm />
    </div>
  )
}
