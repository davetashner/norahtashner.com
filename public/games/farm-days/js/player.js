import { clamp, lerp } from './util.js'
import { GROUND, WORLD_W, WATER_Y } from './world.js'
import { drawFrame } from './assets.js'
import { sfx } from './audio.js'
import { dust, burst } from './fx.js'

// [row, col] into each character atlas (rows: 0 = run/walk, 1 = chores, 2 = back views + goose rides)
const POSES = {
  jersh:  { walk: [0, 1, 2, 3, 4, 5, 6].map((c) => [0, c]), idle: [[0, 0]], air: [[0, 8]], crouch: [[1, 3]], carry: [[1, 4]], bouquet: [[1, 4]], fish: [[1, 6]], cheer: [[1, 9]], hold: [[1, 7]], ride: [[2, 3], [2, 4]], fly: [[2, 5], [2, 6]] },
  carish: { walk: [0, 1, 2, 3, 4, 5, 6].map((c) => [0, c]), idle: [[0, 0]], air: [[0, 8]], crouch: [[1, 3]], carry: [[1, 4]], bouquet: [[1, 5]], fish: [[1, 6]], cheer: [[1, 9]], hold: [[1, 8]], ride: [[2, 3], [2, 4]], fly: [[2, 5], [2, 6]] },
}
export const PLAYER_SIZE = 330   // rendered cell size => a person is ~150px tall

export function makePlayer(who = 'jersh') {
  return { who, x: 180, y: GROUND, vx: 0, vy: 0, dir: 1, seg: null, coyote: 0, buffer: 0, anim: 0, pose: null, poseT: 0,
    squash: 0, ride: null, swim: false, flapCd: 0, time: 0, safeX: 180, freeze: false }
}

function segY(s, x) { return s.y0 + (s.y1 - s.y0) * clamp((x - s.x0) / (s.x1 - s.x0 || 1), 0, 1) }

export function setPose(p, name, t = 0.9) { p.pose = name; p.poseT = t }

export function updatePlayer(p, dt, input, world) {
  p.time += dt
  if (p.freeze) { p.vx = 0; return }
  const segs = world.platforms
  const axis = input.axis()
  const maxV = (p.ride ? 430 : input.held('Shift') ? 470 : 330) * (p.seg?.tag === 'water' ? 0.58 : 1)
  p.vx = lerp(p.vx, axis * maxV, 1 - Math.pow(0.0005, dt))
  if (axis) p.dir = axis
  p.poseT = Math.max(0, p.poseT - dt); if (!p.poseT) p.pose = null
  p.coyote = Math.max(0, p.coyote - dt); p.buffer = Math.max(0, p.buffer - dt); p.flapCd = Math.max(0, p.flapCd - dt)
  if (input.hit('Space')) p.buffer = 0.13

  const prevY = p.y
  p.x = clamp(p.x + p.vx * dt, 40, WORLD_W - 40)

  // --- jump / flap
  const grounded = !!p.seg
  if (p.buffer && (grounded || p.coyote > 0)) {
    p.vy = p.ride ? -640 : p.seg?.tag === 'water' ? -760 : -900
    p.seg = null; p.coyote = 0; p.buffer = 0; p.squash = -0.18
    if (!p.ride) sfx.jump(); else sfx.flap()
    dust(p.x, p.y, p.dir)
  } else if (p.ride && !grounded && input.hit('Space') && p.flapCd === 0) {
    p.vy = Math.min(p.vy, -470); p.flapCd = 0.2; sfx.flap(); burst(p.x - p.dir * 40, p.y - 60, 4, { color: '#ffffff', speed: 90, life: 0.4, size: 5, grav: 60 })
  }
  if (!grounded) {
    const glide = p.ride && input.held('Space') && p.vy > 0
    p.vy += (glide ? 900 : 2300) * dt
    if (!p.ride && !input.held('Space') && p.vy < -300) p.vy *= 0.94   // short hop when released
    p.vy = Math.min(p.vy, 1100)
    p.y += p.vy * dt
  }

  // --- surfaces
  const was = p.seg
  if (p.seg) {
    // stay on / hop between connected segments
    let cur = p.seg
    if (p.x < cur.x0 || p.x > cur.x1) {
      cur = segs.find((s) => s !== cur && p.x >= s.x0 && p.x <= s.x1 && Math.abs(segY(s, p.x) - p.y) < 26) || null
    }
    if (cur) { p.seg = cur; p.y = segY(cur, p.x) } else { p.seg = null; p.coyote = 0.1 }
  } else {
    let best = null, by = Infinity
    for (const s of segs) {
      if (p.x < s.x0 || p.x > s.x1) continue
      const sy = segY(s, p.x)
      if (p.vy >= 0 && prevY <= sy + 16 && p.y >= sy && sy < by) { best = s; by = sy }
    }
    if (best) { p.seg = best; p.y = by; p.vy = 0 }
  }
  if (p.seg && !was) {   // landed
    if (p.seg.tag === 'water') { sfx.splash(); burst(p.x, p.y, 16, { color: '#bfe8ff', speed: 220, life: 0.7, size: 6, grav: 500, up: 260 }) }
    else { sfx.land(); dust(p.x, p.y, 0); p.squash = 0.2 }
  }
  if (p.seg && p.seg.tag !== 'water' && p.seg.tag !== 'bank') p.safeX = p.x
  p.swim = p.seg?.tag === 'water'
  if (p.y < 150) { p.y = 150; p.vy = Math.max(p.vy, 0) }   // soft ceiling so flights stay on screen
  if (p.y > GROUND + 200) { p.x = p.safeX; p.y = GROUND - 200; p.vy = 0 }
  p.squash = lerp(p.squash, 0, 1 - Math.pow(0.001, dt))
  p.anim += dt * (Math.abs(p.vx) / 38 + 0.0001)
}

export function drawPlayer(ctx, p, camX) {
  const set = POSES[p.who]
  const moving = Math.abs(p.vx) > 25
  let pose = 'idle', list = set.idle, idx = 0
  if (p.ride) {
    pose = p.seg ? 'ride' : 'fly'; list = set[pose]
    idx = p.seg ? (moving ? Math.floor(p.anim * 1.3) % 2 : 0) : (p.flapCd > 0.08 ? 1 : 0)
  } else if (p.pose && set[p.pose]) { list = set[p.pose] }
  else if (!p.seg) { list = set.air }
  else if (moving) { list = set.walk; idx = Math.floor(p.anim) % list.length }
  const key = list[idx % list.length]
  const size = p.ride ? PLAYER_SIZE * 1.15 : PLAYER_SIZE
  let y = p.y + (p.swim ? Math.sin(p.time * 3.2) * 3 : 0)
  if (!p.ride && p.seg && !moving && !p.pose) y += Math.sin(p.time * 2.2) * 0.8
  const sx = 1 + p.squash * -0.6, sy = 1 + p.squash
  ctx.save()
  if (p.swim) {   // hide everything below the waterline
    ctx.beginPath(); ctx.rect(p.x - camX - 300, -100, 600, WATER_Y - 6 + 100); ctx.clip()
  }
  drawFrame(ctx, p.who, key, p.x - camX, y + (p.swim ? 6 : 0), size, { flip: p.dir < 0, sx, sy })
  ctx.restore()
}
