// Procedural pixel art: every sprite and tile is drawn in code onto small offscreen canvases.
export const TILE = 16

export function canvas(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false
  return [c, g]
}

// pixel painter helpers
export function painter(g) {
  const p = {
    px(x, y, c) { g.fillStyle = c; g.fillRect(x | 0, y | 0, 1, 1); return p },
    rect(x, y, w, h, c) { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); return p },
    ell(cx, cy, rx, ry, c) {
      g.fillStyle = c
      for (let y = Math.floor(cy - ry); y < Math.ceil(cy + ry); y++) {
        const dy = (y + 0.5 - cy) / ry
        if (Math.abs(dy) > 1) continue
        const w = rx * Math.sqrt(1 - dy * dy)
        const x0 = Math.round(cx - w), x1 = Math.round(cx + w)
        if (x1 > x0) g.fillRect(x0, y, x1 - x0, 1)
      }
      return p
    },
    disc(cx, cy, r, c) { return p.ell(cx, cy, r, r, c) },
    line(x0, y0, x1, y1, c, t = 1) {
      g.fillStyle = c
      x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1)
      const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
      let err = dx + dy
      for (;;) {
        g.fillRect(x0 - (t > 1 ? 1 : 0), y0 - (t > 1 ? 1 : 0), t, t)
        if (x0 === x1 && y0 === y1) break
        const e2 = 2 * err
        if (e2 >= dy) { err += dy; x0 += sx }
        if (e2 <= dx) { err += dx; y0 += sy }
      }
      return p
    },
  }
  return p
}

// Adds a 1px dark outline around every opaque pixel.
export function outline(c, col = '#1c1424') {
  const g = c.getContext('2d'), w = c.width, h = c.height
  const d = g.getImageData(0, 0, w, h).data
  const a = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : d[(y * w + x) * 4 + 3])
  g.fillStyle = col
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (a(x, y)) continue
    if (a(x - 1, y) || a(x + 1, y) || a(x, y - 1) || a(x, y + 1)) g.fillRect(x, y, 1, 1)
  }
  return c
}
export function flip(c) {
  const [o, g] = canvas(c.width, c.height)
  g.translate(c.width, 0); g.scale(-1, 1); g.drawImage(c, 0, 0)
  return o
}
export function sprite(w, h, fn, ol = true) {
  const [c, g] = canvas(w, h)
  fn(painter(g), g)
  return ol ? outline(c, typeof ol === 'string' ? ol : undefined) : c
}
export function tint(c, col) {
  const [o, g] = canvas(c.width, c.height)
  g.drawImage(c, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height)
  return o
}
function hash(x, y, s = 0) { let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }

// ----------------------------------------------------------------- characters
function girl(dir, frame, pal) {
  // dir: 0 down, 1 up, 2 right
  return sprite(16, 16, (p) => {
    const { hair, hairHi, skin, shirt, shirtDk, belt, boot, ribbon } = pal
    const step = frame === 1
    // legs
    if (dir === 2) {
      if (step) { p.rect(5, 12, 2, 3, boot); p.rect(9, 12, 2, 3, boot) } else { p.rect(7, 12, 3, 3, boot) }
    } else {
      if (step) { p.rect(5, 12, 2, 2, boot); p.rect(9, 12, 2, 3, boot) } else { p.rect(5, 12, 2, 3, boot); p.rect(9, 12, 2, 2, boot) }
    }
    // body / tunic
    p.rect(5, 9, 6, 4, shirt); p.rect(5, 12, 6, 1, shirtDk); p.rect(4, 12, 8, 1, shirt)
    p.rect(5, 11, 6, 1, belt)
    if (dir === 2) {
      p.rect(6, 9, 4, 4, shirt); p.rect(6, 11, 4, 1, belt)
      p.rect(step ? 9 : 7, 10, 2, 2, skin) // arm
    } else {
      p.rect(3, 9, 2, 2, shirtDk); p.rect(11, 9, 2, 2, shirtDk)
      p.rect(3, step ? 10 : 11, 2, 1, skin); p.rect(11, step ? 11 : 10, 2, 1, skin)
    }
    // head
    p.disc(8, 5, 5, hair)
    if (dir === 0) {
      p.rect(5, 5, 6, 4, skin); p.rect(4, 6, 1, 2, skin); p.rect(11, 6, 1, 2, skin)
      p.rect(5, 4, 6, 1, hair); p.rect(5, 5, 2, 1, hair); p.rect(9, 5, 1, 1, hair)
      p.px(6, 6, '#2b2050'); p.px(9, 6, '#2b2050'); p.px(5, 7, '#ff9aa8'); p.px(10, 7, '#ff9aa8'); p.px(7, 8, '#c2665a'); p.px(8, 8, '#c2665a')
      p.rect(6, 2, 4, 1, hairHi)
      p.rect(3, 5, 1, 4, hair); p.rect(12, 5, 1, 4, hair)
    } else if (dir === 1) {
      p.rect(6, 2, 4, 1, hairHi); p.rect(5, 4, 1, 1, hairHi)
      p.rect(7, 8, 2, 3, hair); p.rect(7, 10, 2, 1, hairHi)
    } else {
      p.rect(8, 4, 4, 5, skin); p.rect(12, 6, 1, 1, skin)
      p.rect(7, 3, 5, 2, hair); p.px(10, 6, '#2b2050'); p.px(11, 8, '#c2665a'); p.px(9, 7, '#ff9aa8')
      p.rect(2, 5, 3, 3, hair); p.rect(1, 6, 2, 3, hair); p.px(2, 6, hairHi)
      p.rect(6, 2, 4, 1, hairHi)
    }
    // ribbon
    if (dir === 2) { p.rect(4, 3, 2, 3, ribbon); p.px(3, 4, ribbon) } else { p.rect(10, 0, 2, 2, ribbon); p.rect(12, 1, 2, 2, ribbon); p.px(11, 2, ribbon) }
  })
}
const NORAH = { hair: '#8b4a2b', hairHi: '#b8723f', skin: '#f7c8a0', shirt: '#7b4fd6', shirtDk: '#563aa6', belt: '#f4c542', boot: '#6a3e24', ribbon: '#ff5fa0' }

