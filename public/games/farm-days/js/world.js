// Farm layout: zones, props, platforms, animals, collectibles. Everything is data so levels are easy to tweak.
import { rand, pick } from './util.js'

export const WORLD_W = 8400
export const GROUND = 570          // y of the walking lane (feet)
export const VIEW_W = 1280
export const VIEW_H = 720

export const SPECIES = {
  chicken:    { atlas: 'chicken',    size: 150, speed: 55,  walk: ['walk1', 'walk2', 'walk3'], idle: 'idle', happy: 'happy', graze: 'peck', sound: 'cluck' },
  cow:        { atlas: 'cow',        size: 330, speed: 28,  walk: ['walk1', 'walk2'],          idle: 'idle', happy: 'happy', sound: 'moo' },
  goat_black: { atlas: 'goat_black', size: 190, speed: 75,  walk: ['walk1', 'walk2'],          idle: 'idle', happy: 'happy', jump: 'jump', sound: 'baa' },
  goat_bw:    { atlas: 'goat_bw',    size: 190, speed: 75,  walk: ['walk1', 'walk2'],          idle: 'idle', happy: 'happy', jump: 'jump', sound: 'baa' },
  sheep:      { atlas: 'sheep',      size: 240, speed: 30,  walk: ['walk1', 'walk2'],          idle: 'idle', happy: 'idle',  graze: 'graze', sound: 'baa' },
  pig:        { atlas: 'pig',        size: 210, speed: 38,  walk: ['walk1', 'walk2'],          idle: 'idle', happy: 'happy', sound: 'cluck' },
  goose:      { atlas: 'goose',      size: 300, speed: 60,  walk: ['walk1', 'walk2'],          idle: 'idle', happy: 'honk',  sound: 'honk' },
}

// Pond cutaway: image is drawn behind the lane; these fractions of its width describe the water and banks.
export const POND = { x: 3300, w: 1500, groundFrac: 0.335, bankL: [0.135, 0.215], bankR: [0.785, 0.865], depth: 22 }
export const WATER_Y = GROUND + POND.depth
export const DOCK = { x0: POND.x + POND.w * 0.14, x1: POND.x + POND.w * 0.335, y: GROUND - 48 }   // deck: walk out and fish from the end

export const ZONES = [
  { x: 0,    name: 'Home Coop',    sign: 'HOME COOP' },
  { x: 1500, name: 'Goat Yard',    sign: 'GOAT YARD' },
  { x: 3100, name: "Nug's Pond",   sign: 'THE POND' },
  { x: 4900, name: 'Barn & Corn',  sign: 'BARN & CORN' },
  { x: 6700, name: 'Orchard Hill', sign: 'ORCHARD HILL' },
]

// Decorative props: name, x, height (px), z (-1 behind actors, 1 in front)
function props() {
  const p = []
  const add = (name, x, h, z = -1, flip = false) => p.push({ name, x, h, z, flip })
  // home
  add('coop', 620, 250); add('tree', 150, 380); add('picket_fence', 330, 150); add('picket_fence', 1120, 150)
  add('gate', 1450, 190)
  // goat yard
  add('board_fence', 1650, 170); add('board_fence', 2250, 170, -1, true)
  add('goat_ramp', 2050, 240, 0); add('pallets', 2365, 100, 0); add('picnic_table', 2495, 120, 0); add('spool_table', 2750, 100, 0)
  add('tree', 2900, 340)
  // pond lane trees
  add('tree', 3050, 420, -1, true); add('tree', 4950, 380, -1)
  // barn & corn
  add('barn', 5250, 430); add('silo', 5550, 560); add('tractor', 6150, 200)
  add('picket_fence', 4980, 150)
  // orchard
  add('tree', 6900, 430); add('tree', 7300, 480, -1, true); add('tree', 7750, 430); add('hay_bale', 6600, 110, -1)
  add('trough', 5900, 90, -1)
  return p
}

