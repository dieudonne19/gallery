import assert from "node:assert/strict"
import { test } from "node:test"

import { formatExposure, hasExif, readExif } from "./exif.ts"

type Entry = { tag: number; type: 2 | 3 | 4 | 5; value: string | number | [number, number] }

/** Petit bloc TIFF (little-endian) : IFD0 (+ pointeurs Exif et GPS), puis l'IFD Exif et l'IFD GPS. */
function tiff(ifd0: Entry[], exif: Entry[], gps: Entry[]): Uint8Array {
  const bytes: number[] = []
  const u16 = (v: number) => bytes.push(v & 0xff, (v >> 8) & 0xff)
  const u32 = (v: number) => bytes.push(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff)
  const layout = (entries: Entry[]) => 2 + entries.length * 12 + 4
  const extraSize = (e: Entry) => (e.type === 2 ? String(e.value).length + 1 : e.type === 5 ? 8 : 0)
  const blockSize = (entries: Entry[]) => layout(entries) + entries.reduce((n, e) => n + (extraSize(e) > 4 ? extraSize(e) : 0), 0)

  const ifd0Full = [...ifd0, { tag: 0x8769, type: 4, value: 0 } as Entry, { tag: 0x8825, type: 4, value: 0 } as Entry]
  const ifd0At = 8
  const exifAt = ifd0At + blockSize(ifd0Full)
  const gpsAt = exifAt + blockSize(exif)
  ifd0Full[ifd0Full.length - 2].value = exifAt
  ifd0Full[ifd0Full.length - 1].value = gpsAt

  bytes.push(0x49, 0x49)
  u16(42)
  u32(ifd0At)
  for (const [entries, start] of [[ifd0Full, ifd0At], [exif, exifAt], [gps, gpsAt]] as const) {
    let extra = start + layout(entries)
    const extras: number[][] = []
    u16(entries.length)
    for (const e of entries) {
      u16(e.tag)
      u16(e.type)
      const size = extraSize(e)
      u32(e.type === 2 ? size : 1)
      const data: number[] = []
      if (e.type === 2) for (const c of String(e.value) + "\0") data.push(c.charCodeAt(0))
      if (e.type === 5) {
        const [a, b] = e.value as [number, number]
        for (const v of [a, b]) data.push(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff)
      }
      if (size > 4) {
        u32(extra)
        extra += size
        extras.push(data)
      } else if (e.type === 2) {
        bytes.push(...data, ...Array(4 - data.length).fill(0))
      } else if (e.type === 3) {
        u16(e.value as number)
        u16(0)
      } else u32(e.value as number)
    }
    u32(0)
    for (const data of extras) bytes.push(...data)
  }
  return new Uint8Array(bytes)
}

function jpeg(payload: Uint8Array): ArrayBuffer {
  const app1 = [...new TextEncoder().encode("Exif\0\0"), ...payload]
  const length = app1.length + 2
  return new Uint8Array([0xff, 0xd8, 0xff, 0xe1, length >> 8, length & 0xff, ...app1, 0xff, 0xd9]).buffer
}

const sample = tiff(
  [
    { tag: 0x010f, type: 2, value: "FUJIFILM" },
    { tag: 0x0110, type: 2, value: "X-T4" },
  ],
  [
    { tag: 0x829a, type: 5, value: [1, 250] },
    { tag: 0x829d, type: 5, value: [80, 10] },
    { tag: 0x8827, type: 3, value: 160 },
    { tag: 0x9003, type: 2, value: "2023:07:14 18:02:11" },
    { tag: 0x920a, type: 5, value: [230, 10] },
    { tag: 0xa434, type: 2, value: "XF23mmF1.4 R" },
  ],
  // GPS : latitude (0x0002), ne doit jamais ressortir.
  [{ tag: 0x0002, type: 5, value: [18, 1] }],
)

test("lit les réglages d'un JPEG", () => {
  assert.deepEqual(readExif(jpeg(sample)), {
    camera: "FUJIFILM X-T4",
    lens: "XF23mmF1.4 R",
    focalLength: 23,
    aperture: 8,
    exposureTime: "1/250",
    iso: 160,
    year: 2023,
  })
})

test("ne renvoie jamais de donnée GPS", () => {
  const keys = Object.keys(readExif(jpeg(sample)))
  assert.ok(keys.every((k) => ["camera", "lens", "focalLength", "aperture", "exposureTime", "iso", "year"].includes(k)))
})

test("lit le bloc EXIF d'un WebP et d'un PNG", () => {
  const riffSize = 4 + 8 + sample.length
  const webp = new Uint8Array([
    ...new TextEncoder().encode("RIFF"), riffSize & 0xff, (riffSize >> 8) & 0xff, 0, 0,
    ...new TextEncoder().encode("WEBPEXIF"), sample.length & 0xff, (sample.length >> 8) & 0xff, 0, 0,
    ...sample,
  ])
  assert.equal(readExif(webp.buffer).camera, "FUJIFILM X-T4")

  const png = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    0, 0, 0, 0, ...new TextEncoder().encode("IDAT"), 0, 0, 0, 0,
    0, 0, sample.length >> 8, sample.length & 0xff, ...new TextEncoder().encode("eXIf"), ...sample, 0, 0, 0, 0,
  ])
  assert.equal(readExif(png.buffer).iso, 160)
})

test("le modèle qui contient déjà la marque n'est pas doublé", () => {
  const canon = tiff([{ tag: 0x010f, type: 2, value: "Canon" }, { tag: 0x0110, type: 2, value: "Canon EOS R5" }], [], [])
  assert.equal(readExif(jpeg(canon)).camera, "Canon EOS R5")
})

test("un fichier sans EXIF ou abîmé donne un objet vide", () => {
  assert.deepEqual(readExif(new Uint8Array([0xff, 0xd8, 0xff, 0xd9]).buffer), {})
  assert.deepEqual(readExif(new Uint8Array([1, 2, 3]).buffer), {})
  assert.deepEqual(readExif(jpeg(sample.slice(0, 30))), {})
})

test("vitesse d'obturation lisible", () => {
  assert.equal(formatExposure(0.004), "1/250")
  assert.equal(formatExposure(2), "2")
  assert.equal(formatExposure(1.5), "1.5")
})

test("repère un fichier qui contient de l'EXIF", () => {
  assert.equal(hasExif(jpeg(sample)), true)
  assert.equal(hasExif(new Uint8Array([0xff, 0xd8, 0xff, 0xd9]).buffer), false)
})
