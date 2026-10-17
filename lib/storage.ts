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

const URL_LIFETIME_S = 7 * 24 * 60 * 60
const DAY_MS = 24 * 60 * 60 * 1000

export async function uploadPhoto(key: string, body: Uint8Array, contentType: string) {
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }))
}

export async function deletePhotoFile(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}

/**
 * URL affichable d'une photo. Bucket privé : URL signée valable 7 jours.
 * La signature est arrondie au jour, donc l'URL reste identique pendant 24 h (le cache de next/image
 * fonctionne) et vaut encore au moins 6 jours. Les pages ne doivent pas être gardées en cache plus de 5 jours.
 */
export async function getPhotoUrl(src: string): Promise<string> {
  const signingDate = new Date(Math.floor(Date.now() / DAY_MS) * DAY_MS)
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: src }), {
    expiresIn: URL_LIFETIME_S,
    signingDate,
  })
}
