import { loadAll, img, drawFrame, drawProp } from './assets.js'
import { input } from './input.js'
import { sfx, music, setMuted, isMuted, engine } from './audio.js'
import { fx, updateFx, drawFx, burst, hearts, confetti, floatText } from './fx.js'
import { makeWorld, SPECIES, ZONES, GROUND, WORLD_W, VIEW_W, VIEW_H, POND, DOCK } from './world.js'
import { makePlayer, updatePlayer, drawPlayer, setPose } from './player.js'
import { startFishing, updateFishing, drawFishing, roundRect } from './fishing.js'
import { drawHud } from './hud.js'
import { clamp, lerp, rand, ease } from './util.js'
import { createHarvest } from './harvest.js'
import { createPool } from './pool.js'

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const FONT = '"Trebuchet MS", system-ui, sans-serif'

function fit() {
  const rect = canvas.getBoundingClientRect()
  const s = clamp((rect.width * (devicePixelRatio || 1)) / VIEW_W, 1, 2)
  canvas.width = Math.round(VIEW_W * s); canvas.height = Math.round(VIEW_H * s)
}
addEventListener('resize', fit); fit()

// ---------- save ----------
const SAVE_KEY = 'farmdays.save'
const save = { who: 'jersh', best: 0, wins: 0 }
try { Object.assign(save, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')) } catch { /* fresh save */ }
const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)) } catch { /* ignore */ } }

// ---------- game state ----------
const game = { mode: 'loading', loaded: 0, who: save.who, time: 0, stars: { l2: 0, l3: 0 } }
const host = { who: () => game.who, name: () => (game.who === 'jersh' ? 'Mr. Jersh' : 'Mrs. Carish') }
const harvest = createHarvest(host)
const pool = createPool(host)
function setMode(m) { game.mode = m; document.body.dataset.scene = m === 'harvest' ? 'harvest' : m === 'pool' ? 'pool' : 'side' }
const confirmHit = () => input.hit('KeyE') || input.hit('Space') || tapped
let world, player

const CHORES = [
  { text: 'Collect 5 eggs', done: (c) => c.egg >= 5, progress: (c) => `${Math.min(c.egg, 5)}/5` },
  { text: 'Pet the 3 goats', done: (c) => c.pet >= 3, progress: (c) => `${c.pet}/3` },
  { text: 'Pick 3 sunflowers', done: (c) => c.sunflower >= 3, progress: (c) => `${c.sunflower}/3` },
  { text: 'Catch a fish at the pond', done: (c) => c.fish >= 1 },
  { text: 'Feed a cow 2 corn', done: (c) => c.fed >= 1, progress: (c) => `corn ${c.corn}/2` },
  { text: 'Fly the goose to the Golden Egg', done: (c) => c.golden >= 1 },
]

function newGame(who) {
  world = makeWorld(); player = makePlayer(who)
  Object.assign(game, { mode: 'play', who, counts: { star: 0, egg: 0, corn: 0, apple: 0, fish: 0, sunflower: 0, pet: 0, fed: 0, golden: 0 },
    chores: CHORES, prompt: null, zoneBanner: 0, zoneName: '', zone: -1, fishing: null, camX: 0, shake: 0, petted: new Set(), winT: 0, time: 0, introT: 0 })
  game.camX = 0
  setMode('play')
  music.play('farm_day'); game.dusk = false
}

// ---------- helpers ----------
const speciesOf = (a) => SPECIES[a.type]
const aliveItems = () => world.items.filter((i) => !i.got)

function say(x, y, text, color) { floatText(x, y, text, color) }

function updateAnimals(dt) {
  for (const a of world.animals) {
    if (a.ridden) continue
    const sp = speciesOf(a)
    a.t -= dt; a.happy = Math.max(0, a.happy - dt); a.hop = Math.max(0, a.hop - dt)
    if (a.state === 'walk') {
      a.x += a.dir * sp.speed * dt; a.anim += dt * sp.speed / 16
      if (Math.abs(a.x - a.home) > a.range) { a.dir = a.x > a.home ? -1 : 1 }
      if (a.t <= 0) { a.state = 'idle'; a.t = rand(1, 3.5) }
    } else if (a.state === 'graze') {
      if (a.t <= 0) { a.state = 'idle'; a.t = rand(1, 3) }
    } else if (a.t <= 0) {
      const r = Math.random()
      if (r < 0.55) { a.state = 'walk'; a.dir = Math.random() < 0.5 ? -1 : 1; a.t = rand(1.2, 3.5) }
      else if (r < 0.8 && sp.graze) { a.state = 'graze'; a.t = rand(1.2, 2.5) }
      else { a.state = 'idle'; a.t = rand(0.8, 2.5); if (sp.jump && Math.random() < 0.5) a.hop = 0.55 }
    }
    if (a.type === 'chicken') {
      a.layT -= dt
      if (a.layT <= 0 && Math.abs(player.x - a.x) < 1100) {
        const eggs = world.items.filter((i) => i.kind === 'egg' && !i.got).length
        if (eggs < 4) { world.items.push({ kind: 'egg', x: a.x, y: GROUND - 20, got: false, bob: 0, drop: 0.25 }); sfx.cluck() }
        a.layT = rand(5, 10)
      }
    }
  }
}

