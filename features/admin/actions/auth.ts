"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { createSessionToken, passwordMatches, SESSION_COOKIE, SESSION_MAX_AGE_S } from "@/lib/session"

export interface LoginState {
  error?: string
}

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password")
  if (typeof password !== "string" || password === "") return { error: "Saisissez le mot de passe." }

  if (password.length > 200 || !passwordMatches(password)) {
    // shortcut: un délai fixe ralentit les essais en boucle. Un vrai compteur par IP demande un stockage partagé (serverless).
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { error: "Mot de passe incorrect. Vérifiez-le et réessayez." }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  })
  redirect("/admin")
}

export async function logout() {
  // shortcut: le jeton est sans état, il reste valide jusqu'à son expiration ; changer SESSION_SECRET révoque toutes les sessions.
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect("/admin/connexion")
}
