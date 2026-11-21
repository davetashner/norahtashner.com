import { input } from './input.js'
import { audio } from './audio.js'
import { buildSprites } from './gfx.js'
import { createGame, VW, VH } from './game.js'

const cv = document.getElementById('game')
const ctx = cv.getContext('2d')
let k = 1, ox = 0, oy = 0

const $ = (id) => document.getElementById(id)
function place(el, x, y, size) { if (!el) return; Object.assign(el.style, { left: Math.round(x) + 'px', top: Math.round(y) + 'px', width: Math.round(size) + 'px', height: Math.round(size) + 'px', right: 'auto', bottom: 'auto' }) }

// On touch screens the controls get their own space (a band below the game in portrait,
// columns beside it in landscape) so they never cover the picture.
function layoutTouch(w, h) {
  const dpad = $('dpad'), A = $('aBtn'), B = $('bBtn'), M = $('menuBtn'), mute = $('mute')
  if (h >= w) {
    const zone = Math.max(140, Math.min(260, Math.round(h * 0.38), h - (w * VH) / VW))
    const top = h - zone
    const d = Math.min(zone - 20, w * 0.38)
    place(dpad, 10, top + (zone - d) / 2, d)
    const a = Math.min(zone * 0.42, w * 0.21), bb = a * 0.85
    place(A, w - 10 - a, top + zone * 0.12, a)
    place(B, w - 14 - a * 0.7 - bb, top + zone - bb - zone * 0.1, bb)
    const mid = 10 + d + (w - 14 - a * 0.7 - bb - 10 - d) / 2, s = Math.min(40, zone * 0.22)
    place(M, mid - s / 2, top + 8, s); place(mute, mid - s / 2, top + 16 + s, s)
    return { x: 0, y: 0, w, h: top }
  }
  const side = Math.max(120, Math.min(190, Math.round(w * 0.15)))
  const d = Math.min(side - 16, h * 0.45)
  place(dpad, (side - d) / 2, h - d - 12, d)
  const a = Math.min(side - 24, h * 0.27), bb = a * 0.85
  place(A, w - a - 8, h - a - bb - 20, a)
  place(B, Math.max(w - side + 6, w - a - 8 - bb * 0.6), h - bb - 10, bb)
  const s = Math.min(40, side * 0.35)
  place(M, 8, 8, s); place(mute, w - s - 8, 8, s)
  return { x: side, y: 0, w: w - side * 2, h }
}

function resize() {
  const dpr = window.devicePixelRatio || 1
  const w = innerWidth, h = innerHeight
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr)
  cv.style.width = w + 'px'; cv.style.height = h + 'px'
  const area = document.body.classList.contains('touch') ? layoutTouch(w, h) : { x: 0, y: 0, w, h }
  const aw = area.w * dpr, ah = area.h * dpr
  let s = Math.min(aw / VW, ah / VH)
  if (Math.floor(s) >= s * 0.86) s = Math.floor(s)
  k = s
  ox = Math.round(area.x * dpr + (aw - VW * k) / 2)
  oy = Math.round(area.y * dpr + (ah - VH * k) / 2)
}
addEventListener('resize', resize)
addEventListener('touchstart', () => setTimeout(resize, 0), { once: true, passive: true })
resize()

const FONT = (s) => `bold ${s}px "Trebuchet MS", Verdana, "DejaVu Sans", sans-serif`
function text(s, x, y, o = {}) {
  const size = o.size || 8
  ctx.font = FONT(size)
  ctx.textAlign = o.align || 'left'
  ctx.textBaseline = 'alphabetic'
  if (o.outline) { ctx.lineWidth = 3; ctx.strokeStyle = o.outline; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y) }
  if (o.shadow) { ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillText(s, x + 0.7, y + 0.7) }
  ctx.fillStyle = o.color || '#fff'
  ctx.fillText(s, x, y)
}
function measure(s, font) { ctx.font = font; return ctx.measureText(s).width }

const S = buildSprites()
const G = createGame(S, ctx, text, measure)
window.__game = G

input.onAny(() => audio.unlock())
addEventListener('pointerdown', () => audio.unlock())
addEventListener('keydown', (e) => { if (e.code === 'KeyM') toggleMute() })
const muteBtn = document.getElementById('mute')
function toggleMute() { const m = audio.toggleMute(); muteBtn.textContent = m ? '🔇' : '🔊' }
muteBtn.textContent = audio.muted ? '🔇' : '🔊'
muteBtn.addEventListener('click', (e) => { e.stopPropagation(); audio.unlock(); toggleMute(); muteBtn.blur() })
addEventListener('blur', () => G.pause())
document.addEventListener('visibilitychange', () => { if (document.hidden) G.pause() })

const STEP = 1000 / 60
let last = performance.now(), acc = 0
function frame(now) {
  acc += Math.min(250, now - last); last = now
  let steps = 0
  while (acc >= STEP && steps < 5) { input.update(); try { G.update() } catch (err) { console.error(err) } acc -= STEP; steps++ }
  if (steps === 5) acc = 0
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cv.width, cv.height)
  ctx.imageSmoothingEnabled = false
  ctx.setTransform(k, 0, 0, k, ox, oy)
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, VW, VH); ctx.clip()
  try { G.render() } catch (err) { console.error(err) }
  ctx.restore()
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)
