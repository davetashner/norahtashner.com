// Level 2: top-down corn harvest. Drive the combine through the field, fill the grain tank, unload at the cart.
import { img } from './assets.js'
import { sfx, engine } from './audio.js'
import { fx, updateFx, drawFx, burst, floatText, clearFx } from './fx.js'
import { roundRect } from './fishing.js'
import { clamp, lerp, rand } from './util.js'

const VIEW_W = 1280, VIEW_H = 720
const FIELD_W = 2400, FIELD_H = 1800
const FONT = '"Trebuchet MS", system-ui, sans-serif'
const TANK_MAX = 90
const TIME_LIMIT = 210
const HEADER_W = 215, HEADER_FWD = 112, HEADER_DEPTH = 50
const COMBINE_SCALE = 0.29   // combine_top is ~755px wide (the header) -> ~220px in the world
const CART = { x: 130, y: 880, w: 92, h: 176 }
const PLANT_SIZE = 108

// --- painterly procedural ground textures (crayon strokes on a base color) ---
function makeTexture(base, colors, strokes) {
  const c = document.createElement('canvas'); c.width = c.height = 512
  const g = c.getContext('2d'); g.fillStyle = base; g.fillRect(0, 0, 512, 512)
  g.lineCap = 'round'
  for (let i = 0; i < strokes; i++) {
    g.strokeStyle = colors[i % colors.length]; g.globalAlpha = rand(0.12, 0.35); g.lineWidth = rand(2, 7)
    const x = rand(-20, 532), y = rand(-20, 532), a = rand(-0.5, 0.5) - Math.PI / 2, l = rand(10, 34)
    for (const ox of [-512, 0, 512]) for (const oy of [-512, 0, 512]) {
      g.beginPath(); g.moveTo(x + ox, y + oy); g.quadraticCurveTo(x + ox + Math.cos(a) * l * 0.5 + 4, y + oy + Math.sin(a) * l * 0.5, x + ox + Math.cos(a) * l, y + oy + Math.sin(a) * l); g.stroke()
    }
  }
  return c
}
let SOIL = null, GRASS = null
function textures(ctx) {
  if (!SOIL) {
    SOIL = ctx.createPattern(makeTexture('#a97b45', ['#8f6537', '#c39a5a', '#9c7040', '#b58a50'], 900), 'repeat')
    GRASS = ctx.createPattern(makeTexture('#6fa24a', ['#5b8f3c', '#86b659', '#4f8434', '#9ac968'], 900), 'repeat')
  }
}

function build() {
  const plants = []
  const rocks = [[700, 700], [1500, 1010], [1900, 600], [1000, 1330], [430, 1120], [2000, 1360], [620, 1660], [1800, 200], [1250, 420]]
  for (let x = 280, row = 0; x <= 2130; x += 74, row++) {
    for (let y = 300; y <= 1510; y += 58) {
      if (rocks.some(([rx, ry]) => Math.hypot(rx - x, ry - y) < 62)) continue
      const golden = Math.random() < 0.012
      plants.push({ x: x + rand(-4, 4), y: y + rand(-4, 4), v: golden ? 3 : Math.floor(rand(0, 3)), golden, cut: false, ph: rand(0, 6.3), stub: Math.random() < 0.5 ? 'stub1' : 'stub2', rot: rand(0, 6.3) })
    }
  }
  return { plants, rocks: rocks.map(([x, y]) => ({ x, y, r: 36, rot: rand(0, 6.3) })), total: plants.length }
}