function nearestTarget() {
  const p = player
  if (p.ride) return { act: 'dismount', text: 'Hop off the goose' }
  if (p.seg?.tag === 'dock' && p.x > DOCK.x1 - 130) return { act: 'fish', text: 'Go fishing' }
  let best = null, bd = Infinity
  for (const a of world.animals) {
    if (a.ridden) continue
    const d = Math.abs(a.x - p.x)
    const reach = a.rideable ? 130 : a.cow ? 200 : a.type.startsWith('goat') ? 140 : 110
    if (d < reach && d < bd && Math.abs(p.y - GROUND) < 80) {
      bd = d
      if (a.rideable) best = { act: 'ride', a, text: 'Ride the goose' }
      else if (a.cow) best = game.counts.corn >= 2 ? { act: 'feed', a, text: 'Feed the cow (2 corn)' } : { act: 'hint', a, text: 'Moo! This cow wants 2 corn' }
      else if (a.type.startsWith('goat')) best = { act: 'pet', a, text: `Pet ${a.name || 'the goat'}` }
      else best = { act: 'hi', a, text: 'Say hi' }
    }
  }
  return best
}

function interact(t) {
  const p = player, c = game.counts
  if (!t) return
  if (t.act === 'dismount') { const g = p.ride; p.ride = null; g.ridden = false; g.x = p.x + p.dir * 80; sfx.honk(); setPose(p, 'cheer', 0.5) }
  else if (t.act === 'ride') { t.a.ridden = true; p.ride = t.a; sfx.honk(); hearts(p.x, p.y - 120, 2) }
  else if (t.act === 'fish') { game.fishing = startFishing(); p.freeze = true; p.dir = 1; setPose(p, 'fish', 999); sfx.splash() }
  else if (t.act === 'feed') {
    c.corn -= 2; c.fed++; t.a.happy = 2.2; sfx.moo(); hearts(t.a.x, GROUND - 220, 5); say(t.a.x, GROUND - 250, 'Fresh milk! +1', '#fff')
    world.items.push({ kind: 'milk', x: t.a.x + 120, y: GROUND - 34, got: false, bob: 0, drop: 0.3 }); setPose(p, 'cheer', 0.9)
  } else if (t.act === 'hint') { sfx[speciesOf(t.a).sound]?.(); t.a.happy = 1; say(t.a.x, GROUND - 250, 'Corn please!', '#ffe9a0') }
  else if (t.act === 'pet') {
    t.a.happy = 1.6; t.a.hop = 0.6; sfx.baa(); hearts(t.a.x, GROUND - 130, 3)
    if (!game.petted.has(t.a)) { game.petted.add(t.a); c.pet++; say(t.a.x, GROUND - 190, `${c.pet}/3 goats`, '#fff') }
  } else if (t.act === 'hi') { t.a.happy = 1.2; sfx[speciesOf(t.a).sound]?.(); hearts(t.a.x, GROUND - 100, 2) }
}

function collect(it) {
  const c = game.counts; it.got = true
  const x = it.x, y = it.y
  switch (it.kind) {
    case 'star': c.star++; sfx.star(); burst(x, y, 10, { color: '#ffe066', speed: 220 }); break
    case 'egg': c.egg++; sfx.collect(); burst(x, y, 8, { color: '#fff6dd' }); say(x, y - 30, `Egg ${Math.min(c.egg, 5)}/5`, '#fff'); setPose(player, 'carry', 0.8); break
    case 'corn': c.corn++; sfx.collect(); burst(x, y, 8, { color: '#ffd24a' }); say(x, y - 30, 'Corn!', '#ffe9a0'); setPose(player, 'carry', 0.8); break
    case 'sunflower': c.sunflower++; sfx.collect(); burst(x, y, 10, { color: '#ffcf33' }); say(x, y - 30, `Sunflower ${Math.min(c.sunflower, 3)}/3`, '#fff'); setPose(player, 'bouquet', 1.0); break
    case 'apple': c.apple++; sfx.collect(); burst(x, y, 8, { color: '#ff6a5a' }); say(x, y - 30, 'Apple!', '#fff'); break
    case 'milk': c.star += 3; sfx.star(); burst(x, y, 12, { color: '#ffffff' }); say(x, y - 30, 'Milk! +3 ⭐', '#fff'); break
    case 'golden_egg': c.golden++; c.star += 10; sfx.chore(); burst(x, y, 40, { color: '#ffe066', speed: 360, life: 1.2, size: 8 }); say(x, y - 50, 'THE GOLDEN EGG!', '#ffe066'); game.shake = 0.5; break
  }
}

