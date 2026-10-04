// Loads every image + atlas once, then hands out frame rects.
const base = new URL('../assets/', import.meta.url)

const load = (src) => new Promise((res, rej) => {
  const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error('failed to load ' + src)); im.src = src
})
const json = (src) => fetch(src).then((r) => r.json())

export const A = { img: {}, atlas: {}, pool: { x0: 178, x1: 1093, y0: 254, y1: 610 } }

const SPRITES = ['jersh', 'carish', 'chicken', 'cow', 'goat_black', 'goat_bw', 'sheep', 'pig', 'goose', 'kids', 'sharks']
const PROPS = ['coop', 'picket_fence', 'gate', 'goat_ramp', 'picnic_table', 'spool_table', 'pallets', 'board_fence',
  'barn', 'silo', 'tractor', 'tree', 'hay_bale', 'trough', 'pond', 'combine', 'combine_top', 'cart_top', 'corn1', 'corn2', 'corn3', 'corn_ripe', 'stub1', 'stub2', 'rock', 'bale_top', 'tree_top', 'fence_top', 'fallen', 'ear']
const LAYERS = ['sky', 'far', 'mid', 'ground', 'title_bg', 'pool']
const UI = ['egg', 'corn', 'sunflower', 'apple', 'fish', 'milk', 'star', 'heart', 'coin', 'basket', 'rod', 'golden_egg', 'logo']

async function tryLoad(path) { try { return await load(new URL(path, base).href) } catch { return null } }

export async function loadAll(onProgress = () => {}) {
  const jobs = []
  const add = (group, name, path) => jobs.push(tryLoad(path).then((im) => { if (im) A.img[`${group}/${name}`] = im; onProgress() }))
  for (const n of SPRITES) {
    add('sprites', n, `sprites/${n}.webp`)
    jobs.push(json(new URL(`sprites/${n}.json`, base).href).then((m) => { A.atlas[n] = m }).catch(() => {}))
  }
  for (const n of ['jersh', 'carish']) add('sprites', n + '_portrait', `sprites/${n}_portrait.webp`)
  for (const n of PROPS) add('props', n, `props/${n}.webp`)
  for (const n of LAYERS) add('layers', n, `layers/${n}.webp`)
  for (const n of UI) add('ui', n, `ui/${n}.webp`)
  jobs.push(json(new URL('pool.json', base).href).then((m) => { A.pool = m }).catch(() => {}))
  await Promise.all(jobs)
}

export const img = (group, name) => A.img[`${group}/${name}`]

// frame lookup: animals use names ('walk1'), characters use [row, col]
export function frame(atlasName, key) {
  const m = A.atlas[atlasName]
  if (!m) return null
  if (Array.isArray(key)) return m.rows[key[0]]?.[key[1]] || null
  return m.frames[key] || null
}

// Draw a frame with its anchor (feet, bottom-center) at world (x, y). `size` = rendered cell size in px.
export function drawFrame(ctx, atlasName, key, x, y, size, { flip = false, sx = 1, sy = 1, alpha = 1, rot = 0 } = {}) {
  const f = frame(atlasName, key), im = img('sprites', atlasName)
  if (!f || !im) return
  const k = size / f.w * (f.scale || 1)
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.translate(x, y)
  if (rot) ctx.rotate(rot)
  ctx.scale((flip ? -1 : 1) * sx, sy)
  ctx.drawImage(im, f.x, f.y, f.w, f.h, -f.anchor[0] * k, -f.anchor[1] * k, f.w * k, f.h * k)
  ctx.restore()
}

// Draw a whole image with feet/bottom-center at (x, y), `h` px tall.
export function drawProp(ctx, group, name, x, y, h, { flip = false, alpha = 1 } = {}) {
  const im = img(group, name)
  if (!im) return
  const w = im.width * h / im.height
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); if (flip) ctx.scale(-1, 1)
  ctx.drawImage(im, -w / 2, -h, w, h)
  ctx.restore()
}
