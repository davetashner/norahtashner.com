import { sfx } from './audio.js'
import { img } from './assets.js'

// Timing mini-game: a float slides along a bar; stop it inside the green zone 3 times to land a fish.
const NAMES = ['Bluegill', 'Big Bass', 'Sunfish', 'Whiskery Catfish', 'Silver Minnow', 'Golden Trout']

export function startFishing() {
  return { t: 0, pos: 0, dir: 1, speed: 0.9, zone: 0.4 + Math.random() * 0.3, width: 0.2, hits: 0, wait: 1.2 + Math.random() * 1.2, bite: false, msg: 'Waiting for a bite…', done: false, caught: null, shake: 0 }
}

export function updateFishing(f, dt, input) {
  if (f.done) return 'done'
  f.t += dt
  if (!f.bite) {
    f.wait -= dt
    if (f.wait <= 0) { f.bite = true; f.msg = 'A bite! Press SPACE in the green!'; sfx.bite() }
    if (input.hit('Space') || input.hit('KeyE')) { f.msg = 'Too early — wait for the bite!'; f.wait += 0.8 }
    return null
  }
  f.pos += f.dir * f.speed * dt
  if (f.pos > 1) { f.pos = 1; f.dir = -1 } else if (f.pos < 0) { f.pos = 0; f.dir = 1 }
  if (input.hit('Space') || input.hit('KeyE')) {
    if (f.pos > f.zone && f.pos < f.zone + f.width) {
      f.hits++; sfx.collect(); f.speed += 0.35; f.width = Math.max(0.12, f.width - 0.03); f.zone = 0.1 + Math.random() * 0.65
      f.msg = f.hits >= 3 ? 'Got it!' : `Nice! ${3 - f.hits} more…`
      if (f.hits >= 3) { f.done = true; f.caught = NAMES[Math.floor(Math.random() * NAMES.length)]; return 'caught' }
    } else { f.msg = 'It slipped… try again!'; f.hits = Math.max(0, f.hits - 1); f.shake = 0.3; sfx.nope() }
  }
  f.shake = Math.max(0, f.shake - dt)
  return null
}

export function drawFishing(ctx, f, W, H) {
  const bw = 520, bh = 34, x = (W - bw) / 2, y = H - 200
  ctx.save()
  ctx.fillStyle = 'rgba(255,248,225,.94)'; ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 5
  roundRect(ctx, x - 30, y - 70, bw + 60, 170, 20); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#4a3320'; ctx.font = '700 24px "Trebuchet MS", system-ui, sans-serif'; ctx.textAlign = 'center'
  ctx.fillText(f.msg, W / 2, y - 28)
  ctx.translate((f.shake ? Math.sin(f.t * 80) * 4 : 0), 0)
  ctx.fillStyle = '#cfe6ef'; roundRect(ctx, x, y, bw, bh, 17); ctx.fill()
  if (f.bite) { ctx.fillStyle = '#6cc36e'; roundRect(ctx, x + f.zone * bw, y, f.width * bw, bh, 17); ctx.fill() }
  ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 4; roundRect(ctx, x, y, bw, bh, 17); ctx.stroke()
  if (f.bite) { ctx.fillStyle = '#e8473f'; ctx.beginPath(); ctx.arc(x + f.pos * bw, y + bh / 2, 15, 0, 7); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke() }
  const fish = img('ui', 'fish')
  for (let i = 0; i < 3 && fish; i++) { ctx.globalAlpha = i < f.hits ? 1 : 0.25; ctx.drawImage(fish, x + 150 + i * 80, y + 46, 64, 36) }
  ctx.restore()
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}
