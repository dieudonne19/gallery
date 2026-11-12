// Calcule la couleur dominante des photos qui n'en ont pas encore (ajoutées avant cette colonne).
// Lit chaque fichier dans le bucket et ne touche qu'à la colonne color. Relançable sans risque.
// Variables chargées via --env-file (voir package.json) : DATABASE_URL et celles du bucket (README).
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { neon } from "@neondatabase/serverless"

import { dominantColor } from "../features/admin/lib/dominant-color.ts"

const url = process.env.DATABASE_URL
if (!url) throw new Error("DATABASE_URL is not set")

const sql = neon(url)
const s3 = new S3Client({ forcePathStyle: true })
const bucket = process.env.S3_BUCKET ?? "project-images"

console.log(`Base : ${new URL(url).host}`)
const rows = await sql`select id, src from photos where color is null order by position`
let done = 0
for (const { id, src } of rows) {
  try {
    const object = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: src }))
    const color = await dominantColor(await object.Body.transformToByteArray())
    await sql`update photos set color = ${color} where id = ${id} and color is null`
    done++
    console.log(`${id} : ${color}`)
  } catch (error) {
    console.error(`${id} : échec (${src})`, error.message)
  }
}
console.log(`OK : ${done} sur ${rows.length} photos sans couleur.`)
