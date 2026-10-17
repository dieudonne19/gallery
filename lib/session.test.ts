import assert from "node:assert/strict"
import { afterEach, beforeEach, test } from "node:test"

import { createSessionToken, isValidSessionToken, passwordMatches } from "./session.ts"

const saved = { secret: process.env.SESSION_SECRET, password: process.env.ADMIN_PASSWORD }

beforeEach(() => {
  process.env.SESSION_SECRET = "x".repeat(40)
  process.env.ADMIN_PASSWORD = "bon-mot-de-passe"
})

afterEach(() => {
  process.env.SESSION_SECRET = saved.secret
  process.env.ADMIN_PASSWORD = saved.password
})

test("un jeton fraîchement créé est valide", () => {
  assert.equal(isValidSessionToken(createSessionToken()), true)
})

test("un jeton modifié, vide ou absent est refusé", () => {
  const [expires, signature] = createSessionToken().split(".")
  assert.equal(isValidSessionToken(`${Number(expires) + 1}.${signature}`), false)
  assert.equal(isValidSessionToken(`${expires}.`), false)
  assert.equal(isValidSessionToken(""), false)
  assert.equal(isValidSessionToken(undefined), false)
})

test("un jeton expiré est refusé", (t) => {
  const token = createSessionToken()
  t.mock.timers.enable({ apis: ["Date"], now: Date.now() + 8 * 24 * 60 * 60 * 1000 })
  assert.equal(isValidSessionToken(token), false)
})

test("un jeton signé avec un autre secret est refusé", () => {
  const token = createSessionToken()
  process.env.SESSION_SECRET = "y".repeat(40)
  assert.equal(isValidSessionToken(token), false)
})

test("le mot de passe : bon, mauvais, ou non configuré", () => {
  assert.equal(passwordMatches("bon-mot-de-passe"), true)
  assert.equal(passwordMatches("mauvais"), false)
  delete process.env.ADMIN_PASSWORD
  assert.equal(passwordMatches("bon-mot-de-passe"), false)
})