function person(o) {
  return [0, 1].map((f) => sprite(16, 16, (p) => {
    const { hair, skin, shirt, pants, beard, hat, apron, bald } = o
    const bob = f
    p.rect(5, 12, 2, 3, pants); p.rect(9, 12, 2, 3, pants)
    p.rect(4, 9, 8, 4, shirt)
    if (apron) p.rect(5, 10, 6, 3, apron)
    p.rect(3, 9 + bob, 1, 3, skin); p.rect(12, 10 - bob, 1, 3, skin)
    p.disc(8, 5, 4.6, bald ? skin : hair)
    p.rect(5, 4, 6, 5, skin)
    if (!bald) p.rect(5, 3, 6, 2, hair)
    p.px(6, 6, '#2b2050'); p.px(9, 6, '#2b2050')
    if (beard) { p.rect(5, 7, 6, 3, beard); p.rect(6, 10, 4, 1, beard); p.px(7, 7, '#c2665a'); p.px(8, 7, '#c2665a') } else { p.px(7, 8, '#c2665a'); p.px(8, 8, '#c2665a') }
    if (hat) { p.rect(3, 2, 10, 1, hat); p.rect(5, 0, 6, 2, hat) }
    if (o.cane) p.rect(13, 8, 1, 7, '#7a4a22')
  }))
}

function corgi(frame) {
  return sprite(16, 16, (p) => {
    const o = '#e08a3a', w = '#fff6e8'
    p.ell(8, 10, 6, 3, o); p.ell(8, 11, 4, 2, w)
    p.rect(3, 12, 2, 3 - frame, o); p.rect(11, 12, 2, 2 + frame, o)
    p.rect(6, 12, 2, 2 + frame, o); p.rect(9, 12, 2, 3 - frame, o)
    p.disc(12, 6, 3.4, o); p.rect(12, 7, 4, 2, w); p.px(15, 7, '#2b2050')
    p.rect(10, 1, 2, 3, o); p.rect(13, 1, 2, 3, o); p.px(10, 2, '#ffb0a0'); p.px(14, 2, '#ffb0a0')
    p.px(13, 5, '#2b2050')
    p.rect(1, 8 - frame, 2, 2, o)
    // little cowboy hat
    p.rect(9, 3, 7, 1, '#9a5a2a'); p.rect(11, 1, 3, 2, '#9a5a2a')
  })
}
function frog(frame) {
  return sprite(16, 16, (p) => {
    const g = '#5cc85a', d = '#3c9a3e'
    p.ell(8, 11, 6, 4 - frame, g); p.ell(8, 12, 4, 2, '#d8f0a0')
    p.disc(5, 6 + frame, 2.6, g); p.disc(11, 6 + frame, 2.6, g)
    p.rect(4, 6 + frame, 2, 2, '#fff'); p.rect(10, 6 + frame, 2, 2, '#fff'); p.px(5, 7 + frame, '#111'); p.px(11, 7 + frame, '#111')
    p.rect(6, 11, 4, 1, d); p.rect(2, 14, 3, 1, d); p.rect(11, 14, 3, 1, d)
  })
}

// ----------------------------------------------------------------- enemies
const ENEMY_DRAW = {
  blob: (f) => sprite(16, 16, (p) => {
    p.ell(8, 11 + f, 6 + f, 5 - f, '#58c04a'); p.ell(7, 9 + f, 3, 2, '#9ae070'); p.px(5, 8 + f, '#e8ffd0')
    p.rect(5, 10 + f, 2, 2, '#fff'); p.rect(9, 10 + f, 2, 2, '#fff'); p.px(6, 11 + f, '#111'); p.px(10, 11 + f, '#111')
  }),
  buzzbee: (f) => sprite(16, 16, (p) => {
    p.ell(5, 4 + f, 3, 3 - f, '#e8f4ff'); p.ell(11, 4 + f, 3, 3 - f, '#e8f4ff')
    p.ell(8, 9, 5, 4, '#f6c832'); p.rect(6, 6, 1, 7, '#2a2a2a'); p.rect(9, 6, 1, 7, '#2a2a2a')
    p.px(13, 9, '#2a2a2a'); p.px(14, 9, '#2a2a2a'); p.rect(3, 8, 2, 2, '#fff'); p.px(3, 9, '#111')
  }),
  thornback: (f) => sprite(16, 16, (p) => {
    for (let i = 0; i < 3; i++) { p.rect(2, 7 + i * 3 + f, 2, 1, '#3a2020'); p.rect(12, 7 + i * 3 - f, 2, 1, '#3a2020') }
    p.disc(8, 9, 5.5, '#d8443c'); p.disc(8, 9, 3, '#b02e2e')
    for (const [x, y] of [[8, 3], [4, 6], [12, 6], [8, 9], [5, 12], [11, 12]]) { p.px(x, y, '#fff'); p.px(x, y - 1, '#ffe0e0') }
    p.rect(6, 13, 4, 2, '#3a2020'); p.px(6, 14, '#ff0'); p.px(9, 14, '#ff0')
  }),
  crab: (f) => sprite(16, 16, (p) => {
    p.ell(8, 10, 6, 4, '#ec7a32'); p.ell(8, 9, 4, 2, '#ffa860')
    p.disc(2.5, 8 - f, 2.4, '#ec7a32'); p.disc(13.5, 8 + f, 2.4, '#ec7a32'); p.px(2, 6 - f, '#fff'); p.px(13, 6 + f, '#fff')
    p.rect(6, 4, 1, 3, '#ec7a32'); p.rect(9, 4, 1, 3, '#ec7a32'); p.rect(5, 3, 2, 2, '#fff'); p.rect(9, 3, 2, 2, '#fff'); p.px(6, 4, '#111'); p.px(9, 4, '#111')
    for (let i = 0; i < 3; i++) { p.px(3 + i * 2, 14 - f, '#a84a18'); p.px(9 + i * 2, 14 + f - 1, '#a84a18') }
  }),
  bat: (f) => sprite(16, 16, (p) => {
    const c = '#5a8ae8', d = '#3a5ab0'
    if (f) { p.line(1, 4, 6, 8, c, 2); p.line(15, 4, 10, 8, c, 2); p.rect(1, 3, 2, 3, d); p.rect(13, 3, 2, 3, d) } else { p.line(1, 11, 6, 8, c, 2); p.line(15, 11, 10, 8, c, 2); p.rect(1, 10, 2, 3, d); p.rect(13, 10, 2, 3, d) }
    p.disc(8, 8, 3.5, c); p.px(6, 4, c); p.px(10, 4, c); p.px(7, 8, '#fff'); p.px(9, 8, '#fff'); p.px(8, 10, '#fff')
  }),
  wisp: (f) => sprite(16, 16, (p) => {
    const c = '#9a5ad8', l = '#c89aff'
    p.disc(8, 7, 5, c); p.rect(3, 7, 10, 4, c)
    for (let i = 0; i < 5; i++) p.rect(3 + i * 2, 11 + ((i + f) % 2), 2, 2, c)
    p.disc(7, 5, 2, l); p.rect(5, 7, 2, 2, '#fff'); p.rect(9, 7, 2, 2, '#fff'); p.px(6, 8, '#300'); p.px(10, 8, '#300')
  }, '#160a24'),
  snowman: (f) => sprite(16, 16, (p) => {
    p.disc(8, 11, 4.6, '#f4faff'); p.disc(8, 5, 3.4, '#f4faff'); p.px(7, 4, '#111'); p.px(9, 4, '#111'); p.rect(8, 5, 2, 1, '#f08a2a')
    p.line(3, 9 - f, 0, 6 - f, '#7a4a22'); p.line(13, 9 + f, 16, 6 + f, '#7a4a22'); p.rect(5, 1, 6, 1, '#3a3a5a'); p.rect(6, 0, 4, 1, '#3a3a5a')
  }),
}

