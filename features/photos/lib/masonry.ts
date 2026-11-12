/**
 * Mosaïque : chaque carte va dans la colonne la moins haute, dans l'ordre de la liste.
 * Les trois premières photos se lisent donc de gauche à droite, et non colonne par colonne.
 *
 * Le calcul est fait pour chaque nombre de colonnes possible, sur le serveur comme dans le navigateur
 * (même résultat des deux côtés). Le CSS choisit ensuite la disposition selon la largeur réelle
 * de la grille (requêtes de conteneur, voir .masonry dans globals.css) : aucun script n'a besoin
 * de mesurer la page, et rien ne bouge au chargement.
 */

/**
 * Format de la carte (largeur ÷ hauteur) : celui de la photo. Seuls les formats extrêmes sont légèrement recadrés,
 * pour éviter une carte démesurée.
 */
export const cardRatio = ({ width, height }: { width: number; height: number }) =>
  Math.min(Math.max(width / height, 0.66), 2)

/** Nombres de colonnes possibles, du plus étroit au plus large (voir les seuils dans globals.css). */
export const COLUMN_COUNTS = [2, 3, 4, 5] as const
export type ColumnCount = (typeof COLUMN_COUNTS)[number]

/**
 * Espace vertical sous chaque carte (gouttière et légende), exprimé en largeurs de colonne : une estimation
 * suffit pour choisir la colonne la plus courte. Le CSS, lui, utilise les vraies valeurs en pixels.
 */
const ROW_SPACE: Record<ColumnCount, number> = { 2: 0.22, 3: 0.07, 4: 0.06, 5: 0.055 }

/** Place d'une carte : sa colonne, et ce qui la précède dans cette colonne. */
export interface Placement {
  column: number
  /** Somme des hauteurs des cartes au-dessus, en largeurs de colonne (hauteur = largeur ÷ format). */
  above: number
  /** Nombre de cartes au-dessus : chacune ajoute une gouttière (et une légende sur mobile). */
  count: number
}

export interface MasonryLayout {
  placements: Placement[]
  /** Pour chaque colonne : hauteur totale des cartes (en largeurs de colonne) et nombre de cartes. */
  columns: { height: number; count: number }[]
}

/** `ratios` : largeur ÷ hauteur de chaque carte, dans l'ordre d'affichage. */
export function layoutMasonry(ratios: number[], columnCount: ColumnCount): MasonryLayout {
  const columns = Array.from({ length: columnCount }, () => ({ height: 0, count: 0 }))
  const space = ROW_SPACE[columnCount]

  const placements = ratios.map((ratio) => {
    // Colonne la plus courte ; à égalité, la plus à gauche.
    let column = 0
    for (let i = 1; i < columns.length; i++) {
      if (columns[i].height + columns[i].count * space < columns[column].height + columns[column].count * space - 1e-9) {
        column = i
      }
    }
    const target = columns[column]
    const placement = { column, above: target.height, count: target.count }
    target.height += 1 / ratio
    target.count += 1
    return placement
  })

  return { placements, columns }
}

const round = (value: number) => Math.round(value * 10000) / 10000

/**
 * Variables CSS d'une carte, pour chaque nombre de colonnes : --c2 (colonne), --a2 (hauteur au-dessus), --n2 (cartes au-dessus)…
 */
export function placementVars(layouts: Record<ColumnCount, MasonryLayout>, index: number): Record<string, number> {
  const vars: Record<string, number> = {}
  for (const n of COLUMN_COUNTS) {
    const { column, above, count } = layouts[n].placements[index]
    vars[`--c${n}`] = column
    vars[`--a${n}`] = round(above)
    vars[`--n${n}`] = count
  }
  return vars
}

/**
 * Hauteur de la grille pour chaque nombre de colonnes : celle de la colonne la plus haute.
 * Comme les colonnes ne comptent pas toutes le même nombre de cartes, la plus haute dépend de la largeur :
 * on laisse le navigateur trancher avec max().
 */
export function heightVars(layouts: Record<ColumnCount, MasonryLayout>): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const n of COLUMN_COUNTS) {
    const terms = layouts[n].columns
      .filter((c) => c.count > 0)
      .map((c) => `calc(${round(c.height)} * var(--w) + ${c.count} * var(--row))`)
    vars[`--h${n}`] = terms.length ? `max(${terms.join(", ")})` : "0px"
  }
  return vars
}

export function layoutAll(ratios: number[]): Record<ColumnCount, MasonryLayout> {
  return Object.fromEntries(COLUMN_COUNTS.map((n) => [n, layoutMasonry(ratios, n)])) as Record<
    ColumnCount,
    MasonryLayout
  >
}
