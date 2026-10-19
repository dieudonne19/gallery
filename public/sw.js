// Service worker de Hitako : rend le site installable et affiche une page « hors ligne » quand le réseau manque.
// Il ne garde en cache que les fichiers de l'interface (/_next/static, dont les noms changent à chaque version) et la page hors ligne.
// Jamais : les photos (adresses signées qui expirent), /admin, ni les requêtes qui modifient quelque chose.
// shortcut: VERSION est écrite à la main ; la changer si la page hors ligne change. Les anciens fichiers /_next/static restent
// en cache jusqu'à ce changement, ce qui est sans gravité pour un site de cette taille.
const VERSION = "hitako-v1"
const OFFLINE_URL = "/hors-ligne"

self.addEventListener("install", (event) => {
  event.waitUntil(precacheOfflinePage().then(() => self.skipWaiting()))
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin || url.pathname.startsWith("/admin")) return

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)))
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request))
  }
})

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) {
    const copy = response.clone()
    caches.open(VERSION).then((cache) => cache.put(request, copy))
  }
  return response
}

// La page hors ligne doit s'afficher sans réseau : on garde aussi ses styles, ses scripts et les polices que ses styles appellent.
async function precacheOfflinePage() {
  const cache = await caches.open(VERSION)
  const response = await fetch(OFFLINE_URL, { cache: "reload" })
  await cache.put(OFFLINE_URL, response.clone())

  const files = new Set((await response.text()).match(/\/_next\/static\/[^"'\s)\\]+/g) ?? [])
  await Promise.all([...files].map((file) => cache.add(file).catch(() => {})))

  for (const file of [...files].filter((f) => f.endsWith(".css"))) {
    const css = await (await cache.match(file))?.text()
    const fonts = css?.match(/\/_next\/static\/media\/[^"')\s]+/g) ?? []
    await Promise.all([...new Set(fonts)].map((font) => cache.add(font).catch(() => {})))
  }
}