// ----------------------------------------------------------------- bosses
function bossMole(f, state) {
  return sprite(40, 40, (p) => {
    if (state === 'under') { p.ell(20, 32, 15, 6, '#7a5230'); p.ell(20, 30, 11, 4, '#9a6a40'); for (let i = 0; i < 6; i++) p.px(10 + i * 4, 29 + (i % 2), '#5a3a20'); return }
    p.ell(20, 26, 15, 12, '#7a5a48'); p.ell(20, 29, 10, 8, '#c49a7a')
    p.rect(4, 28 + f, 6, 4, '#f0d0b0'); p.rect(30, 28 - f, 6, 4, '#f0d0b0'); for (let i = 0; i < 3; i++) { p.px(4 + i * 2, 32 + f, '#fff'); p.px(30 + i * 2, 32 - f, '#fff') }
    p.disc(20, 23, 3, '#ff8aa8'); p.px(14, 18, '#111'); p.px(15, 18, '#111'); p.px(25, 18, '#111'); p.px(26, 18, '#111')
    p.ell(20, 11, 16, 7, '#d83a3a'); p.rect(14, 14, 12, 4, '#f4e8d0')
    for (const [x, y, r] of [[12, 9, 2.5], [21, 7, 3], [29, 10, 2]]) p.disc(x, y, r, '#fff')
  })
}
function bossCrab(f, cracked, hurt) {
  return sprite(48, 40, (p) => {
    p.disc(5, 18 - f, 5, '#c85a2a'); p.disc(43, 18 + f, 5, '#c85a2a'); p.rect(3, 13 - f, 4, 3, '#1a0a0a'); p.rect(41, 13 + f, 4, 3, '#1a0a0a')
    for (let i = 0; i < 4; i++) { p.line(12 + i * 3, 30, 8 + i * 3, 37 - (f + i) % 2 * 2, '#8a3a1a', 2); p.line(36 - i * 3, 30, 40 - i * 3, 37 - (f + i + 1) % 2 * 2, '#8a3a1a', 2) }
    p.ell(24, 30, 12, 6, hurt ? '#fff' : '#ff6a5a'); p.rect(19, 28, 3, 3, '#fff'); p.rect(27, 28, 3, 3, '#fff'); p.px(20, 29, '#111'); p.px(28, 29, '#111')
    if (!cracked) {
      p.ell(24, 20, 17, 12, '#8a8a98'); p.ell(22, 16, 11, 6, '#aaaab8'); p.disc(14, 22, 3, '#6a6a78'); p.disc(32, 18, 2.5, '#6a6a78'); p.disc(26, 26, 2, '#6a6a78')
    } else {
      p.ell(24, 20, 17, 12, '#7a7a88'); p.line(14, 12, 22, 22, '#3a3a48', 2); p.line(22, 22, 30, 14, '#3a3a48', 2); p.line(22, 22, 24, 31, '#3a3a48', 2)
      p.ell(24, 22, 6, 4, hurt ? '#fff' : '#ff8ab0')
    }
  })
}
function bossOwl(f, dark) {
  const body = dark ? '#3a2458' : '#9ad0f0', belly = dark ? '#5a3a80' : '#e8f6ff', wing = dark ? '#2a1640' : '#6aa8d8', eye = dark ? '#ffd23a' : '#fff'
  return sprite(48, 40, (p) => {
    if (f) { p.ell(8, 14, 9, 6, wing); p.ell(40, 14, 9, 6, wing) } else { p.ell(8, 24, 8, 9, wing); p.ell(40, 24, 8, 9, wing) }
    p.ell(24, 22, 13, 15, body); p.ell(24, 27, 8, 9, belly)
    for (let i = 0; i < 3; i++) p.line(20 + i * 4, 24 + (i % 2) * 2, 22 + i * 4, 26 + (i % 2) * 2, body)
    p.px(13, 7, body); p.rect(12, 5, 3, 3, body); p.rect(33, 5, 3, 3, body)
    p.disc(19, 15, 4.5, eye); p.disc(29, 15, 4.5, eye); p.disc(19, 16, 2, '#111'); p.disc(29, 16, 2, '#111')
    if (dark) { p.line(14, 10, 22, 13, '#111', 2); p.line(34, 10, 26, 13, '#111', 2) }
    p.rect(23, 19, 2, 3, '#f0a030'); p.rect(19, 36, 3, 2, '#f0a030'); p.rect(26, 36, 3, 2, '#f0a030')
  })
}

