import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Le SDK lit AWS_ENDPOINT_URL_S3, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY et AWS_REGION.
const s3 = new S3Client({ forcePathStyle: true })
const bucket = process.env.S3_BUCKET ?? "project-images"

const URL_LIFETIME_S = 24 * 60 * 60
const HOUR_MS = 60 * 60 * 1000

export async function uploadPhoto(key: string, body: Uint8Array, contentType: string) {
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }))
}

export async function deletePhotoFile(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}

/**
 * URL affichable d'une photo. Bucket privé : URL signée valable 24 h.
 * La signature est arrondie à l'heure, donc l'URL reste identique pendant une heure
 * et le cache de next/image fonctionne. Les pages ne doivent pas être gardées en cache
 * plus de 23 h.
 */
export async function getPhotoUrl(src: string): Promise<string> {
  const signingDate = new Date(Math.floor(Date.now() / HOUR_MS) * HOUR_MS)
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: src }), {
    expiresIn: URL_LIFETIME_S,
    signingDate,
  })
}
