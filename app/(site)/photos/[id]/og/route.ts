import sharp from "sharp"

import { sql } from "@/lib/db"
import { getPhotoUrl } from "@/lib/storage"

/**
 * Image de partage d'une photo (1200 x 630, JPEG) : WhatsApp, Facebook, X… l'affichent quand on colle le lien.
 * Les photos sont dans un bucket privé, dont les adresses signées expirent : les réseaux sociaux ont besoin
 * d'une adresse stable, qui est celle-ci. Le CDN la garde en cache, donc le bucket n'est lu qu'une fois par jour.
 */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [photo] = await sql`select src from photos where id = ${id}`
  if (!photo) return new Response("Photo introuvable", { status: 404 })

  const source = await fetch(await getPhotoUrl(photo.src as string))
  if (!source.ok) return new Response("Image indisponible", { status: 502 })

  const image = await sharp(Buffer.from(await source.arrayBuffer()))
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82 })
    .toBuffer()

  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
