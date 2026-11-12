import type { ShootingInfo } from "../types"

const decimal = (value: number) => String(value).replace(".", ",")

/**
 * Réglages de prise de vue à afficher, en une ligne : « Fujifilm X-T4 · 23 mm · f/8 · 1/250 s · ISO 160 ».
 * L'objectif vient à part (souvent long). `undefined` si rien n'est connu.
 */
export function formatShooting(info: ShootingInfo | undefined): { settings?: string; lens?: string } | undefined {
  if (!info) return undefined
  const settings = [
    info.camera,
    info.focalLength ? `${decimal(info.focalLength)} mm` : undefined,
    info.aperture ? `f/${decimal(info.aperture)}` : undefined,
    info.exposureTime ? `${info.exposureTime.replace(".", ",")} s` : undefined,
    info.iso ? `ISO ${info.iso}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ")
  if (!settings && !info.lens) return undefined
  return { settings: settings || undefined, lens: info.lens }
}