let lastDone = 0
function checkChores() {
  const n = CHORES.filter((c) => c.done(game.counts)).length
  if (n > lastDone) { sfx.chore(); say(player.x, player.y - 230, 'Chore complete!', '#9df59d'); confetti(player.x, player.y - 300, 24) }
  lastDone = n
  if (n === CHORES.length && game.mode === 'play') { game.mode = 'win'; game.winT = 0; player.pose = 'cheer'; player.poseT = 999; sfx.win(); confetti(player.x, player.y - 400, 160)
    save.wins++; save.best = Math.max(save.best, game.counts.star); persist() }
}

// ---------- update ----------
function updatePlay(dt) {
  game.time += dt
  if (game.fishing) {
    music.play('fishing')
    const r = updateFishing(game.fishing, dt, input)
    if (input.hit('Escape')) { game.fishing = null; player.freeze = false; player.pose = null }
    if (r === 'caught') {
      game.counts.fish++; burst(player.x + 120, player.y - 40, 16, { color: '#bfe8ff', speed: 260, up: 220, grav: 600 }); say(player.x + 40, player.y - 200, `You caught a ${game.fishing.caught}!`, '#fff')
      world.items.push({ kind: 'star', x: player.x + 80, y: GROUND - 90, got: false, bob: 0 }); setPose(player, 'cheer', 1.1)
      setTimeout(() => { game.fishing = null; player.freeze = false }, 600)
    }
    game.prompt = null; updateFx(dt); return
  }
  const prog = player.x / WORLD_W
  if (prog > 0.55) game.dusk = true; else if (prog < 0.45) game.dusk = false
  music.play(game.dusk ? 'farm_dusk' : 'farm_day')
  const t = nearestTarget(); game.prompt = t
  if (input.hit('KeyE')) interact(t)
  updatePlayer(player, dt, input, world)
  if (player.ride) { player.ride.x = player.x; player.ride.dir = player.dir }
  updateAnimals(dt)
  for (const it of world.items) {
    if (it.got) continue
    it.bob += dt * 3
    if (it.drop) { it.drop -= dt }
    const big = it.big ? 80 : 0
    if (Math.abs(it.x - player.x) < 52 + big && Math.abs((it.y - 20) - (player.y - (player.ride ? 110 : 75))) < 100 + big) collect(it)
  }
  checkChores()
  const zi = ZONES.reduce((a, z, i) => (player.x >= z.x ? i : a), 0)
  if (zi !== game.zone) { game.zone = zi; game.zoneName = ZONES[zi].name; game.zoneBanner = 2.6 }
  game.zoneBanner = Math.max(0, game.zoneBanner - dt)
  game.shake = Math.max(0, game.shake - dt)
  const look = player.dir * 110
  game.camX = lerp(game.camX, clamp(player.x - VIEW_W * 0.42 + look, 0, WORLD_W - VIEW_W), 1 - Math.pow(0.0008, dt))
  updateFx(dt)
}

function updateWin(dt) {
  game.winT += dt; game.prompt = null; updateAnimals(dt); updateFx(dt)
  if (Math.random() < dt * 6) confetti(game.camX + rand(200, 1000), -20, 6)
  updatePlayer(player, dt, { hit: () => false, held: () => false, axis: () => 0 }, world)
  if (game.winT > 1.5 && confirmHit()) startCutscene()
}

// ---------- draw ----------
function tile(im, scale, par, bottom, camX, alpha = 1) {
  if (!im) return
  const w = im.width * scale, h = im.height * scale
  const off = -((camX * par) % w)
  ctx.globalAlpha = alpha
  for (let x = off - (off > 0 ? w : 0); x < VIEW_W; x += w) ctx.drawImage(im, x, bottom - h, w + 1, h)
  ctx.globalAlpha = 1
}

