import { NextResponse, type NextRequest } from "next/server"

import { isValidSessionToken, SESSION_COOKIE } from "@/lib/session"

// Première barrière seulement : chaque page et action revérifie la session (lib/auth.ts).
export function proxy(request: NextRequest) {
  const loggedIn = isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value)
  const onLogin = request.nextUrl.pathname === "/admin/connexion"

  if (!loggedIn && !onLogin) return NextResponse.redirect(new URL("/admin/connexion", request.url))
  if (loggedIn && onLogin) return NextResponse.redirect(new URL("/admin", request.url))
  return NextResponse.next()
}

export const config = { matcher: "/admin/:path*" }
