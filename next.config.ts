import type { NextConfig } from "next"

// Les photos du bucket (privé) sont servies par URL signée : next/image doit connaître son hôte.
const storage = process.env.AWS_ENDPOINT_URL_S3 ? new URL(process.env.AWS_ENDPOINT_URL_S3) : null

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
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
    // Photos jusqu'à 8 Mo (voir features/admin/lib/image.ts) + champs du formulaire.
    // shortcut: si l'hébergeur plafonne le corps des requêtes (ex. 4,5 Mo), passer à un envoi direct par URL présignée.
    serverActions: { bodySizeLimit: "9mb" },
  },
  async headers() {
    return [
      // shortcut: pas de Content-Security-Policy, elle demande un nonce par requête ; à ajouter avant la mise en ligne.
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ]
  },
}

export default nextConfig