function drawBackdrop(camX, t) {
  const sky = img('layers', 'sky')
  if (sky) {
    const s = Math.max(VIEW_H * 0.92 / sky.height, 0.62); const w = sky.width * s, h = sky.height * s
    const off = -(((camX * 0.04 + t * 7) % w) + w) % w
    for (let x = off; x < VIEW_W; x += w) ctx.drawImage(sky, x, GROUND - 50 - h + 120, w + 1, h)
    const top = GROUND - 50 - h + 120
    if (top > 0) { ctx.fillStyle = '#3f86d6'; ctx.fillRect(0, 0, VIEW_W, top + 2) }
  } else { ctx.fillStyle = '#bfe3f5'; ctx.fillRect(0, 0, VIEW_W, VIEW_H) }
  tile(img('layers', 'far'), 0.5, 0.2, GROUND - 24, camX)
  tile(img('layers', 'mid'), 0.46, 0.42, GROUND - 14, camX)
}

function drawGround(camX) {
  const im = img('layers', 'ground')
  if (!im) { ctx.fillStyle = '#6aa84f'; ctx.fillRect(0, GROUND - 20, VIEW_W, VIEW_H); return }
  const s = 0.42, w = im.width * s, h = im.height * s
  const top = GROUND - 40
  const off = -(camX % w)
  for (let x = off - (off > 0 ? w : 0); x < VIEW_W; x += w) ctx.drawImage(im, x, top, w + 1, Math.max(h, VIEW_H - top))
}

function drawPond(camX) {
  const im = img('props', 'pond'); if (!im) return
  const w = POND.w, h = im.height * w / im.width
  ctx.drawImage(im, POND.x - camX, GROUND - POND.groundFrac * h, w, h)
}

function drawAnimals(camX) {
  const list = [...world.animals].sort((a, b) => a.x - b.x)
  for (const a of list) {
    if (a.ridden) continue
    const sp = speciesOf(a), x = a.x - camX
    if (x < -300 || x > VIEW_W + 300) continue
    let key = sp.idle, y = GROUND + 4
    if (a.hop > 0 && sp.jump) { key = sp.jump; y -= Math.sin((1 - a.hop / 0.6) * Math.PI) * 90 }
    else if (a.happy > 0) key = sp.happy
    else if (a.state === 'graze' && sp.graze) key = sp.graze
    else if (a.state === 'walk') key = sp.walk[Math.floor(a.anim) % sp.walk.length]
    else if (sp.idle === 'idle' && a.type !== 'chicken') y += Math.sin(game.time * 2 + a.home) * 0.6
    drawFrame(ctx, sp.atlas, key, x, y, sp.size, { flip: a.dir < 0 })
  }
}

const ICON_H = { star: 60, egg: 42, corn: 56, sunflower: 62, apple: 46, milk: 62, golden_egg: 120 }
function drawItems(camX) {
  for (const it of world.items) {
    if (it.got) continue
    const x = it.x - camX; if (x < -100 || x > VIEW_W + 100) continue
    const im = img('ui', it.kind); if (!im) continue
    const h = ICON_H[it.kind] || 50, w = im.width * h / im.height
    const bob = it.kind === 'egg' || it.kind === 'milk' ? 0 : Math.sin(it.bob) * 6
    let y = it.y + bob
    if (it.drop > 0) y -= it.drop * 120
    if (it.kind === 'golden_egg') {
      const g = ctx.createRadialGradient(x, y - 30, 10, x, y - 30, 130); g.addColorStop(0, 'rgba(255,230,120,.65)'); g.addColorStop(1, 'rgba(255,230,120,0)')
      ctx.fillStyle = g; ctx.fillRect(x - 140, y - 170, 280, 280)
    }
    ctx.drawImage(im, x - w / 2, y - h, w, h)
  }
}

function drawProps(camX, z) {
  for (const p of world.props) {
    if (p.z !== z) continue
    const x = p.x - camX; if (x < -600 || x > VIEW_W + 600) continue
    drawProp(ctx, 'props', p.name, x, GROUND + 6, p.h, { flip: p.flip })
  }
}

function drawTint() {
  const prog = game.mode === 'play' || game.mode === 'win' ? clamp(player.x / WORLD_W, 0, 1) : 0
  if (prog < 0.5) return
  const k = (prog - 0.5) * 2, a = 0.22 * k
  ctx.save(); ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = `rgb(${255},${Math.round(255 - 70 * k)},${Math.round(255 - 120 * k)})`; ctx.globalAlpha = a * 3.2; ctx.fillRect(0, 0, VIEW_W, VIEW_H); ctx.restore()
}

