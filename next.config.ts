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
    // Vercel refuse les requêtes de plus de 4,5 Mo : le navigateur réduit donc la photo avant l'envoi
    // (features/admin/lib/resize-image.ts) et le serveur la limite à 4 Mo (features/admin/lib/limits.ts).
    serverActions: { bodySizeLimit: "4.5mb" },
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
