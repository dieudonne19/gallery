import { ImageResponse } from "next/og"

import { SITE_NAME } from "@/lib/site"

// Aperçu des pages du site (WhatsApp, LinkedIn, Facebook…) quand elles n'ont pas de photo à montrer.
// Couleurs de app/globals.css ; hiérarchie : le titre domine, le nom du site et la phrase restent discrets.
export const alt = `${SITE_NAME} — Photographie de paysages`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const INK = "#1e2a2b"
const MUTED = "#55605f" // 5,8:1 sur le fond
const SUN = "#b4532a"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          background: "#f6f3ec",
          color: INK,
        }}
      >
        <div style={{ fontSize: 32, color: MUTED }}>{SITE_NAME}</div>
        <div
          style={{ display: "flex", flexDirection: "column", marginTop: 36, fontSize: 112, lineHeight: 1.05, letterSpacing: "-0.03em" }}
        >
          <div>Photographie</div>
          <div>de paysages</div>
        </div>
        <div style={{ marginTop: 20, fontSize: 36, color: MUTED }}>Mes photos, prises par passion.</div>

        <svg
          width="1200"
          height="170"
          viewBox="0 0 1200 170"
          style={{ position: "absolute", left: 0, bottom: 0 }}
        >
          <circle cx="930" cy="62" r="44" fill={SUN} />
          <path d="M0 170 L0 110 C200 50 380 120 600 90 C800 62 1000 110 1200 80 L1200 170 Z" fill="#d8d2c2" />
          <path d="M0 170 L0 140 C250 100 450 150 700 125 C900 105 1050 140 1200 120 L1200 170 Z" fill={INK} />
        </svg>
      </div>
    ),
    size,
  )
}
