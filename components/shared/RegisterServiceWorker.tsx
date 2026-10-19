"use client"

import { useEffect } from "react"

/** Enregistre le service worker (public/sw.js) en production. En développement, il retire celui d'un essai précédent : ses fichiers en cache seraient périmés. */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return
    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch((error) => {
        console.error("Service worker non enregistré", error)
      })
    } else {
      navigator.serviceWorker.getRegistrations().then((all) => all.forEach((registration) => registration.unregister()))
    }
  }, [])

  return null
}