function drawPlay() {
  const camX = game.camX
  ctx.save()
  if (game.shake > 0) ctx.translate(rand(-4, 4) * game.shake * 3, rand(-4, 4) * game.shake * 3)
  drawBackdrop(camX, game.time)
  drawGround(camX)
  drawPond(camX)
  drawProps(camX, -1)
  drawProps(camX, 0)
  drawItems(camX)
  drawAnimals(camX)
  drawPlayer(ctx, player, camX)
  drawProps(camX, 1)
  drawFx(ctx, camX)
  ctx.restore()
  drawTint()
  drawHud(ctx, game, player)
  if (game.fishing) drawFishing(ctx, game.fishing, VIEW_W, VIEW_H)
  if (game.mode === 'win') drawWin()
}

function drawWin() {
  const a = clamp(game.winT - 0.8, 0, 1)
  ctx.save(); ctx.globalAlpha = a
  ctx.fillStyle = 'rgba(40,28,16,.55)'; ctx.fillRect(0, 0, VIEW_W, VIEW_H)
  ctx.fillStyle = 'rgba(255,247,222,.97)'; ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 6
  roundRect(ctx, VIEW_W / 2 - 330, 150, 660, 360, 28); ctx.fill(); ctx.stroke()
  ctx.textAlign = 'center'; ctx.fillStyle = '#c0452f'; ctx.font = `800 56px ${FONT}`; ctx.fillText('Level 1 Complete!', VIEW_W / 2, 235)
  ctx.fillStyle = '#4a3320'; ctx.font = `700 26px ${FONT}`
  ctx.fillText(`${game.who === 'jersh' ? 'Mr. Jersh' : 'Mrs. Carish'} found the Golden Egg!`, VIEW_W / 2, 285)
  const c = game.counts
  const row = [['star', c.star], ['egg', c.egg], ['fish', c.fish], ['apple', c.apple], ['corn', c.fed]]
  row.forEach(([k, n], i) => {
    const x = VIEW_W / 2 - 250 + i * 125, im = img('ui', k)
    if (im) { const h = 56, w = im.width * h / im.height; ctx.drawImage(im, x - w / 2, 320, Math.min(w, 80), h) }
    ctx.fillStyle = '#4a3320'; ctx.font = `800 30px ${FONT}`; ctx.fillText(String(n), x, 410)
  })
  ctx.font = `700 22px ${FONT}`; ctx.fillStyle = '#8a6a44'; ctx.fillText(`Level 1 complete · Best: ${save.best} stars`, VIEW_W / 2, 450)
  if (game.winT > 1.5 && Math.floor(game.winT * 2) % 2 === 0) { ctx.fillStyle = '#3f8f4a'; ctx.font = `800 26px ${FONT}`; ctx.fillText('Press E or tap: climb into the combine!', VIEW_W / 2, 490) }
  ctx.restore()
}

// ---------- title ----------
let titleSel = save.who === 'carish' ? 1 : 0
const CARDS = [{ who: 'jersh', name: 'Mr. Jersh', x: 400 }, { who: 'carish', name: 'Mrs. Carish', x: 880 }]
let tapped = false, pointer = null

function toLogical(e) {
  const r = canvas.getBoundingClientRect(), s = Math.min(r.width / VIEW_W, r.height / VIEW_H)
  return { x: (e.clientX - r.left - (r.width - VIEW_W * s) / 2) / s, y: (e.clientY - r.top - (r.height - VIEW_H * s) / 2) / s }
}
canvas.addEventListener('pointerdown', (e) => {
  sfx.unlock(); tapped = true; setTimeout(() => (tapped = false), 120)
  if (game.mode !== 'title') return
  pointer = toLogical(e)
  CARDS.forEach((c, i) => { if (Math.abs(pointer.x - c.x) < 150 && pointer.y > 330 && pointer.y < 690) { titleSel = i; startFromTitle() } })
})
addEventListener('keydown', () => sfx.unlock(), { once: true })
document.getElementById('mute').addEventListener('click', () => { setMuted(!isMuted()); syncMute() })
addEventListener('keydown', (e) => { if (e.code === 'KeyM') { setMuted(!isMuted()); syncMute() } })
function syncMute() { document.getElementById('mute').textContent = isMuted() ? '🔇' : '🔊' }
syncMute()

function startFromTitle() { save.who = CARDS[titleSel].who; persist(); lastDone = 0; newGame(save.who) }

function updateTitle(dt) {
  game.time += dt
  if (input.hit('ArrowLeft')) { titleSel = 0; sfx.collect() }
  if (input.hit('ArrowRight')) { titleSel = 1; sfx.collect() }
  if (input.hit('KeyE') || input.hit('Space')) startFromTitle()
}

