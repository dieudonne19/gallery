import assert from "node:assert/strict"
import { test } from "node:test"

import { parsePhotoForm } from "./schemas.ts"

const form = (fields: Record<string, string>) => {
  const data = new FormData()
  for (const [k, v] of Object.entries({ title: "T", alt: "A", category: "ciels", place: "", year: "", ...fields })) data.set(k, v)
  return data
}

test("réglages de prise de vue facultatifs et tolérants", () => {
  const { data, errors } = parsePhotoForm(
    form({ camera: " Fujifilm X-T4 ", lens: "", focalLength: "23,5", aperture: "f/5,6", exposureTime: "1/250 s", iso: "160" }),
  )
  assert.deepEqual(errors, {})
  assert.equal(data?.camera, "Fujifilm X-T4")
  assert.equal(data?.lens, null)
  assert.equal(data?.focalLength, 23.5)
  assert.equal(data?.aperture, 5.6)
  assert.equal(data?.exposureTime, "1/250")
  assert.equal(data?.iso, 160)
})

test("champs absents : tout vaut null", () => {
  const { data } = parsePhotoForm(form({}))
  assert.equal(data?.focalLength, null)
  assert.equal(data?.exposureTime, null)
})

test("valeurs invalides refusées avec un message", () => {
  const { errors } = parsePhotoForm(form({ aperture: "200", exposureTime: "vite", iso: "12.5" }))
  assert.ok(errors.aperture && errors.exposureTime && errors.iso)
})