export function createHarvest(host) {
  const S = {
    done: false, result: null,
    start() {
      clearFx()
      Object.assign(S, build())
      S.c = { x: 1250, y: 1680, a: 0, v: 0 }
      S.tank = 0; S.cutCount = 0; S.unloaded = 0; S.goldFound = 0; S.t = 0; S.done = false; S.result = null; S.endT = 0
      S.cam = { x: 1250 - VIEW_W / 2, y: 1680 - VIEW_H * 0.6 }
      S.msg = { t: 4, text: 'Drive through the corn! Hold SPACE / ▲ to go, ◀ ▶ to steer' }
      S.full = false; S.unloading = false; S.cartFill = 0
      S.lastChing = 0
    },
    stop() { engine(null) },
    update(dt, input) {
      S.t += dt
      const c = S.c
      if (S.done) { S.endT += dt; engine(null); updateFx(dt); return }
      // steering + throttle
      const thr = input.held('Space') || input.held('MoveUp') ? 1 : input.held('MoveDown') ? -0.5 : 0
      const maxV = 215 * (1 - 0.25 * (S.tank / TANK_MAX))
      c.v = lerp(c.v, thr * maxV, 1 - Math.pow(thr ? 0.12 : 0.04, dt))
      const turn = input.axis()
      c.a += turn * (1.15 + Math.min(1, Math.abs(c.v) / 80) * 0.9) * dt * (c.v < -5 ? -1 : 1)
      const fx_ = Math.sin(c.a), fy_ = -Math.cos(c.a)
      c.x += fx_ * c.v * dt; c.y += fy_ * c.v * dt
      // field fence
      const pad = 80
      if (c.x < pad) { c.x = pad; c.v *= 0.5 } if (c.x > FIELD_W - pad) { c.x = FIELD_W - pad; c.v *= 0.5 }
      if (c.y < pad + 20) { c.y = pad + 20; c.v *= 0.5 } if (c.y > FIELD_H - pad) { c.y = FIELD_H - pad; c.v *= 0.5 }
      // rocks
      for (const r of S.rocks) {
        const d = Math.hypot(c.x - r.x, c.y - r.y), min = r.r + 62
        if (d < min) {
          const nx = (c.x - r.x) / (d || 1), ny = (c.y - r.y) / (d || 1)
          c.x = r.x + nx * min; c.y = r.y + ny * min
          if (Math.abs(c.v) > 60) { sfx.bump(); S.shake = 0.25; floatText(r.x, r.y - 50, 'Bump!', '#ffe9a0') }
          c.v *= 0.35
        }
      }
      // header cuts plants
      const cos = Math.cos(c.a), sin = Math.sin(c.a)
      S.full = S.tank >= TANK_MAX
      if (!S.full && Math.abs(c.v) > 8) {
        for (const p of S.plants) {
          if (p.cut) continue
          const dx = p.x - c.x, dy = p.y - c.y
          const lx = dx * cos + dy * sin            // across
          const ly = -dx * sin + dy * cos           // along (forward = -y)
          if (Math.abs(lx) < HEADER_W / 2 && ly < -HEADER_FWD + HEADER_DEPTH / 2 && ly > -HEADER_FWD - HEADER_DEPTH / 2) {
            p.cut = true; S.tank++; S.cutCount++
            burst(p.x, p.y, 3, { color: '#d9e08a', speed: 120, life: 0.5, size: 4, grav: 80 })
            if (p.golden) { S.goldFound++; sfx.star(); floatText(p.x, p.y - 30, 'Golden corn! +3', '#ffe066'); S.tank = Math.min(TANK_MAX, S.tank + 2) }
            else if (S.t - S.lastChing > 0.09) { sfx.collect(); S.lastChing = S.t }
            if (S.tank >= TANK_MAX) { S.msg = { t: 5, text: 'Tank full! Drive to the grain cart and hold E to unload' }; sfx.chore() }
          }
        }
      }
      // unloading
      const dcart = Math.hypot(c.x - (CART.x + 120), c.y - CART.y)
      S.nearCart = dcart < 230
      S.unloading = S.nearCart && input.held('KeyE') && S.tank > 0
      if (S.unloading) {
        const n = Math.min(S.tank, 48 * dt + Math.random())
        S.tank -= n; S.unloaded += n; S.cartFill = Math.min(1, S.cartFill + n / 900)
        if (Math.random() < 0.7) burst(lerp(c.x, CART.x, 0.6 + Math.random() * 0.4), lerp(c.y, CART.y, 0.7), 1, { color: '#f2c744', speed: 60, life: 0.45, size: 5, grav: 120 })
        if (S.tank <= 0.5) { S.tank = 0; sfx.chore(); floatText(c.x, c.y - 120, 'All unloaded!', '#9df59d') }
      }
      engine(clamp(Math.abs(c.v) / 215, 0, 1) * 0.9 + 0.1)
      S.shake = Math.max(0, (S.shake || 0) - dt)
      S.msg.t = Math.max(0, S.msg.t - dt)
      // camera
      const tx = c.x + fx_ * 140 - VIEW_W / 2, ty = c.y + fy_ * 100 - VIEW_H / 2
      S.cam.x = clamp(lerp(S.cam.x, tx, 1 - Math.pow(0.002, dt)), -60, FIELD_W - VIEW_W + 60)
      S.cam.y = clamp(lerp(S.cam.y, ty, 1 - Math.pow(0.002, dt)), -60, FIELD_H - VIEW_H + 60)
      // dust/chaff from wheels
      if (Math.abs(c.v) > 60 && Math.random() < 0.4) burst(c.x - fx_ * 70 + rand(-30, 30), c.y - fy_ * 70 + rand(-30, 30), 1, { color: '#d8c08a', speed: 30, life: 0.5, size: 6, grav: 0 })
      updateFx(dt)
      // finish
      const left = S.total - S.cutCount
      const timeUp = S.t >= TIME_LIMIT
      if ((left <= 0 && S.tank <= 0.5) || timeUp) {
        const pct = S.cutCount / S.total
        const timeBonus = timeUp ? 0 : clamp(1 - S.t / TIME_LIMIT, 0, 1)
        const stars = pct >= 0.97 && timeBonus > 0.15 ? 3 : pct >= 0.8 ? 2 : pct >= 0.45 ? 1 : 0
        S.done = true; S.endT = 0; S.result = { stars, pct, corn: Math.round(S.unloaded), gold: S.goldFound, time: S.t }
        sfx.win(); engine(null)
      }
    },
    draw(ctx) {
      textures(ctx)
      const { x: cx, y: cy } = S.cam
      const sh = S.shake ? [rand(-5, 5) * S.shake * 3, rand(-5, 5) * S.shake * 3] : [0, 0]
      ctx.save(); ctx.translate(sh[0], sh[1])
      // grass outside, soil field inside
      ctx.fillStyle = GRASS; ctx.save(); ctx.translate(-cx, -cy); ctx.fillRect(cx - 100, cy - 100, VIEW_W + 200, VIEW_H + 200); ctx.restore()
      ctx.save(); ctx.translate(-cx, -cy); ctx.fillStyle = SOIL; ctx.fillRect(40, 40, FIELD_W - 80, FIELD_H - 80)
      ctx.strokeStyle = 'rgba(90,60,30,.5)'; ctx.lineWidth = 6; ctx.strokeRect(40, 40, FIELD_W - 80, FIELD_H - 80)
      // headland tracks
      ctx.fillStyle = 'rgba(120,85,45,.35)'
      ctx.fillRect(40, 1530, FIELD_W - 80, 230); ctx.fillRect(40, 40, FIELD_W - 80, 240); ctx.fillRect(40, 280, 230, 1250); ctx.fillRect(2130, 280, 230, 1250)
      ctx.restore()
      // fence around the field
      const fence = img('props', 'fence_top')
      if (fence) {
        const fw = 300, fh = fence.height * fw / fence.width
        for (let x = 20; x < FIELD_W; x += fw - 8) for (const y of [20, FIELD_H - 60]) { if (x - cx > -fw && x - cx < VIEW_W && y - cy > -fh && y - cy < VIEW_H) ctx.drawImage(fence, x - cx, y - cy, fw, fh) }
        for (let y = 20; y < FIELD_H; y += fw - 8) for (const x of [10, FIELD_W - 40]) { if (x - cx > -fh && x - cx < VIEW_W && y - cy > -fw && y - cy < VIEW_H) { ctx.save(); ctx.translate(x - cx + fh / 2, y - cy + fw / 2); ctx.rotate(Math.PI / 2); ctx.drawImage(fence, -fw / 2, -fh / 2, fw, fh); ctx.restore() } }
      }
      // cut stubble first (ground level)
      const vis = (x, y, m = 80) => x - cx > -m && x - cx < VIEW_W + m && y - cy > -m && y - cy < VIEW_H + m
      for (const p of S.plants) {
        if (!p.cut || !vis(p.x, p.y)) continue
        const im = img('props', p.stub); if (!im) continue
        ctx.save(); ctx.translate(p.x - cx, p.y - cy); ctx.rotate(p.rot); ctx.drawImage(im, -26, -26, 52, 52); ctx.restore()
      }
      // cart
      const cart = img('props', 'cart_top')
      if (cart) {
        const k = CART.h / cart.height
        ctx.drawImage(cart, CART.x - cart.width * k / 2 - cx, CART.y - CART.h / 2 - cy, cart.width * k, CART.h)
        // corn pile fill
        if (S.cartFill > 0) { ctx.save(); ctx.globalAlpha = 0.25 + 0.5 * S.cartFill; ctx.fillStyle = '#f5cc3a'; ctx.beginPath(); ctx.ellipse(CART.x - cx, CART.y - cy, 24 + 10 * S.cartFill, 54 + 14 * S.cartFill, 0, 0, 7); ctx.fill(); ctx.restore() }
      }
      // rocks
      const rockIm = img('props', 'rock')
      if (rockIm) for (const r of S.rocks) { if (!vis(r.x, r.y, 100)) continue; ctx.save(); ctx.translate(r.x - cx, r.y - cy); ctx.rotate(r.rot); ctx.drawImage(rockIm, -r.r * 1.15, -r.r * 1.15, r.r * 2.3, r.r * 2.3); ctx.restore() }
      // standing corn, back to front
      const t = S.t
      for (const p of S.plants) {
        if (p.cut || !vis(p.x, p.y)) continue
        const im = img('props', p.golden ? 'corn_ripe' : ['corn1', 'corn2', 'corn3'][p.v]); if (!im) continue
        const sway = Math.sin(t * 1.6 + p.ph) * 0.06
        ctx.save(); ctx.translate(p.x - cx, p.y - cy); ctx.rotate(sway + p.rot * 0.02)
        if (p.golden) { ctx.fillStyle = 'rgba(255,225,90,.35)'; ctx.beginPath(); ctx.arc(0, 0, PLANT_SIZE * 0.62, 0, 7); ctx.fill() }
        ctx.drawImage(im, -PLANT_SIZE / 2, -PLANT_SIZE / 2, PLANT_SIZE, PLANT_SIZE); ctx.restore()
      }
      // combine
      const cb = img('props', 'combine_top'), c = S.c
      if (cb) {
        const k = COMBINE_SCALE
        ctx.save(); ctx.translate(c.x - cx, c.y - cy); ctx.rotate(c.a)
        ctx.fillStyle = 'rgba(40,25,10,.25)'; ctx.beginPath(); ctx.ellipse(10, 14, cb.width * k * 0.32, cb.height * k * 0.46, 0, 0, 7); ctx.fill()
        ctx.drawImage(cb, -cb.width * k / 2, -cb.height * k * 0.52, cb.width * k, cb.height * k)
        // driver peeking from the cab (portrait chip)
        ctx.restore()
      }
      // trees outside corners
      const tree = img('props', 'tree_top')
      if (tree) for (const [x, y, s] of [[-30, 40, 300], [FIELD_W + 20, 90, 280], [-10, FIELD_H - 40, 260], [FIELD_W + 40, FIELD_H - 70, 320], [FIELD_W / 2, -10, 260]]) {
        if (vis(x, y, 220)) ctx.drawImage(tree, x - s / 2 - cx, y - s / 2 - cy, s, s)
      }
      drawFx(ctx, cx, cy)
      ctx.restore()
      S.drawHud(ctx)
    },
    drawHud(ctx) {
      const pct = S.cutCount / S.total
      ctx.save()
      // top-left panel
      ctx.fillStyle = 'rgba(255,247,222,.93)'; ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 4; roundRect(ctx, 16, 16, 330, 118, 16); ctx.fill(); ctx.stroke()
      ctx.fillStyle = '#4a3320'; ctx.font = `800 22px ${FONT}`; ctx.textAlign = 'left'; ctx.fillText('Harvest the corn!', 32, 46)
      ctx.font = `700 18px ${FONT}`; ctx.fillText(`Time ${Math.max(0, Math.ceil(TIME_LIMIT - S.t))}s`, 32, 74)
      ctx.fillStyle = '#e8dcc0'; roundRect(ctx, 32, 86, 296, 20, 10); ctx.fill()
      ctx.fillStyle = '#6cc36e'; roundRect(ctx, 32, 86, Math.max(14, 296 * pct), 20, 10); ctx.fill()
      ctx.fillStyle = '#4a3320'; ctx.font = `800 14px ${FONT}`; ctx.fillText(`${Math.round(pct * 100)}% harvested`, 40, 101)
      // grain tank gauge
      const gx = 16, gy = VIEW_H - 150, gw = 56, gh = 134
      ctx.fillStyle = 'rgba(255,247,222,.93)'; roundRect(ctx, gx, gy, gw, gh, 14); ctx.fill(); ctx.stroke()
      const f = S.tank / TANK_MAX
      ctx.fillStyle = S.full ? '#e8473f' : '#f2c744'; roundRect(ctx, gx + 8, gy + 8 + (gh - 16) * (1 - f), gw - 16, Math.max(6, (gh - 16) * f), 8); ctx.fill()
      ctx.fillStyle = '#4a3320'; ctx.font = `800 13px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('TANK', gx + gw / 2, gy - 6)
      // minimap
      const mw = 200, mh = mw * FIELD_H / FIELD_W, mx = VIEW_W - mw - 16, my = 16
      ctx.fillStyle = 'rgba(255,247,222,.9)'; roundRect(ctx, mx - 6, my - 6, mw + 12, mh + 12, 10); ctx.fill(); ctx.stroke()
      ctx.fillStyle = '#6fa24a'; ctx.fillRect(mx, my, mw, mh)
      for (const p of S.plants) { ctx.fillStyle = p.cut ? '#c9a468' : '#3f7f35'; ctx.fillRect(mx + (p.x / FIELD_W) * mw - 1, my + (p.y / FIELD_H) * mh - 1, 3, 3) }
      ctx.fillStyle = '#f5cc3a'; ctx.fillRect(mx + (CART.x / FIELD_W) * mw - 3, my + (CART.y / FIELD_H) * mh - 5, 6, 10)
      ctx.fillStyle = '#e8473f'; ctx.beginPath(); ctx.arc(mx + (S.c.x / FIELD_W) * mw, my + (S.c.y / FIELD_H) * mh, 5, 0, 7); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke()
      // prompts
      let prompt = null
      if (S.nearCart && S.tank > 0) prompt = { key: 'E', text: S.unloading ? 'Unloading…' : 'Hold E to unload corn' }
      else if (S.full) prompt = { key: '!', text: 'Tank full! Go to the cart on the left' }
      if (prompt) {
        ctx.font = `800 22px ${FONT}`; const tw = ctx.measureText(prompt.text).width + 70, px = (VIEW_W - tw) / 2, py = VIEW_H - 70
        ctx.fillStyle = 'rgba(40,28,16,.82)'; roundRect(ctx, px, py, tw, 44, 22); ctx.fill()
        ctx.fillStyle = '#ffd36a'; roundRect(ctx, px + 10, py + 8, 32, 28, 8); ctx.fill()
        ctx.fillStyle = '#4a3320'; ctx.textAlign = 'center'; ctx.fillText(prompt.key, px + 26, py + 30)
        ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(prompt.text, px + 54, py + 30)
      }
      if (S.msg.t > 0) {
        ctx.globalAlpha = Math.min(1, S.msg.t); ctx.font = `800 26px ${FONT}`; ctx.textAlign = 'center'; ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(60,40,20,.85)'
        ctx.strokeText(S.msg.text, VIEW_W / 2, 190); ctx.fillStyle = '#fff'; ctx.fillText(S.msg.text, VIEW_W / 2, 190)
      }
      ctx.restore()
      if (S.done) S.drawResult(ctx)
    },
    drawResult(ctx) {
      const a = clamp(S.endT - 0.4, 0, 1), r = S.result
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(40,28,16,.55)'; ctx.fillRect(0, 0, VIEW_W, VIEW_H)
      ctx.fillStyle = 'rgba(255,247,222,.97)'; ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 6; roundRect(ctx, VIEW_W / 2 - 300, 170, 600, 330, 28); ctx.fill(); ctx.stroke()
      ctx.textAlign = 'center'; ctx.fillStyle = '#c0452f'; ctx.font = `800 52px ${FONT}`; ctx.fillText('Harvest Complete!', VIEW_W / 2, 250)
      const star = img('ui', 'star')
      for (let i = 0; i < 3 && star; i++) { ctx.globalAlpha = a * (i < r.stars ? 1 : 0.2); ctx.drawImage(star, VIEW_W / 2 - 110 + i * 80, 275, 70, 66) }
      ctx.globalAlpha = a; ctx.fillStyle = '#4a3320'; ctx.font = `700 24px ${FONT}`
      ctx.fillText(`${Math.round(r.pct * 100)}% of the field in ${Math.round(r.time)}s · ${r.corn} corn delivered`, VIEW_W / 2, 385)
      if (r.gold) ctx.fillText(`${r.gold} golden corn found!`, VIEW_W / 2, 418)
      if (S.endT > 1.2 && Math.floor(S.endT * 2) % 2 === 0) { ctx.fillStyle = '#3f8f4a'; ctx.font = `800 26px ${FONT}`; ctx.fillText('Press E or tap — next up: the pool party!', VIEW_W / 2, 468) }
      ctx.restore()
    },
  }
  return S
}
