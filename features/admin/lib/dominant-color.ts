import sharp from "sharp"

const hex = (value: number) => Math.round(value).toString(16).padStart(2, "0")

/**
 * Couleur dominante d'une photo, au format #rrggbb : la carte l'affiche pendant que la photo se charge.
 * Sans import relatif : scripts/backfill-colors.mjs l'utilise aussi, hors de Next.js.
 */
export async function dominantColor(bytes: Uint8Array): Promise<string> {
  const { dominant } = await sharp(bytes).stats()
  return `#${hex(dominant.r)}${hex(dominant.g)}${hex(dominant.b)}`
}