// ----------------------------------------------------------------- items & icons
const ICONS = {
  sword: () => sprite(16, 16, (p) => { p.line(4, 12, 12, 4, '#e8f0ff', 2); p.line(5, 12, 12, 5, '#9ab0d0'); p.line(3, 9, 7, 13, '#e0a020', 2); p.rect(2, 13, 2, 2, '#7a4a22') }),
  boomerang: () => sprite(16, 16, (p) => { p.line(3, 12, 7, 4, '#f08a2a', 3); p.line(7, 4, 13, 9, '#f08a2a', 3); p.px(7, 4, '#ffd080'); p.px(4, 11, '#c05a10'); p.px(12, 9, '#c05a10') }),
  bomb: () => sprite(16, 16, (p) => { p.disc(8, 10, 5, '#2a3a6a'); p.disc(6, 8, 1.5, '#8aa0e0'); p.rect(7, 3, 2, 3, '#a08060'); p.px(9, 2, '#ffcc33'); p.px(10, 1, '#ff6a20') }),
  bow: () => sprite(16, 16, (p) => { p.line(4, 2, 2, 8, '#a0602a', 2); p.line(2, 8, 4, 14, '#a0602a', 2); p.line(4, 2, 4, 14, '#eee'); p.line(5, 8, 14, 8, '#c8a070'); p.rect(12, 7, 2, 3, '#ccc') }),
  arrow: () => sprite(16, 16, (p) => { p.line(2, 8, 13, 8, '#c8a070'); p.rect(12, 7, 2, 3, '#d8d8e8'); p.px(14, 8, '#d8d8e8'); p.rect(2, 6, 2, 1, '#fff'); p.rect(2, 10, 2, 1, '#fff') }),
  key: () => sprite(16, 16, (p) => { p.disc(5, 6, 3, '#f4c542'); p.disc(5, 6, 1.2, 'rgba(0,0,0,0)'); p.rect(4, 5, 2, 2, '#9a6a10'); p.rect(7, 5, 7, 2, '#f4c542'); p.rect(11, 7, 1, 3, '#f4c542'); p.rect(13, 7, 1, 2, '#f4c542') }),
  bigkey: () => sprite(16, 16, (p) => { p.disc(5, 6, 4, '#f4c542'); p.disc(5, 6, 1.6, '#e03050'); p.rect(8, 5, 7, 3, '#f4c542'); p.rect(11, 8, 2, 3, '#f4c542'); p.rect(14, 8, 1, 3, '#f4c542') }),
  heart: () => heartFixed(1, 16),
  heartpiece: () => sprite(16, 16, (p) => { p.disc(5, 6, 3.5, '#ff3a5a'); p.rect(2, 7, 6, 2, '#ff3a5a'); p.line(2, 8, 8, 14, '#ff3a5a', 2); p.rect(8, 3, 1, 12, '#ffd0d8'); p.rect(2, 9, 6, 1, '#ffd0d8'); p.px(4, 5, '#fff') }),
  container: () => sprite(16, 16, (p) => { p.disc(5, 6, 4, '#ff3a5a'); p.disc(11, 6, 4, '#ff3a5a'); p.ell(8, 9, 7, 4, '#ff3a5a'); p.line(2, 9, 8, 15, '#ff3a5a', 2); p.line(14, 9, 8, 15, '#ff3a5a', 2); p.rect(4, 8, 8, 4, '#ff3a5a'); p.px(4, 4, '#fff'); p.px(5, 4, '#fff'); p.px(4, 5, '#fff') }),
  gem: () => gem('#3ad06a', '#a8ffc0'),
  gem5: () => gem('#3a8af0', '#b0d8ff'),
  gem20: () => gem('#f04a5a', '#ffc0c8'),
  map: () => sprite(16, 16, (p) => { p.rect(2, 3, 12, 10, '#f0e0b0'); p.rect(3, 4, 4, 3, '#8ac070'); p.rect(8, 8, 5, 3, '#8ac070'); p.px(10, 5, '#e03030'); p.px(11, 6, '#e03030'); p.px(11, 4, '#e03030'); p.px(12, 5, '#e03030') }),
}
function gem(c, l) { return sprite(16, 16, (p) => { for (let y = 0; y < 12; y++) { const w = y < 4 ? 2 + y : 2 + (11 - y) * 0.75; p.rect(8 - w, 2 + y, w * 2, 1, c) } p.rect(6, 4, 2, 4, l); p.px(9, 5, l) }) }
function heartFixed(fill, size) {
  const [c, g] = canvas(size, size)
  const s = size / 8, col = '#ff3a5a', empty = '#5a2030'
  const p = painter(g)
  const draw = (pp, cc) => { pp.disc(2.5 * s, 3 * s, 2 * s, cc); pp.disc(5.5 * s, 3 * s, 2 * s, cc); for (let y = 0; y < 4 * s; y++) pp.rect(0.5 * s + y, 3 * s + y, 7 * s - y * 2, 1, cc) }
  draw(p, empty)
  if (fill > 0) {
    const [c2, g2] = canvas(size, size); const p2 = painter(g2); draw(p2, col); p2.px(2 * s, 2 * s, '#ffd0d8')
    g.drawImage(c2, 0, 0, fill >= 1 ? size : size / 2, size, 0, 0, fill >= 1 ? size : size / 2, size)
  }
  return outline(c)
}

function songstone(c, l) {
  return sprite(16, 16, (p) => {
    p.disc(8, 8, 6, c); p.disc(7, 7, 4, l); p.disc(8, 8, 3, c)
    p.rect(8, 4, 1, 6, '#fff'); p.rect(9, 4, 2, 1, '#fff'); p.rect(10, 5, 1, 1, '#fff'); p.disc(7, 10, 1.4, '#fff')
  })
}

// ----------------------------------------------------------------- props & fx
function chest(open) {
  return sprite(16, 16, (p) => {
    p.rect(1, 6, 14, 9, '#9a5a22'); p.rect(1, 6, 14, 1, '#c07a3a')
    if (open) { p.rect(1, 2, 14, 4, '#6a3a12'); p.rect(2, 7, 12, 3, '#3a1a08') } else { p.rect(1, 3, 14, 5, '#b06a2a'); p.rect(1, 3, 14, 1, '#d08a4a') }
    p.rect(1, 8, 14, 1, '#f4c542'); p.rect(7, 7, 2, 4, '#f4c542'); p.rect(1, 3, 1, 12, '#f4c542'); p.rect(14, 3, 1, 12, '#f4c542')
  })
}
function pushBlock(theme) {
  return sprite(16, 16, (p) => {
    p.rect(0, 0, 16, 16, theme.wallDk); p.rect(1, 1, 14, 13, theme.wall); p.rect(1, 1, 14, 2, theme.wallHi); p.rect(4, 5, 8, 5, theme.wallDk); p.rect(5, 6, 6, 3, theme.wall)
  }, false)
}

