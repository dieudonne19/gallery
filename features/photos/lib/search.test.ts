import assert from "node:assert/strict"
import { test } from "node:test"

import { cleanSearch, searchPatterns } from "./search.ts"

test("la recherche est nettoyée", () => {
  assert.equal(cleanSearch("  coucher   de  soleil "), "coucher de soleil")
  assert.equal(cleanSearch("   "), undefined)
  assert.equal(cleanSearch(["a"]), undefined)
  assert.equal(cleanSearch("x".repeat(300))?.length, 100)
})

test("un motif par mot, caractères spéciaux échappés", () => {
  assert.deepEqual(searchPatterns("coucher nosy"), ["%coucher%", "%nosy%"])
  assert.deepEqual(searchPatterns("100%_vrai\\"), ["%100\\%\\_vrai\\\\%"])
  assert.deepEqual(searchPatterns(undefined), [])
})
