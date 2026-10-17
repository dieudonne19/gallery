import { neon } from "@neondatabase/serverless"

const url = process.env.DATABASE_URL
if (!url) throw new Error("DATABASE_URL is not set (see .env.example)")

// Serveur uniquement : l'URL n'est pas NEXT_PUBLIC_, elle ne part jamais au navigateur.
export const sql = neon(url)