export function buildFx() {
  const puff = [0, 1, 2, 3].map((i) => sprite(16, 16, (p) => { const r = 2 + i * 1.6; for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + i * 0.3; p.disc(8 + Math.cos(a) * i * 2, 8 + Math.sin(a) * i * 2, Math.max(1, r - i * 0.5), i < 3 ? '#fff' : '#ddd') } }, false))
  const boom = [0, 1, 2, 3, 4].map((i) => sprite(40, 40, (p) => {
    const r = 6 + i * 3.5
    p.disc(20, 20, r, i < 3 ? '#ff7a20' : '#aaa'); p.disc(20, 20, r * 0.7, i < 3 ? '#ffd040' : '#ccc'); if (i < 2) p.disc(20, 20, r * 0.35, '#fff')
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 + i; p.disc(20 + Math.cos(a) * r, 20 + Math.sin(a) * r, 3 - i * 0.4, i < 3 ? '#ff5a10' : '#999') }
  }, false))
  const sparkle = [0, 1, 2].map((i) => sprite(8, 8, (p) => { const l = 1 + i; p.rect(4 - l, 4, l * 2, 1, '#fff'); p.rect(4, 4 - l, 1, l * 2, '#fff'); p.px(4, 4, '#ffffa0') }, false))
  const shadow = sprite(12, 4, (p) => p.ell(6, 2, 6, 2, 'rgba(0,0,0,0.3)'), false)
  const orb = [0, 1].map((f) => sprite(10, 10, (p) => { p.disc(5, 5, 4.5, '#3a1a5a'); p.disc(5, 5, 3, f ? '#c070ff' : '#9a40e0'); p.px(4, 3, '#fff') }, false))
  const rockShot = sprite(8, 8, (p) => { p.disc(4, 4, 3, '#9a8a7a'); p.px(3, 3, '#ccc') })
  const icicle = sprite(8, 14, (p) => { for (let y = 0; y < 12; y++) p.rect(4 - (12 - y) / 4, y, (12 - y) / 2, 1, '#cfefff'); p.rect(3, 0, 1, 8, '#fff') })
  return { puff, boom, sparkle, shadow, orb, rockShot, icicle }
}

// ----------------------------------------------------------------- tiles
export const THEMES = {
  meadow: { grass: '#74c850', grass2: '#5eae40', grassDk: '#3e8a2e', path: '#e6c88a', path2: '#ccaa6a', tree: '#2f8a3a', treeHi: '#4cae4a', cliff: '#9a7a52', cliffDk: '#6a5034', water: '#4a9ae8', waterHi: '#9ad4ff' },
  woods: { grass: '#559c44', grass2: '#468a38', grassDk: '#2e6a2a', path: '#c8a870', path2: '#a88a58', tree: '#1f6a32', treeHi: '#3a8a3e', cliff: '#7a6040', cliffDk: '#4e3a26', water: '#3a7ac8', waterHi: '#8ac0f0' },
  hills: { grass: '#a8b85a', grass2: '#92a24a', grassDk: '#6a7a32', path: '#d8b078', path2: '#b89058', tree: '#5a8a3a', treeHi: '#7aaa4a', cliff: '#a0704a', cliffDk: '#6a4628', water: '#4a9ae8', waterHi: '#9ad4ff' },
  peak: { grass: '#eef4fc', grass2: '#dce6f4', grassDk: '#b8c8e0', path: '#cad8ea', path2: '#b0c2da', tree: '#2e6a5a', treeHi: '#4a8a76', cliff: '#7a8aa8', cliffDk: '#4e5a78', water: '#6ab0e8', waterHi: '#d0f0ff', snow: true },
  tower: { grass: '#7a8a6a', grass2: '#6a7a5a', grassDk: '#4a5a40', path: '#9a8aa0', path2: '#7a6a80', tree: '#3a4a3a', treeHi: '#5a6a4a', cliff: '#4a3a5a', cliffDk: '#2a1e38', water: '#4a5a9a', waterHi: '#8a9ad0' },
  leafy: { dungeon: true, wall: '#4a7a3e', wallHi: '#7aac5a', wallDk: '#28462a', floor: '#9a8a5c', floor2: '#887a50' },
  crystal: { dungeon: true, wall: '#5e4ea6', wallHi: '#a898ec', wallDk: '#2e245c', floor: '#706890', floor2: '#625a80' },
  frost: { dungeon: true, wall: '#5a8ab8', wallHi: '#c8ecff', wallDk: '#2e4a70', floor: '#b0d0e4', floor2: '#a0c0d6' },
  hush: { dungeon: true, wall: '#4e3466', wallHi: '#8a64b0', wallDk: '#22122e', floor: '#5e4c62', floor2: '#524056' },
  cave: { dungeon: true, wall: '#6a5a48', wallHi: '#9a8a70', wallDk: '#3a3024', floor: '#5a4c3e', floor2: '#4e4234' },
}

const tileCache = new Map()
function grassBase(p, t, x, y) {
  p.rect(0, 0, 16, 16, t.grass)
  for (let i = 0; i < 5; i++) { const hx = Math.floor(hash(x, y, i) * 15), hy = Math.floor(hash(y, x, i + 9) * 14); p.rect(hx, hy, 1, 2, t.grass2); if (i < 2) p.px(hx + 1, hy, t.grass2) }
  if (t.snow) for (let i = 0; i < 3; i++) p.px(Math.floor(hash(x, y, i + 20) * 16), Math.floor(hash(x, y, i + 30) * 16), '#fff')
}
function floorBase(p, t, x, y) {
  p.rect(0, 0, 16, 16, (x + y) % 2 ? t.floor : t.floor2)
  p.rect(0, 0, 16, 1, t.floor2); p.rect(0, 0, 1, 16, t.floor2)
  if (hash(x, y) < 0.25) p.px(4 + Math.floor(hash(y, x) * 8), 4 + Math.floor(hash(x, y, 3) * 8), t.wallDk)
}
function wallBase(p, t, x, y) {
  p.rect(0, 0, 16, 16, t.wall)
  for (let r = 0; r < 4; r++) { const off = (r + y) % 2 ? 0 : 4; p.rect(0, r * 4 + 3, 16, 1, t.wallDk); for (let k = 0; k < 3; k++) p.rect((off + k * 8) % 16, r * 4, 1, 3, t.wallDk); p.rect(0, r * 4, 16, 1, t.wallHi) }
  void x
}
function waterBase(p, t, x, y, f) {
  p.rect(0, 0, 16, 16, t.water)
  for (let i = 0; i < 3; i++) { const wx = (Math.floor(hash(x, y, i) * 12) + f * 2) % 14, wy = 3 + i * 5; p.rect(wx, wy, 3, 1, t.waterHi); p.px(wx + 3, wy - 1, t.waterHi) }
}
function pitBase(p) { p.rect(0, 0, 16, 16, '#08060c'); p.rect(0, 0, 16, 3, '#1c1624'); p.rect(0, 3, 16, 1, '#2a2234') }