function drawTitle() {
  const bg = img('layers', 'title_bg')
  if (bg) { const s = Math.max(VIEW_W / bg.width, VIEW_H / bg.height); ctx.drawImage(bg, (VIEW_W - bg.width * s) / 2, (VIEW_H - bg.height * s) / 2, bg.width * s, bg.height * s) }
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(0, 0, VIEW_W, VIEW_H)
  const logo = img('ui', 'logo')
  if (logo) { const w = 470, h = logo.height * w / logo.width; ctx.drawImage(logo, (VIEW_W - w) / 2, 10 + Math.sin(game.time * 1.6) * 4, w, h) }
  CARDS.forEach((c, i) => {
    const sel = i === titleSel, im = img('sprites', c.who + '_portrait')
    const bounce = sel ? Math.sin(game.time * 5) * 5 : 0
    const w = 250, h = 330, x = c.x - w / 2, y = 345 + bounce
    ctx.fillStyle = sel ? 'rgba(255,247,222,.97)' : 'rgba(255,247,222,.7)'; ctx.strokeStyle = sel ? '#e8873b' : '#7a5230'; ctx.lineWidth = sel ? 8 : 4
    roundRect(ctx, x, y, w, h, 24); ctx.fill(); ctx.stroke()
    if (im) { const s = Math.min((w - 30) / im.width, (h - 30) / im.height); const iw = im.width * s, ih = im.height * s; ctx.drawImage(im, c.x - iw / 2, y + (h - ih) / 2, iw, ih) }
  })
  // walking preview of selected character
  drawFrame(ctx, CARDS[titleSel].who, [0, Math.floor(game.time * 7) % 7], VIEW_W / 2, 650, 300)
  ctx.textAlign = 'center'; ctx.font = `800 26px ${FONT}`; ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(60,40,20,.85)'
  const msg = 'Choose your farmer · ← → then Enter / tap'
  ctx.strokeText(msg, VIEW_W / 2, 706); ctx.fillStyle = '#fff'; ctx.fillText(msg, VIEW_W / 2, 706)
}

// ---------- level 1 -> 2 cutscene: climb into the combine ----------
const cut = { t: 0 }
function startCutscene() {
  setMode('cut'); cut.t = 0; music.stop(0.6)
  player.ride = null; player.y = GROUND; player.seg = world.platforms.find((s) => s.tag === 'ground' && player.x >= s.x0 && player.x <= s.x1) || null
  player.freeze = true; player.pose = null; player.vx = 0; player.dir = 1
  if (!player.seg) { player.x = 7480; player.seg = null }
  cut.px0 = player.x
  cut.camX = game.camX
  game.camX = clamp(player.x - 380, 0, WORLD_W - VIEW_W); cut.camX = game.camX
  fx.parts.length = 0; fx.texts.length = 0
  cut.said = false
}
function combineGeom() {
  const h = 330, im = img('props', 'combine'), w = im ? im.width * h / im.height : 680
  return { h, w }
}
function updateCutscene(dt) {
  cut.t += dt
  const { w } = combineGeom()
  const ladderX = (comb) => comb - w * 0.5 + w * 0.1
  const stopX = cut.px0 + w * 0.5 + 120                // where the combine parks (world x of its center)
  let cx
  if (cut.t < 1.8) cx = lerp(game.camX + VIEW_W + w, stopX, ease(cut.t / 1.8))
  else if (cut.t < 4.3) cx = stopX
  else cx = stopX + ease(clamp((cut.t - 4.3) / 1.7, 0, 1)) * (VIEW_W + w)
  cut.cx = cx
  // farmer walks to the ladder, then climbs
  if (cut.t > 1.8 && cut.t < 2.9) { player.vx = 160; player.x = lerp(cut.px0, ladderX(stopX) + 8, ease((cut.t - 1.8) / 1.1)); player.anim += dt * 7 }
  else { player.vx = 0 }
  cut.climb = clamp((cut.t - 2.9) / 1.0, 0, 1)
  if (cut.t > 3.9 && !cut.said) { cut.said = true; sfx.chore() }
  if (cut.t > 1.8 && cut.t < 1.9) sfx.honk()
  if (cut.t > 4.3) engine(clamp((cut.t - 4.3) / 1.0, 0, 1))
  updateFx(dt)
  if (cut.t > 5.8 || (cut.t > 0.8 && confirmHit())) startHarvest()
}
function drawCutscene() {
  const camX = game.camX
  drawBackdrop(camX, game.time); drawGround(camX); drawPond(camX); drawProps(camX, -1); drawProps(camX, 0); drawAnimals(camX)
  const { h, w } = combineGeom(), im = img('props', 'combine'), cx = cut.cx - camX, base = GROUND + 14
  const ladderX = cx - w * 0.5 + w * 0.1
  if (cut.climb < 1 || cut.t < 3.95) {
    // farmer: walking, then climbing the ladder to the cab
    const p = player
    if (cut.climb > 0) {
      const t = ease(cut.climb), cabX = cx - w * 0.5 + w * 0.34, cabY = base - h * 0.68
      const x = lerp(ladderX + 12, cabX, t), y = lerp(base - 20, cabY, t)
      drawFrame(ctx, p.who, [1, 4], x, y, PLAYER_SZ * lerp(1, 0.45, t), { alpha: 1 - clamp((t - 0.7) / 0.3, 0, 1) })
    } else {
      drawPlayer(ctx, p, camX)
    }
  }
  if (im) ctx.drawImage(im, cx - w / 2, base - h, w, h)
  if (cut.t >= 3.9) {
    // driver badge in the cab window
    const pim = img('sprites', game.who + '_portrait'), bx = cx - w * 0.5 + w * 0.36, by = base - h * 0.69
    if (pim) {
      ctx.save(); ctx.beginPath(); ctx.arc(bx, by, 30, 0, 7); ctx.clip()
      const s = 70 / pim.width; ctx.drawImage(pim, bx - 35, by - 30, pim.width * s, pim.height * s); ctx.restore()
      ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bx, by, 30, 0, 7); ctx.stroke()
    }
    if (cut.t < 5.4) {
      ctx.save(); ctx.textAlign = 'center'; ctx.font = '800 34px "Trebuchet MS", system-ui, sans-serif'; ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(60,40,20,.85)'
      const msg = 'Time to harvest the corn!'; ctx.strokeText(msg, VIEW_W / 2, 150); ctx.fillStyle = '#fff'; ctx.fillText(msg, VIEW_W / 2, 150); ctx.restore()
    }
  }
  drawFx(ctx, camX)
  const fade = cut.t > 5.2 ? clamp((cut.t - 5.2) / 0.6, 0, 1) : 0
  if (fade) { ctx.fillStyle = `rgba(255,248,225,${fade})`; ctx.fillRect(0, 0, VIEW_W, VIEW_H) }
}
const PLAYER_SZ = 330

