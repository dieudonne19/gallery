import { headers } from "next/headers"

import { sql } from "@/lib/db"

const MAX_ATTEMPTS = 5
export const LOCK_MINUTES = 15

async function clientIp() {
  // Sur Vercel, cet en-tête est posé par la plateforme (le visiteur ne peut pas l'imposer). shortcut: ailleurs, il serait falsifiable.
  const forwarded = (await headers()).get("x-forwarded-for")
  return forwarded?.split(",")[0].trim() || "unknown"
}

/**
 * Note la tentative AVANT de vérifier le mot de passe : des essais lancés en parallèle se voient tous dans le compte,
 * donc aucun ne passe entre la lecture et l'écriture. Retourne `blocked` si l'adresse a épuisé ses essais.
 */
export async function recordLoginAttempt() {
  const ip = await clientIp()
  const [{ attempts }] = await sql`
    with purge as (delete from login_attempts where attempted_at < now() - interval '1 day'),
         added as (insert into login_attempts (ip) values (${ip}) returning 1)
    select count(*)::int + 1 as attempts from login_attempts
    where ip = ${ip} and attempted_at > now() - make_interval(mins => ${LOCK_MINUTES})`
  return { ip, blocked: (attempts as number) > MAX_ATTEMPTS }
}

/** Mot de passe correct : on repart de zéro. */
export async function clearLoginAttempts(ip: string) {
  await sql`delete from login_attempts where ip = ${ip}`
}