const TILE_DRAW = {
  '.': (p, t, x, y) => (t.dungeon ? floorBase(p, t, x, y) : grassBase(p, t, x, y)),
  '_': (p, t, x, y) => floorBase(p, t, x, y),
  ',': (p, t, x, y) => { grassBase(p, t, x, y); const cols = ['#fff', '#ffe04a', '#ff8ac8', '#b08aff']; for (let i = 0; i < 3; i++) { const fx = 2 + Math.floor(hash(x, y, i) * 11), fy = 2 + Math.floor(hash(y, x, i) * 11), c = cols[Math.floor(hash(x + i, y) * 4)]; p.px(fx, fy - 1, c).px(fx - 1, fy, c).px(fx + 1, fy, c).px(fx, fy + 1, c).px(fx, fy, '#ffcc33') } },
  '%': (p, t, x, y) => { grassBase(p, t, x, y); for (let i = 0; i < 4; i++) { const bx = (i % 2) * 8 + 1, by = Math.floor(i / 2) * 8 + 1; p.rect(bx + 1, by + 3, 1, 4, t.grassDk).rect(bx + 3, by + 1, 1, 6, t.grassDk).rect(bx + 5, by + 3, 1, 4, t.grassDk).rect(bx + 2, by + 2, 1, 5, t.grass2).rect(bx + 4, by + 2, 1, 5, t.grass2) } },
  ':': (p, t, x, y) => { p.rect(0, 0, 16, 16, t.path); for (let i = 0; i < 4; i++) p.px(Math.floor(hash(x, y, i) * 16), Math.floor(hash(y, x, i) * 16), t.path2) },
  's': (p, t, x, y) => { p.rect(0, 0, 16, 16, '#f0dca0'); for (let i = 0; i < 5; i++) p.px(Math.floor(hash(x, y, i) * 16), Math.floor(hash(y, x, i) * 16), '#d8c080') },
  '*': (p, t, x, y) => grassBase(p, THEMES.peak, x, y),
  '~': (p, t, x, y, f) => waterBase(p, t.dungeon ? { water: '#3a6ab8', waterHi: '#8ab8f0' } : t, x, y, f),
  'Q': (p, t, x, y, f) => { if (t.dungeon) pitBase(p); else waterBase(p, t, x, y, f); p.rect(0, 0, 2, 16, '#7a4a22'); p.rect(14, 0, 2, 16, '#7a4a22') },
  '=': (p, t) => { p.rect(0, 0, 16, 16, '#3a2a1a'); for (let i = 0; i < 4; i++) { p.rect(0, i * 4, 16, 3, '#b07a42'); p.rect(0, i * 4, 16, 1, '#d09a5a') } p.rect(0, 0, 1, 16, '#5a3a1a'); p.rect(15, 0, 1, 16, '#5a3a1a'); void t },
  'b': (p, t, x, y) => { grassBase(p, t, x, y); p.disc(8, 9, 7, t.grassDk); p.disc(8, 8, 6.4, t.snow ? '#4a8a6a' : '#3aa040'); p.disc(6, 6, 2.5, t.snow ? '#6aaa8a' : '#5ac85a'); p.disc(11, 8, 2, t.snow ? '#6aaa8a' : '#5ac85a'); p.px(5, 5, '#a0f0a0') },
  'T': (p, t, x, y) => { grassBase(p, t, x, y); p.rect(6, 11, 4, 5, '#6a4022'); p.disc(8, 7, 7.6, '#163e1e'); p.disc(8, 7, 7, t.tree); p.disc(6, 5, 3.6, t.treeHi); p.disc(11, 9, 2.5, t.treeHi); p.px(5, 3, '#9ae08a') },
  'A': (p, t, x, y) => { grassBase(p, t, x, y); p.rect(7, 12, 2, 4, '#5a3a22'); for (let i = 0; i < 12; i++) p.rect(8 - i / 2 - 1, i, i + 2, 1, i % 4 === 3 ? '#1e4a3e' : '#2e6a5a'); for (let i = 0; i < 3; i++) p.rect(8 - i * 2, i * 4 + 1, i * 2 + 2, 1, '#fff') },
  'R': (p, t, x, y) => { (t.dungeon ? floorBase : grassBase)(p, t, x, y); p.ell(8, 9, 7.5, 6.5, '#4a4a5a'); p.ell(8, 8, 7, 6, '#8a8a9a'); p.ell(6, 6, 3, 2, '#b0b0c0') },
  'r': (p, t, x, y) => { (t.dungeon ? floorBase : grassBase)(p, t, x, y); p.ell(8, 9, 7.5, 6.5, '#4a4a5a'); p.ell(8, 8, 7, 6, '#9a8a7a'); p.line(5, 3, 8, 8, '#3a2a2a'); p.line(8, 8, 6, 13, '#3a2a2a'); p.line(8, 8, 12, 6, '#3a2a2a') },
  '#': (p, t, x, y) => { if (t.dungeon) return wallBase(p, t, x, y); p.rect(0, 0, 16, 16, t.cliff); for (let i = 0; i < 4; i++) { p.rect(0, i * 4 + 3, 16, 1, t.cliffDk); p.rect(Math.floor(hash(x, y, i) * 12), i * 4, 3, 1, t.cliffDk) } p.rect(0, 0, 16, 1, '#00000030') },
  'U': (p, t, x, y) => { TILE_DRAW['#'](p, t, x, y); p.ell(8, 12, 7, 10, '#120c10'); p.rect(1, 12, 14, 4, '#120c10') },
  'F': (p, t, x, y) => { grassBase(p, t, x, y); p.rect(0, 5, 16, 2, '#c08a52'); p.rect(0, 10, 16, 2, '#c08a52'); p.rect(2, 3, 3, 12, '#a0703a'); p.rect(11, 3, 3, 12, '#a0703a'); p.rect(2, 3, 3, 1, '#e0aa6a'); p.rect(11, 3, 3, 1, '#e0aa6a') },
  'M': (p, t, x, y) => { const cols = [['#d84a3a', '#a83026'], ['#4a7ad8', '#2e52a8'], ['#e0a030', '#b07818'], ['#8a5ad0', '#5e3aa0']], c = cols[Math.floor(x / 4) % 4]; p.rect(0, 0, 16, 16, c[0]); for (let i = 0; i < 4; i++) { p.rect(0, i * 4 + 3, 16, 1, c[1]); for (let k = 0; k < 4; k++) p.rect(((i % 2) * 2 + k * 4) % 16, i * 4, 1, 3, c[1]) } void y },
  'H': (p) => { p.rect(0, 0, 16, 16, '#f4e4c4'); p.rect(0, 0, 16, 2, '#c8b494'); p.rect(4, 4, 8, 7, '#6a4a2a'); p.rect(5, 5, 6, 5, '#a8d8f8'); p.rect(7, 5, 1, 5, '#6a4a2a'); p.rect(5, 7, 6, 1, '#6a4a2a'); p.rect(3, 11, 10, 2, '#c08a52') },
  'D': (p, t) => { if (t.dungeon) { wallBase(p, t, 0, 0); p.rect(2, 2, 12, 14, '#1a1018'); return } p.rect(0, 0, 16, 16, '#f4e4c4'); p.rect(3, 2, 10, 14, '#7a4a22'); p.rect(4, 3, 8, 13, '#9a6232'); p.px(10, 9, '#f4c542'); p.rect(3, 2, 10, 1, '#5a3418') },
  'S': (p, t, x, y) => { (t.dungeon ? floorBase : grassBase)(p, t, x, y); p.rect(7, 9, 2, 6, '#7a4a22'); p.rect(2, 3, 12, 7, '#5a3418'); p.rect(3, 4, 10, 5, '#c08a52'); p.rect(4, 5, 8, 1, '#7a4a22'); p.rect(4, 7, 6, 1, '#7a4a22') },
  'p': (p, t, x, y) => { (t.dungeon ? floorBase : grassBase)(p, t, x, y); drawPot(p) },
  'Z': (p, t, x, y) => { (t.dungeon ? floorBase : grassBase)(p, t, x, y); p.rect(3, 11, 10, 5, '#6a6a7a'); p.rect(2, 11, 12, 1, '#9a9aaa'); p.ell(8, 7, 4, 5, '#8a8a9a'); p.disc(8, 3, 3, '#8a8a9a'); p.px(7, 3, '#3a3a4a'); p.px(9, 3, '#3a3a4a'); p.rect(8, 4, 1, 1, '#cfa040') },
  'L': (p, t, x, y, f) => { (t.dungeon ? floorBase : grassBase)(p, t, x, y); p.rect(5, 8, 6, 8, '#5a5a6a'); p.rect(4, 7, 8, 2, '#8a8a9a'); p.disc(8, 5, 3 + f * 0.5, '#ff8a20'); p.disc(8, 5.5, 1.8, '#ffe060') },
  'W': (p, t, x, y) => wallBase(p, t, x, y),
  'O': (p) => pitBase(p),
  'X': (p, t) => { p.rect(0, 0, 16, 16, t.wallDk || '#3a2a1a'); for (let i = 0; i < 4; i++) { p.rect(1, i * 4, 14, 3, t.floor || '#9a8a6a'); p.rect(1, i * 4, 14, 1, t.wallHi || '#c0b090') } },
  '+': (p, t) => { p.rect(0, 0, 16, 16, t.wallDk); p.rect(1, 1, 14, 15, '#7a4a22'); p.rect(2, 2, 12, 13, '#9a6232'); p.disc(8, 7, 2.5, '#f4c542'); p.rect(7, 8, 2, 4, '#f4c542'); p.px(8, 7, '#2a1a0a'); p.rect(8, 8, 1, 2, '#2a1a0a') },
  'B': (p, t) => { p.rect(0, 0, 16, 16, t.wallDk); p.rect(1, 1, 14, 15, '#8a2a3a'); p.rect(2, 2, 12, 13, '#b03a4a'); p.rect(2, 7, 12, 2, '#f4c542'); p.disc(8, 8, 3.5, '#f4c542'); p.disc(8, 8, 1.5, '#e03050'); p.px(4, 4, '#f4c542'); p.px(11, 4, '#f4c542'); p.px(4, 12, '#f4c542'); p.px(11, 12, '#f4c542') },
  'u': (p, t) => { p.rect(0, 0, 16, 16, t.wallDk); for (let i = 0; i < 4; i++) { p.rect(1 + i * 4, 0, 2, 16, '#9a9aaa'); p.px(1 + i * 4, 0, '#d0d0e0') } p.rect(0, 4, 16, 2, '#6a6a7a'); p.rect(0, 11, 16, 2, '#6a6a7a') },
  'c': (p, t, x, y) => { wallBase(p, t, x, y); p.line(3, 1, 7, 7, '#120a10', 1); p.line(7, 7, 4, 14, '#120a10'); p.line(7, 7, 13, 5, '#120a10'); p.line(9, 10, 13, 14, '#120a10') },
  'o': (p, t, x, y) => { floorBase(p, t, x, y); p.rect(2, 2, 12, 12, '#5a5a6a'); p.rect(3, 3, 10, 10, '#c8c8d8'); p.rect(3, 3, 10, 1, '#fff') },
  'w': (p, t, x, y) => { (t.dungeon ? floorBase : grassBase)(p, t, x, y); p.rect(3, 11, 10, 4, '#5a5a6a'); p.rect(4, 10, 8, 1, '#8a8a9a') },
  'E': (p, t, x, y) => { wallBase(p, t, x, y); p.ell(8, 8, 6, 4, '#fff'); p.disc(8, 8, 2.6, '#e03a3a'); p.disc(8, 8, 1, '#111') },
  'e': (p, t, x, y) => { wallBase(p, t, x, y); p.rect(2, 8, 12, 1, '#111'); p.rect(3, 7, 10, 1, t.wallDk) },
  'i': (p, t, x, y) => { p.rect(0, 0, 16, 16, '#cfeeff'); p.rect(0, 0, 16, 1, '#a8d4ee'); p.rect(0, 0, 1, 16, '#a8d4ee'); if ((x + y) % 3 === 0) { p.line(3, 11, 8, 6, '#fff'); p.line(5, 12, 10, 7, '#fff') } },
  'G': (p, t) => { p.rect(0, 0, 16, 16, '#2a1e38'); p.rect(1, 0, 14, 16, '#5a4a70'); for (let i = 0; i < 3; i++) p.rect(2 + i * 5, 1, 2, 15, '#3a2e4a'); p.rect(1, 6, 14, 3, '#7a6a90'); void t },
  'P': (p, t, x, y) => { grassBase(p, t, x, y); p.rect(0, 4, 16, 12, '#7a4a22'); p.rect(0, 4, 16, 3, '#c08a52'); p.rect(0, 7, 16, 1, '#5a3418') },
  'K': (p, t, x, y) => { floorBase(p, t, x, y); p.rect(0, 0, 16, 16, '#a8323a'); p.rect(0, 0, 16, 1, '#e8b040'); p.rect(0, 15, 16, 1, '#e8b040') },
}
function drawPot(p) { p.ell(8, 10, 6, 5, '#5a3a2a'); p.ell(8, 10, 5.4, 4.4, '#b8683a'); p.rect(5, 3, 6, 3, '#5a3a2a'); p.rect(6, 4, 4, 2, '#d88a50'); p.rect(4, 9, 8, 1, '#7a4a28'); p.px(6, 8, '#f0b080') }

