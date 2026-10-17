import assert from "node:assert/strict"
import { test } from "node:test"

import { slugify } from "./slug.ts"

test("retire accents, majuscules et signes", () => {
  assert.equal(slugify("Couchers de soleil"), "couchers-de-soleil")
  assert.equal(slugify("Côtes"), "cotes")
  assert.equal(slugify("  Été -- 2024 !  "), "ete-2024")
})

test("deux noms qui diffèrent par les accents donnent la même adresse", () => {
  assert.equal(slugify("Côtes"), slugify("cotes"))
})

test("un nom sans lettre ni chiffre donne une adresse vide", () => {
  assert.equal(slugify("***"), "")
})

test("l'adresse ne dépasse pas 40 caractères et ne finit pas par un tiret", () => {
  const slug = slugify(`${"a".repeat(39)} b`)
  assert.ok(slug.length <= 40)
  assert.ok(!slug.endsWith("-"))
})