function startHarvest() { engine(null); setMode('harvest'); harvest.start(); music.play('harvest') }
function startPool() { harvest.stop(); setMode('pool'); pool.start(); music.play('pool') }
function startFinal() { pool.stop(); setMode('final'); game.finalT = 0; confetti(game.camX + 640, 0, 100); music.play('title')
  save.wins++; persist() }

function drawFinal() {
  const bg = img('layers', 'title_bg')
  if (bg) { const s = Math.max(VIEW_W / bg.width, VIEW_H / bg.height); ctx.drawImage(bg, (VIEW_W - bg.width * s) / 2, (VIEW_H - bg.height * s) / 2, bg.width * s, bg.height * s) }
  ctx.fillStyle = 'rgba(40,28,16,.4)'; ctx.fillRect(0, 0, VIEW_W, VIEW_H)
  ctx.fillStyle = 'rgba(255,247,222,.97)'; ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 6; roundRect(ctx, VIEW_W / 2 - 340, 120, 680, 440, 30); ctx.fill(); ctx.stroke()
  ctx.textAlign = 'center'; ctx.fillStyle = '#c0452f'; ctx.font = `800 54px ${FONT}`; ctx.fillText('What a Farm Day!', VIEW_W / 2, 200)
  ctx.fillStyle = '#4a3320'; ctx.font = `700 24px ${FONT}`; ctx.fillText(`${host.name()} did the chores, harvested the corn and ruled the pool.`, VIEW_W / 2, 245)
  const star = img('ui', 'star'), rows = [['Level 1: Farm chores', null], ['Level 2: Corn harvest', game.stars.l2], ['Level 3: Sharks & Minnows', game.stars.l3]]
  rows.forEach(([name, n], i) => {
    const y = 300 + i * 70
    ctx.textAlign = 'left'; ctx.fillStyle = '#4a3320'; ctx.font = `800 26px ${FONT}`; ctx.fillText(name, VIEW_W / 2 - 290, y + 36)
    for (let k = 0; k < 3 && star; k++) { ctx.globalAlpha = n === null ? 1 : k < n ? 1 : 0.2; ctx.drawImage(star, VIEW_W / 2 + 90 + k * 62, y, 56, 52) }
    ctx.globalAlpha = 1
  })
  ctx.textAlign = 'center'; ctx.fillStyle = '#8a6a44'; ctx.font = `700 20px ${FONT}`; ctx.fillText(`Days finished: ${save.wins}`, VIEW_W / 2, 520)
  if (game.finalT > 1 && Math.floor(game.finalT * 2) % 2 === 0) { ctx.fillStyle = '#3f8f4a'; ctx.font = `800 26px ${FONT}`; ctx.fillText('Press E or tap to play again', VIEW_W / 2, 548) }
  drawFx(ctx, 0, 0)
}

