import { createHmac, timingSafeEqual } from "node:crypto"

export const SESSION_COOKIE = "admin_session"
export const SESSION_MAX_AGE_S = 7 * 24 * 60 * 60

function secret() {
  const value = process.env.SESSION_SECRET
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be set (32+ characters)")
  return value
}

const hmac = (value: string) => createHmac("sha256", secret()).update(value).digest()

/** Jeton `expiration.signature`. Un seul admin : aucune autre donnée à porter. */
export function createSessionToken() {
  const expires = String(Date.now() + SESSION_MAX_AGE_S * 1000)
  return `${expires}.${hmac(expires).toString("base64url")}`
}

export function isValidSessionToken(token: string | undefined) {
  if (!token) return false
  const [expires, signature] = token.split(".")
  if (!expires || !signature) return false
  const given = Buffer.from(signature, "base64url")
  const expected = hmac(expires)
  return given.length === expected.length && timingSafeEqual(given, expected) && Number(expires) > Date.now()
}

/** Comparaison à temps constant : on compare les empreintes, de longueur fixe. */
export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return timingSafeEqual(hmac(input), hmac(expected))
}
