// Exécute db/schema.sql sur la base de DATABASE_URL (chargée via --env-file, voir package.json).
import { readFileSync } from "node:fs"
import { neon } from "@neondatabase/serverless"

const url = process.env.DATABASE_URL
if (!url) throw new Error("DATABASE_URL is not set")

const statements = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8")
  .split("\n")
  .filter((line) => !line.trimStart().startsWith("--"))
  .join("\n")
  .split(/;\s*\n/)
  .map((s) => s.trim())
  .filter(Boolean)

const sql = neon(url)
console.log(`Base : ${new URL(url).host}`)
for (const statement of statements) await sql.query(statement)

const [{ count }] = await sql.query("select count(*)::int as count from photos")
console.log(`OK : ${statements.length} requêtes, ${count} photos en base.`)