// ---------- main loop ----------
function drawLoading() {
  ctx.fillStyle = '#2d4a2a'; ctx.fillRect(0, 0, VIEW_W, VIEW_H)
  ctx.fillStyle = '#fff3c7'; ctx.font = `800 40px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText('Farm Days', VIEW_W / 2, VIEW_H / 2 - 20)
  ctx.fillStyle = 'rgba(255,255,255,.25)'; roundRect(ctx, VIEW_W / 2 - 160, VIEW_H / 2, 320, 16, 8); ctx.fill()
  ctx.fillStyle = '#ffd36a'; roundRect(ctx, VIEW_W / 2 - 160, VIEW_H / 2, 320 * Math.min(1, game.loaded / 70), 16, 8); ctx.fill()
}

let last = performance.now(), acc = 0
function frameLoop(now) {
  acc += Math.min(0.1, (now - last) / 1000); last = now
  const dt = 1 / 60
  while (acc >= dt) {
    if (game.mode === 'title') updateTitle(dt)
    else if (game.mode === 'play') updatePlay(dt)
    else if (game.mode === 'win') updateWin(dt)
    else if (game.mode === 'cut') updateCutscene(dt)
    else if (game.mode === 'harvest') {
      harvest.update(dt, input)
      if (harvest.done && harvest.endT > 1.2 && confirmHit()) { game.stars.l2 = harvest.result.stars; startPool() }
    } else if (game.mode === 'pool') {
      pool.update(dt, input)
      if (pool.done && pool.endT > 1.2 && confirmHit()) { game.stars.l3 = pool.result.stars; startFinal() }
    } else if (game.mode === 'final') {
      game.finalT += dt; updateFx(dt)
      if (Math.random() < dt * 5) confetti(rand(200, 1000), -20, 5)
      if (game.finalT > 1 && confirmHit()) { lastDone = 0; game.stars = { l2: 0, l3: 0 }; newGame(game.who) }
    }
    input.endFrame(); acc -= dt
  }
  const k = canvas.width / VIEW_W
  ctx.setTransform(k, 0, 0, k, 0, 0)
  ctx.clearRect(0, 0, VIEW_W, VIEW_H)
  if (game.mode === 'loading') drawLoading()
  else if (game.mode === 'title') drawTitle()
  else if (game.mode === 'cut') drawCutscene()
  else if (game.mode === 'harvest') harvest.draw(ctx)
  else if (game.mode === 'pool') pool.draw(ctx)
  else if (game.mode === 'final') drawFinal()
  else drawPlay()
  requestAnimationFrame(frameLoop)
}

window.__farm = { music, game, get player() { return player }, get world() { return world }, newGame, save, harvest, pool, startHarvest, startPool }   // debug hook for tests
requestAnimationFrame(frameLoop)
// debug/test hook: index.html#play=jersh&x=3200&stars=3 jumps straight into the game
function debugStart() {
  const q = new URLSearchParams(location.hash.slice(1))
  if (!q.has('play')) return false
  startFromTitleAs(q.get('play')); if (q.has('x')) { player.x = +q.get('x'); player.safeX = player.x; game.camX = clamp(player.x - 540, 0, WORLD_W - VIEW_W) }
  if (q.get('level') === '2') { startFromTitleAs(q.get('play')); startHarvest(); return true }
  if (q.get('level') === '3') { startFromTitleAs(q.get('play')); startPool(); return true }
  if (q.get('level') === 'cut') { startFromTitleAs(q.get('play')); player.x = +(q.get('x') || 7000); startCutscene(); return true }
  if (q.get('ride')) { const g = world.animals.find((a) => a.rideable); g.ridden = true; player.ride = g }
  if (q.get('y')) { player.y = +q.get('y'); player.seg = null }
  return true
}
function startFromTitleAs(who) { titleSel = who === 'carish' ? 1 : 0; startFromTitle() }
loadAll(() => { game.loaded++ }).then(() => { game.mode = 'title'; music.play('title'); debugStart() }).catch((e) => { console.error(e) })
