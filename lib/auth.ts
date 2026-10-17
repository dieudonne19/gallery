import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { isValidSessionToken, SESSION_COOKIE } from "./session"

export async function isAdmin() {
  return isValidSessionToken((await cookies()).get(SESSION_COOKIE)?.value)
}

/** À appeler en tête de chaque page /admin et de chaque action serveur : le proxy ne suffit pas. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/connexion")
}