// which tiles stay animated (re-drawn each frame)
export const ANIMATED = new Set(['~', 'Q', 'L'])
export function tileImage(ch, theme, themeName, x, y, f = 0) {
  const draw = TILE_DRAW[ch] || TILE_DRAW['.']
  const animated = ANIMATED.has(ch)
  const v = animated ? `${x % 7},${y % 5},${f}` : `${x},${y}`
  const key = `${themeName}|${ch}|${v}`
  let c = tileCache.get(key)
  if (!c) {
    let g;[c, g] = canvas(16, 16)
    draw(painter(g), theme, x, y, f)
    tileCache.set(key, c)
  }
  return c
}

// ----------------------------------------------------------------- build all sprites
export function buildSprites() {
  const S = {}
  const norah = {}
  for (const [d, name] of [[0, 'down'], [1, 'up'], [2, 'right']]) norah[name] = [girl(d, 0, NORAH), girl(d, 1, NORAH)]
  norah.left = norah.right.map(flip)
  S.norah = norah
  S.norahHurt = { down: norah.down.map((c) => tint(c, '#ffffff')) }
  S.npc = {
    grandpa: person({ hair: '#e8e8f0', skin: '#f2c49a', shirt: '#4a9a5a', pants: '#5a4a3a', beard: '#f4f4fa', cane: true }),
    shop: person({ hair: '#3a2a1a', skin: '#d8a070', shirt: '#d84a5a', pants: '#3a3a5a', apron: '#f4f0e0' }),
    lady: person({ hair: '#f0c040', skin: '#f7d0b0', shirt: '#4a8ae8', pants: '#3a5aa8' }),
    farmer: person({ hair: '#6a4a2a', skin: '#e0b088', shirt: '#e8a030', pants: '#4a6a3a', hat: '#c8a050' }),
    kid: person({ hair: '#2a1a12', skin: '#c88a5a', shirt: '#3ac0a0', pants: '#2a5a8a' }),
    elder: person({ hair: '#9a9aa8', skin: '#f2c49a', shirt: '#8a5ac8', pants: '#3a2a4a', beard: '#c8c8d0', bald: true }),
    guard: person({ hair: '#5a3a1a', skin: '#e8b890', shirt: '#7a7a8a', pants: '#3a3a4a', hat: '#5a5a6a' }),
    potato: [corgi(0), corgi(1)],
    nug: [frog(0), frog(1)],
  }
  S.enemy = {}
  for (const [k, fn] of Object.entries(ENEMY_DRAW)) { const fr = [fn(0), fn(1)]; S.enemy[k] = fr; S.enemy[k + '_hit'] = fr.map((c) => tint(c, '#ffffff')) }
  S.boss = {
    mole: [bossMole(0), bossMole(1)], moleUnder: bossMole(0, 'under'),
    crab: [bossCrab(0, false), bossCrab(1, false)], crabCracked: [bossCrab(0, true), bossCrab(1, true)], crabHurt: bossCrab(0, true, true),
    owl: [bossOwl(0, false), bossOwl(1, false)], dark: [bossOwl(0, true), bossOwl(1, true)],
  }
  for (const k of ['mole', 'crab', 'owl', 'dark']) S.boss[k + '_hit'] = S.boss[k].map((c) => tint(c, '#ffffff'))
  S.icon = {}
  for (const [k, fn] of Object.entries(ICONS)) S.icon[k] = fn()
  S.icon.stone0 = songstone('#3ac85a', '#9af0a8'); S.icon.stone1 = songstone('#9a5af0', '#d0b0ff'); S.icon.stone2 = songstone('#3ac0e8', '#b8f0ff')
  S.heart = [heartFixed(0, 8), heartFixed(0.5, 8), heartFixed(1, 8)]
  S.chest = [chest(false), chest(true)]
  S.pot = sprite(16, 16, (p) => drawPot(p))
  S.bushLift = sprite(16, 16, (p) => { p.disc(8, 8, 6.4, '#3aa040'); p.disc(6, 6, 2.5, '#5ac85a'); p.disc(11, 8, 2, '#5ac85a') })
  S.block = {}
  for (const k of ['leafy', 'crystal', 'frost', 'hush', 'cave']) S.block[k] = pushBlock(THEMES[k])
  S.crystal = [sprite(10, 12, (p) => { p.ell(5, 6, 4.5, 6, '#3a8af0'); p.ell(4, 4, 2, 3, '#b0e0ff') }), sprite(10, 12, (p) => { p.ell(5, 6, 4.5, 6, '#f0a030'); p.ell(4, 4, 2, 3, '#ffe0a0') })]
  S.fx = buildFx()
  return S
}
