import type { NextConfig } from "next"

// Les photos du bucket (privé) sont servies par URL signée : next/image doit connaître son hôte.
const storage = process.env.AWS_ENDPOINT_URL_S3 ? new URL(process.env.AWS_ENDPOINT_URL_S3) : null

const isDev = process.env.NODE_ENV !== "production"

// Tout vient du site lui-même : les photos passent par /_next/image, les polices sont hébergées avec le site.
// shortcut: 'unsafe-inline' pour les scripts (Next.js en injecte pour s'hydrater) : la CSP bloque tout chargement ou envoi
// vers un autre site, mais pas un script injecté dans la page. Un nonce par requête fermerait ce trou (proxy.ts) ; à faire si le site accepte un jour du contenu de visiteurs.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "manifest-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
]

const nextConfig: NextConfig = {
  // Permet de lancer un second serveur en parallèle (tests) sans toucher au .next du premier.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: storage
      ? [
          {
            protocol: storage.protocol === "http:" ? "http" : "https",
            hostname: storage.hostname,
            pathname: `/${process.env.S3_BUCKET ?? "project-images"}/**`,
          },
        ]
      : [],
  },
  experimental: {
    // Vercel refuse les requêtes de plus de 4,5 Mo : le navigateur réduit donc la photo avant l'envoi
    // (features/admin/lib/resize-image.ts) et le serveur la limite à 4 Mo (features/admin/lib/limits.ts).
    serverActions: { bodySizeLimit: "4.5mb" },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ]
  },
}

export default nextConfig
