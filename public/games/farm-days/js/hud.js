import { img } from './assets.js'
import { roundRect } from './fishing.js'
import { VIEW_W, VIEW_H, WORLD_W, ZONES } from './world.js'

const FONT = '"Trebuchet MS", system-ui, sans-serif'

export function drawHud(ctx, game, player) {
  const { counts, chores } = game
  ctx.save()
  // chore card
  const cw = 330, ch = 56 + chores.length * 34
  ctx.fillStyle = 'rgba(255,247,222,.92)'; ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 4
  roundRect(ctx, 16, 16, cw, ch, 16); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#4a3320'; ctx.font = `800 22px ${FONT}`; ctx.textAlign = 'left'
  ctx.fillText('Farm Chores', 34, 46)
  chores.forEach((c, i) => {
    const y = 78 + i * 34, done = c.done(counts)
    ctx.fillStyle = done ? '#3f8f4a' : '#4a3320'
    ctx.font = `${done ? 700 : 600} 18px ${FONT}`
    ctx.fillText(`${done ? '✔' : '○'} ${c.text}`, 34, y)
    if (!done && c.progress) { ctx.textAlign = 'right'; ctx.fillStyle = '#8a6a44'; ctx.fillText(c.progress(counts), 16 + cw - 18, y); ctx.textAlign = 'left' }
    if (done) { ctx.fillStyle = 'rgba(63,143,74,.8)'; ctx.fillRect(56, y - 6, ctx.measureText(c.text).width, 2) }
  })
  // counters (top right, left of mute button)
  const items = [['star', counts.star], ['egg', counts.egg], ['corn', counts.corn], ['apple', counts.apple], ['fish', counts.fish]]
  let x = VIEW_W - 70
  ctx.textAlign = 'right'
  for (const [k, n] of items.reverse()) {
    const im = img('ui', k), w = k === 'fish' ? 44 : 32
    ctx.fillStyle = 'rgba(255,247,222,.92)'; roundRect(ctx, x - 84, 14, 84, 44, 22); ctx.fill()
    ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 3; ctx.stroke()
    if (im) ctx.drawImage(im, x - 78, 36 - 16, w * 0.75, 32)
    ctx.fillStyle = '#4a3320'; ctx.font = `800 22px ${FONT}`; ctx.fillText(String(n), x - 12, 45)
    x -= 92
  }
  // progress strip
  const bw = 360, bx = (VIEW_W - bw) / 2, by = VIEW_H - 26
  ctx.fillStyle = 'rgba(255,247,222,.8)'; roundRect(ctx, bx, by - 6, bw, 14, 7); ctx.fill()
  ctx.fillStyle = '#7a5230'
  for (const z of ZONES) ctx.fillRect(bx + (z.x / WORLD_W) * bw - 1, by - 6, 2, 14)
  ctx.fillStyle = '#e8473f'; ctx.beginPath(); ctx.arc(bx + (player.x / WORLD_W) * bw, by + 1, 8, 0, 7); ctx.fill()
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke()
  // interaction prompt
  if (game.prompt) {
    ctx.font = `800 22px ${FONT}`; const tw = ctx.measureText(game.prompt.text).width + 70
    const px = (VIEW_W - tw) / 2, py = VIEW_H - 92
    ctx.fillStyle = 'rgba(40,28,16,.82)'; roundRect(ctx, px, py, tw, 44, 22); ctx.fill()
    ctx.fillStyle = '#ffd36a'; roundRect(ctx, px + 10, py + 8, 32, 28, 8); ctx.fill()
    ctx.fillStyle = '#4a3320'; ctx.textAlign = 'center'; ctx.fillText(game.prompt.key || 'E', px + 26, py + 30)
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText(game.prompt.text, px + 54, py + 30)
  }
  // zone banner
  if (game.zoneBanner > 0) {
    ctx.globalAlpha = Math.min(1, game.zoneBanner)
    ctx.font = `800 54px ${FONT}`; ctx.textAlign = 'center'; ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(70,45,20,.9)'
    ctx.strokeText(game.zoneName, VIEW_W / 2, 150); ctx.fillStyle = '#fff3c7'; ctx.fillText(game.zoneName, VIEW_W / 2, 150)
  }
  ctx.restore()
}
