import assert from "node:assert/strict"
import { test } from "node:test"

import { formatShooting } from "./shooting.ts"

test("réglages complets sur une ligne, objectif à part", () => {
  assert.deepEqual(
    formatShooting({ camera: "Fujifilm X-T4", lens: "XF23mm", focalLength: 23, aperture: 5.6, exposureTime: "1/250", iso: 160 }),
    { settings: "Fujifilm X-T4 · 23 mm · f/5,6 · 1/250 s · ISO 160", lens: "XF23mm" },
  )
})

test("seulement ce qui est connu", () => {
  assert.deepEqual(formatShooting({ aperture: 8, exposureTime: "1.5" }), { settings: "f/8 · 1,5 s", lens: undefined })
  assert.equal(formatShooting({}), undefined)
  assert.equal(formatShooting(undefined), undefined)
})
