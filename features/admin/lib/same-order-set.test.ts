import assert from "node:assert/strict"
import { test } from "node:test"

import { isPermutationOf, moveItem } from "./same-order-set.ts"

test("un nouvel ordre doit reprendre exactement les mêmes lignes", () => {
  assert.equal(isPermutationOf(["b", "a", "c"], ["a", "b", "c"]), true)
  assert.equal(isPermutationOf(["a", "b"], ["a", "b", "c"]), false)
  assert.equal(isPermutationOf(["a", "a", "b"], ["a", "b", "c"]), false)
  assert.equal(isPermutationOf(["a", "b", "x"], ["a", "b", "c"]), false)
})

test("déplacer un élément", () => {
  assert.deepEqual(moveItem(["a", "b", "c", "d"], 3, 0), ["d", "a", "b", "c"])
  assert.deepEqual(moveItem(["a", "b", "c", "d"], 0, 2), ["b", "c", "a", "d"])
  assert.deepEqual(moveItem(["a", "b"], 1, 1), ["a", "b"])
})