// Walkable surfaces: line segments (one-way, land from above). Ground itself is implicit except pits.
function platforms() {
  const P = []
  const seg = (x0, y0, x1, y1, tag) => P.push({ x0, y0, x1, y1, tag })
  // goat ramp: slopes up to the right then a deck
  seg(1790, GROUND, 2120, GROUND - 218, 'ramp'); seg(2120, GROUND - 218, 2325, GROUND - 218, 'deck')
  // picnic table + spool + pallets
  seg(2425, GROUND - 100, 2565, GROUND - 100, 'table')
  seg(2705, GROUND - 86, 2795, GROUND - 86, 'spool')
  seg(2315, GROUND - 92, 2405, GROUND - 92, 'pallets')
  // pond: banks slope into swimmable water; the dock deck sits at lane height
  const px = (f) => POND.x + POND.w * f
  seg(px(POND.bankL[0]), GROUND, px(POND.bankL[1]), WATER_Y, 'bank')
  seg(px(POND.bankL[1]), WATER_Y, px(POND.bankR[0]), WATER_Y, 'water')
  seg(px(POND.bankR[0]), WATER_Y, px(POND.bankR[1]), GROUND, 'bank')
  // dock reaching over the water from the left bank
  seg(DOCK.x0, DOCK.y, DOCK.x1, DOCK.y, 'dock')
  // hay bales near orchard
  seg(6545, GROUND - 100, 6655, GROUND - 100, 'hay')
  // barn hayloft ledge & cloud steps up to the golden egg
  seg(5120, GROUND - 190, 5290, GROUND - 190, 'ledge')
  return P
}

// y of the walking lane at x when no platform is there (open ground except the pond)
export function groundSegments() {
  const px = (f) => POND.x + POND.w * f
  return [
    { x0: -200, y0: GROUND, x1: px(POND.bankL[0]), y1: GROUND, tag: 'ground', solid: true },
    { x0: px(POND.bankR[1]), y0: GROUND, x1: WORLD_W + 200, y1: GROUND, tag: 'ground', solid: true },
  ]
}

export function makeWorld() {
  const animals = []
  const A = (type, x, extra = {}) => animals.push({
    type, x, dir: Math.random() < 0.5 ? -1 : 1, state: 'idle', t: rand(0, 2), anim: 0, hop: 0, happy: 0, home: x, range: 220, ...extra,
  })
  // chickens by the coop
  for (const x of [470, 560, 700, 790]) A('chicken', x, { range: 160, layT: rand(3, 8) })
  // goats
  A('goat_black', 1750, { range: 260, name: 'Cocoa' }); A('goat_bw', 2010, { range: 220, name: 'Domino' }); A('goat_bw', 2580, { range: 200, name: 'Pepper' })
  // geese: near pond start and barn
  A('goose', 3250, { range: 150, rideable: true }); A('goose', 5000, { range: 150, rideable: true })
  // cows, sheep, pig near barn / orchard
  A('cow', 5750, { range: 150, cow: true }); A('cow', 6350, { range: 120, cow: true })
  A('sheep', 7050, { range: 150 }); A('pig', 7450, { range: 140 })

  const items = []
  const I = (kind, x, y = GROUND - 36, extra = {}) => items.push({ kind, x, y, got: false, bob: rand(0, 6), ...extra })
  // stars along the path (bonus), arcs over obstacles
  for (const x of [300, 900, 1300, 1700, 2150, 2490, 2750, 3000, 4500, 4700, 5100, 5400, 5700, 6000, 6450, 6900, 7200, 7600, 7950]) I('star', x, GROUND - 90 - ((x / 7) % 3) * 40)
  // platform stars
  I('star', 2220, GROUND - 300); I('star', 2495, GROUND - 170); I('star', 2750, GROUND - 150); I('star', 2360, GROUND - 175); I('star', 5200, GROUND - 260); I('star', 6600, GROUND - 170)
  // sunflowers patch
  for (const x of [2870, 2940, 3010]) I('sunflower', x, GROUND - 40)
  // corn field
  for (const x of [5800, 5870, 6030, 6100, 6250]) I('corn', x, GROUND - 45)
  // apples
  for (const x of [6850, 6960, 7220, 7340, 7700]) I('apple', x, GROUND - 150 - rand(0, 80))
  I('golden_egg', 7480, GROUND - 340, { big: true })

  return { props: props(), platforms: [...groundSegments(), ...platforms()], animals, items, pit: null, eggs: [] }
}

export const PICK = pick
