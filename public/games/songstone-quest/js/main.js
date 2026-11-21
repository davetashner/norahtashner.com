import { input } from './input.js'
import { audio } from './audio.js'
import { buildSprites } from './gfx.js'
import { createGame, VW, VH } from './game.js'

const cv = document.getElementById('game')
const ctx = cv.getContext('2d')
let k = 1, ox = 0, oy = 0

function resize() {
  const dpr = window.devicePixelRatio || 1
  const w = innerWidth, h = innerHeight
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr)
  cv.style.width = w + 'px'; cv.style.height = h + 'px'
  let s = Math.min(cv.width / VW, cv.height / VH)
  if (Math.floor(s) >= s * 0.86) s = Math.floor(s)
  k = s; ox = Math.round((cv.width - VW * k) / 2); oy = Math.round((cv.height - VH * k) / 2)
  // portrait touch screens: put the game near the top so the buttons fit underneath
  if (input.isTouch && h > w * 1.2) oy = Math.min(oy, Math.round(64 * dpr))
}
addEventListener('resize', resize)
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
