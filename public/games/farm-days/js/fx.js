import { rand } from './util.js'
import { img } from './assets.js'

// Lightweight particle system: dust, sparkles, hearts, confetti, floating text.
export const fx = { parts: [], texts: [] }

export function burst(x, y, n, { color = '#fff6c2', speed = 180, life = 0.6, size = 5, grav = 300, up = 0 } = {}) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2), s = rand(speed * 0.3, speed)
    fx.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - up, life, max: life, size: rand(size * 0.6, size), color, grav, kind: 'dot' })
  }
}
export function dust(x, y, dir = 0) {
  for (let i = 0; i < 4; i++) fx.parts.push({ x, y, vx: -dir * rand(20, 90) + rand(-30, 30), vy: rand(-50, -10), life: 0.4, max: 0.4, size: rand(6, 12), color: '#e8d9b0', grav: -20, kind: 'puff' })
}
export function hearts(x, y, n = 4) {
  for (let i = 0; i < n; i++) fx.parts.push({ x: x + rand(-25, 25), y, vx: rand(-20, 20), vy: rand(-110, -60), life: 1.2, max: 1.2, size: rand(22, 32), grav: 0, kind: 'icon', icon: 'heart' })
}
export function confetti(x, y, n = 80) {
  const cols = ['#ef5b5b', '#f7c548', '#5bbf6a', '#58a6e8', '#c77ddb', '#ff9a4d']
  for (let i = 0; i < n; i++) fx.parts.push({ x: x + rand(-300, 300), y: y + rand(-60, 0), vx: rand(-90, 90), vy: rand(-80, 120), life: rand(2, 3.6), max: 3.6, size: rand(7, 13), color: cols[i % cols.length], grav: 120, kind: 'conf', rot: rand(0, 6), vr: rand(-6, 6) })
}
export function clearFx() { fx.parts.length = 0; fx.texts.length = 0 }
export function floatText(x, y, text, color = '#fff') { fx.texts.push({ x, y, text, color, life: 1.4, max: 1.4 }) }

export function updateFx(dt) {
  for (const p of fx.parts) {
    p.life -= dt; p.vy += p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt
    if (p.rot !== undefined) p.rot += p.vr * dt
  }
  fx.parts = fx.parts.filter((p) => p.life > 0)
  for (const t of fx.texts) { t.life -= dt; t.y -= 38 * dt }
  fx.texts = fx.texts.filter((t) => t.life > 0)
}

export function drawFx(ctx, camX, camY = 0) {
  for (const p of fx.parts) {
    const a = Math.max(0, p.life / p.max)
    ctx.save(); ctx.globalAlpha = Math.min(1, a * 1.6); ctx.translate(p.x - camX, p.y - camY)
    if (p.kind === 'icon') { const im = img('ui', p.icon); if (im) ctx.drawImage(im, -p.size / 2, -p.size / 2, p.size, p.size) }
    else if (p.kind === 'conf') { ctx.rotate(p.rot); ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2) }
    else if (p.kind === 'puff') { ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, 0, p.size * (1.4 - a * 0.6), 0, 7); ctx.fill() }
    else { ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0, 0, p.size * (0.4 + a * 0.6), 0, 7); ctx.fill() }
    ctx.restore()
  }
  ctx.textAlign = 'center'; ctx.font = '700 26px "Trebuchet MS", system-ui, sans-serif'
  for (const t of fx.texts) {
    ctx.globalAlpha = Math.min(1, t.life / t.max * 2)
    ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(60,40,20,.85)'; ctx.strokeText(t.text, t.x - camX, t.y - camY)
    ctx.fillStyle = t.color; ctx.fillText(t.text, t.x - camX, t.y - camY)
  }
  ctx.globalAlpha = 1
}
