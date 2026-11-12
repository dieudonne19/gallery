import assert from "node:assert/strict"
import { test } from "node:test"

import { decodeCursor, encodeCursor } from "./cursor.ts"

test("un curseur encodé se relit à l'identique", () => {
  const cursor = { position: -3, createdAt: "2026-11-12 10:04:05.123456+00", id: "ab12cd34" }
  assert.deepEqual(decodeCursor(encodeCursor(cursor)), cursor)
})

test("un curseur invalide est refusé", () => {
  assert.equal(decodeCursor("pas-un-curseur"), null)
  assert.equal(decodeCursor(Buffer.from('["x","y","z"]').toString("base64url")), null)
  assert.equal(decodeCursor(42), null)
  assert.equal(decodeCursor("a".repeat(500)), null)
})
