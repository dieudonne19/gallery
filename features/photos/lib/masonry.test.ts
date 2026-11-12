import assert from "node:assert/strict"
import { test } from "node:test"

import { heightVars, layoutAll, layoutMasonry, placementVars } from "./masonry.ts"

test("la première ligne se remplit de gauche à droite", () => {
  const { placements } = layoutMasonry([1.5, 0.66, 1, 1.5, 1], 3)
  assert.deepEqual(
    placements.slice(0, 3).map((p) => p.column),
    [0, 1, 2],
  )
  assert.ok(placements.slice(0, 3).every((p) => p.count === 0 && p.above === 0))
})

test("chaque carte suivante va dans la colonne la moins haute", () => {
  // Colonne 0 : paysage (court), colonne 1 : portrait (haut). La 3e carte va sous le paysage.
  const { placements } = layoutMasonry([2, 0.5, 1], 2)
  assert.equal(placements[2].column, 0)
  assert.equal(placements[2].count, 1)
  assert.equal(placements[2].above, 0.5)
})

test("les hauteurs des colonnes additionnent les cartes", () => {
  const { columns } = layoutMasonry([1, 1, 1, 1, 1], 2)
  assert.deepEqual(columns, [
    { height: 3, count: 3 },
    { height: 2, count: 2 },
  ])
})

test("les variables CSS couvrent chaque nombre de colonnes", () => {
  const layouts = layoutAll([1.5, 1])
  const vars = placementVars(layouts, 1)
  for (const n of [2, 3, 4, 5]) assert.equal(vars[`--c${n}`], 1)
  assert.match(heightVars(layouts)["--h2"], /^max\(calc\(0\.6667 \* var\(--w\) \+ 1 \* var\(--row\)\), calc\(1 \* var\(--w\)/)
})

test("une liste vide donne une grille de hauteur nulle", () => {
  assert.equal(heightVars(layoutAll([]))["--h3"], "0px")
})
