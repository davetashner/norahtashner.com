// Core game: player, world loading, transitions, dialogue, HUD, menus, title, ending and saving.
import { input } from './input.js'
import { audio } from './audio.js'
import { TILE, THEMES, tileImage, ANIMATED, canvas, painter } from './gfx.js'
import * as W from './world.js'
import { overlap, Fx, burst, Pickup, Chest, Npc, ShopItem, Block, Crystal, Thrown, Boomerang, Arrow, Bomb, Enemy, Boss, BOSS_INFO } from './entities.js'

export const VW = 256, VH = 224, HUD = 32, PW = 256, PH = 192
const SAVE_KEY = 'songstone-quest-save-v1'
const DIRV = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }
const DIRA = { down: Math.PI / 2, up: -Math.PI / 2, left: Math.PI, right: 0 }
const SOLID = { walk: 'TAbRr#~QFMHDSpZLW+BucEeGPU', enemy: 'TAbRr#~QFMHDSpZLW+BucEeGPUOX', fly: 'TAbRr#MHDSpZLW+BucEeGPU' }
const FONT = (s) => `bold ${s}px "Trebuchet MS", Verdana, "DejaVu Sans", sans-serif`
const ITEM_ORDER = ['boomerang', 'bombs', 'bow']

function newSave() {
  return { v: 1, area: 'overworld', sx: 0, sy: 2, px: 5 * 16 + 3, py: 4 * 16 + 4, hp: 6, maxHp: 6, gems: 0, bombs: 0, arrows: 0,
    items: {}, equip: null, keys: {}, bigkeys: {}, stones: [false, false, false], heartPieces: 0, flags: {}, visited: {}, time: 0, done: false, faints: 0 }
}
export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    if (!s || s.v !== 1 || typeof s.hp !== 'number' || !W.getScreen(s.area, s.sx, s.sy)) return null
    return Object.assign(newSave(), s)
  } catch { return null }
}

// ================================================================== Player
class Player {
  constructor() { this.x = 0; this.y = 0; this.w = 10; this.h = 8; this.dir = 'down'; this.state = 'walk'; this.t = 0; this.walk = 0; this.inv = 0; this.kb = null; this.vx = 0; this.vy = 0; this.charge = 0; this.carry = null; this.pushT = 0; this.moving = false }
  get cx() { return this.x + 5 }
  get cy() { return this.y + 4 }
  hurtBox() { return { x: this.x, y: this.y - 7, w: 10, h: 15 } }
  swordBox() {
    const cx = this.cx, cy = this.y - 1
    if (this.state === 'spin') return { x: cx - 19, y: cy - 17, w: 38, h: 36 }
    if (this.state !== 'swing' || this.t < 2 || this.t > 11) return null
    return { down: { x: cx - 9, y: cy + 3, w: 18, h: 15 }, up: { x: cx - 9, y: cy - 19, w: 18, h: 15 }, left: { x: cx - 20, y: cy - 8, w: 15, h: 17 }, right: { x: cx + 5, y: cy - 8, w: 15, h: 17 } }[this.dir]
  }
}

// ================================================================== Game
export function createGame(S, lo, text, measure) {
  const G = {
    S, mode: 'title', frame: 0, st: newSave(), player: new Player(), ents: [], grid: null, scr: null, area: 'overworld', sx: 0, sy: 2,
    screenCanvas: null, animTiles: [], dialog: null, fade: null, toastMsg: null, toastT: 0, shakeT: 0, stopT: 0, scroll: null, entry: { x: 0, y: 0 },
    boss: null, bossIntro: 0, menuSel: 0, titleSel: 0, titleConfirm: false, ending: null, savedExists: !!loadSave(), lockMsgT: 0,
    text,
  }
  const P = G.player
  const sfx = (n) => audio.sfx(n)
  G.sfx = sfx
  G.spawn = (e) => { G.ents.push(e); return e }
  G.shake = (n) => { G.shakeT = Math.max(G.shakeT, n) }
  G.hitStop = (n) => { G.stopT = Math.max(G.stopT, n) }
  G.toast = (msg, n = 150) => { G.toastMsg = msg; G.toastT = n }

  // ------------------------------------------------------------ tiles
  G.tileAt = (tx, ty) => (tx < 0 || ty < 0 || tx >= W.COLS || ty >= W.ROWS ? '#' : G.grid[ty][tx])
  const theme = () => THEMES[W.areaTheme(G.area, G.scr)]
  const themeName = () => W.areaTheme(G.area, G.scr)
  const isWarp = (tx, ty) => G.scr.warps && G.scr.warps[`${tx},${ty}`]
  function solidTile(tx, ty, mode) {
    if (tx < 0 || ty < 0 || tx >= W.COLS || ty >= W.ROWS) return mode !== 'walk'
    const ch = G.grid[ty][tx]
    if (mode === 'walk' && (ch === 'U' || ch === 'D') && isWarp(tx, ty)) return false
    return SOLID[mode].includes(ch)
  }
  G.free = (x, y, w, h, mode = 'walk') => {
    if (mode === 'ghost') return x >= 0 && y >= 0 && x + w <= PW && y + h <= PH
    const x0 = Math.floor(x / TILE), y0 = Math.floor(y / TILE), x1 = Math.floor((x + w - 0.01) / TILE), y1 = Math.floor((y + h - 0.01) / TILE)
    for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (solidTile(tx, ty, mode)) return false
    if (mode !== 'fly') { const b = { x, y, w, h }; for (const e of G.ents) if (e.solid && !e.dead && overlap(b, e.box())) return false }
    return true
  }
  G.setTile = (tx, ty, ch) => { G.grid[ty][tx] = ch; renderScreen() }

  // ------------------------------------------------------------ flags & doors
  const F = G.st.flags
  const flag = (k) => !!G.st.flags[k]
  const setFlag = (k) => { G.st.flags[k] = 1 }
  function doorId(tx, ty) {
    // canonical id for a 2-wide door on a room edge (shared by both rooms)
    const a = G.area, x = G.sx, y = G.sy
    if (ty === 0) return `${a}:${x},${y - 1}:S`
    if (ty === W.ROWS - 1) return `${a}:${x},${y}:S`
    if (tx === 0) return `${a}:${x - 1},${y}:E`
    if (tx === W.COLS - 1) return `${a}:${x},${y}:E`
    return `${a}:${x},${y}:${tx},${ty}`
  }
  function doorTiles(tx, ty) {
    if (ty === 0 || ty === W.ROWS - 1) return [[7, ty], [8, ty]]
    if (tx === 0 || tx === W.COLS - 1) return [[tx, 5], [tx, 6]]
    return [[tx, ty]]
  }
  const openFlag = () => G.scr.switchFlag || `open:${G.area}:${G.sx},${G.sy}`
  const isOpen = () => flag(openFlag())
  void F

  // ------------------------------------------------------------ screen loading
  function buildGrid() {
    const g = G.scr.grid.map((r) => r.split(''))
    const open = isOpen()
    for (let y = 0; y < W.ROWS; y++) for (let x = 0; x < W.COLS; x++) {
      const ch = g[y][x]
      if ((ch === '+' || ch === 'B') && flag('door:' + doorId(x, y))) g[y][x] = '.'
      else if (ch === 'c' && flag('crack:' + doorId(x, y))) g[y][x] = '.'
      else if (ch === 'r' && flag(`rock:${G.area}:${G.sx},${G.sy}:${x},${y}`)) g[y][x] = G.area === 'overworld' ? '.' : '.'
      else if ((ch === 'u') && open) g[y][x] = '.'
      else if (ch === 'Q' && open) g[y][x] = '='
      else if (ch === 'E' && open) g[y][x] = 'e'
      else if (ch === 'G' && W.stones(G.st) >= 3) g[y][x] = ':'
      else if (ch === 'k') g[y][x] = '.'
    }
    return g
  }
  function renderScreen() {
    const [c, g] = G.screenCanvas && G.screenCanvas.width ? [G.screenCanvas, G.screenCanvas.getContext('2d')] : canvas(PW, PH)
    const th = theme(), tn = themeName()
    G.animTiles = []
    for (let y = 0; y < W.ROWS; y++) for (let x = 0; x < W.COLS; x++) {
      const ch = G.grid[y][x]
      g.drawImage(tileImage(ch, th, tn, x, y, 0), x * TILE, y * TILE)
      if (ANIMATED.has(ch)) G.animTiles.push([x, y, ch])
    }
    G.screenCanvas = c
  }
  function snapshot() { const [c, g] = canvas(PW, PH); g.drawImage(G.screenCanvas, 0, 0); return c }

  function spawnEnts() {
    G.ents = []; G.boss = null
    const scr = G.scr, a = G.area, key = `${G.sx},${G.sy}`
    for (let y = 0; y < W.ROWS; y++) for (let x = 0; x < W.COLS; x++) {
      const ch = scr.grid[y][x]
      if (ch === 'k' && !isOpen()) G.spawn(new Block(x, y, themeName()))
      if (ch === 'k' && isOpen()) G.spawn(new Block(x, y, themeName()))
      if (ch === 'w') G.spawn(new Crystal(x, y, isOpen()))
    }
    for (const e of scr.ents || []) {
      if (e.t === 'enemy') G.spawn(new Enemy(e.x, e.y, e.k))
      else if (e.t === 'npc') G.spawn(new Npc(e.x, e.y, e.k, e.talk))
      else if (e.t === 'chest') { const f = `chest:${a}:${key}:${e.x},${e.y}`; G.spawn(new Chest(e.x, e.y, e.item, f, flag(f), e.appear && !flag(f) && !isOpen())) }
      else if (e.t === 'hp') { if (!flag('hp:' + e.id)) G.spawn(new Pickup(e.x * TILE + 8, e.y * TILE + 8, 'hp', { id: e.id })) }
      else if (e.t === 'shop') G.spawn(new ShopItem(e.x, e.y, e.item, e.price, e.need, e.once))
    }
    if (scr.boss && !flag('boss:' + a)) {
      G.boss = G.spawn(new Boss(scr.boss))
      G.bossIntro = 180
      // seal the doors while the boss is alive
      for (let y = 0; y < W.ROWS; y++) for (let x = 0; x < W.COLS; x++) if ((x === 0 || y === 0 || x === W.COLS - 1 || y === W.ROWS - 1) && G.grid[y][x] === '.') G.grid[y][x] = 'u'
      renderScreen()
    }
    if (scr.boss && flag('boss:' + a) && !G.st.stones[W.dungeon(a).stone] && !W.dungeon(a).final) {
      G.spawn(new Pickup(128, 96, 'stone' + W.dungeon(a).stone))
    }
  }
  G.loadScreen = (area, sx, sy) => {
    G.area = area; G.sx = sx; G.sy = sy
    G.scr = W.getScreen(area, sx, sy)
    G.grid = buildGrid()
    G.screenCanvas = null
    renderScreen()
    spawnEnts()
    const vk = `${area}:${sx},${sy}`
    const first = !G.st.visited[vk]
    G.st.visited[vk] = 1
    audio.music(G.boss ? 'boss' : W.areaMusic(area, G.scr))
    if (G.boss) { const b = BOSS_INFO[G.scr.boss]; G.toast(b.tip, 260) } else if (first && G.scr.tip) G.toast(G.scr.tip[0], 220)
    else if (first && area !== 'overworld' && sx === W.dungeon(area).start[0] && sy === W.dungeon(area).start[1]) G.toast(W.dungeon(area).name, 120)
    G.entry = { x: P.x, y: P.y }
    Object.assign(G.st, { area, sx, sy, px: P.x, py: P.y })
    save()
  }
  function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(G.st)); G.savedExists = true } catch { /* storage full or blocked */ } }
  G.save = save

  // ------------------------------------------------------------ transitions
  function edgeExit(dx, dy) {
    const nx = G.sx + dx, ny = G.sy + dy
    const next = W.getScreen(G.area, nx, ny)
    if (!next) return false
    const oldCanvas = snapshot(), fromX = P.x, fromY = P.y
    const toX = dx < 0 ? PW - P.w - 1 : dx > 0 ? 1 : P.x
    const bossRoom = next.boss && !flag('boss:' + G.area)
    const toY = dy < 0 ? PH - P.h - 1 - (bossRoom ? 30 : 0) : dy > 0 ? 9 + (bossRoom ? 30 : 0) : P.y
    P.x = toX; P.y = toY; P.carry = P.carry || null
    if (P.state !== 'carry') P.state = 'walk'
    G.loadScreen(G.area, nx, ny)
    G.ents = G.ents.filter((e) => !(e instanceof Boomerang || e instanceof Arrow || e instanceof Bomb))
    G.scroll = { dx, dy, t: 0, n: dx ? 48 : 40, old: oldCanvas, fromX, fromY, toX, toY }
    G.mode = 'scroll'
    return true
  }
  G.fadeTo = (fn, color = '#000') => { if (G.fade) return; G.fade = { t: 0, n: 22, fn, color, done: false } }
  function enterDungeon(area) {
    const d = W.dungeon(area)
    sfx('stairs')
    G.fadeTo(() => { P.x = 7 * 16 + 11; P.y = 9 * 16 + 2; P.dir = 'up'; P.state = 'walk'; P.carry = null; G.loadScreen(area, d.start[0], d.start[1]) })
  }
  function exitDungeon(msg) {
    const d = W.dungeon(G.area)
    sfx('stairs')
    G.fadeTo(() => { P.x = d.exit.tile[0] * 16 - 5; P.y = d.exit.tile[1] * 16; P.dir = 'down'; P.state = 'walk'; P.carry = null; G.loadScreen('overworld', d.exit.screen[0], d.exit.screen[1]); if (msg) G.toast(msg, 200) })
  }

  // ------------------------------------------------------------ dialogue
  G.say = (pages, onDone) => {
    G.dialog = { pages: pages.slice(), i: 0, n: 0, onDone, sel: 0, lines: null }
    G.prevMode = G.mode === 'dialog' ? G.prevMode : G.mode
    G.mode = 'dialog'; audio.duck(true)
  }
  function wrap(str, width, size) {
    const out = []
    for (const para of String(str).split('\n')) {
      let line = ''
      for (const word of para.split(' ')) {
        const tryL = line ? line + ' ' + word : word
        if (measure(tryL, FONT(size)) > width && line) { out.push(line); line = word } else line = tryL
      }
      out.push(line)
    }
    return out
  }
  function dialogUpdate() {
    const d = G.dialog
    let page = d.pages[d.i]
    if (page === '__give_sword__') { closeDialog(); grant('sword'); return }
    if (typeof page === 'string') page = { text: page }
    if (!d.lines) d.lines = wrap(page.text, 222, 8)
    const total = d.lines.join('').length
    if (d.n < total) { d.n += input.held('sword') ? 3 : 1; if (G.frame % 3 === 0) sfx('text') }
    if (page.choice && d.n >= total) {
      if (input.hit('up') || input.hit('down') || input.hit('left') || input.hit('right')) { d.sel = 1 - d.sel; sfx('menu') }
    }
    if (input.hit('sword') || (page.choice && input.hit('item'))) {
      if (d.n < total) { d.n = total; return }
      sfx('menu')
      if (page.choice) { const yes = d.sel === 0 && input.hit('sword'); closeDialog(); (yes ? page.onYes : page.onNo || (() => {}))(); return }
      d.i++; d.n = 0; d.lines = null
      if (d.i >= d.pages.length) closeDialog()
    }
  }
  function closeDialog() {
    const d = G.dialog; G.dialog = null
    G.mode = G.prevMode === 'dialog' || !G.prevMode ? 'play' : G.prevMode
    audio.duck(false)
    if (d && d.onDone) d.onDone()
  }

  // ------------------------------------------------------------ items & collecting
  function grant(item, onDone) {
    const st = G.st
    let sound = 'item', extra = null
    if (['sword', 'boomerang', 'bombs', 'bow'].includes(item)) {
      st.items[item] = true
      if (item === 'bombs') st.bombs = Math.max(st.bombs, 10)
      if (item === 'bow') st.arrows = Math.max(st.arrows, 20)
      if (item !== 'sword') st.equip = item
    } else if (item === 'key') { st.keys[G.area] = (st.keys[G.area] || 0) + 1; sound = 'chest' }
    else if (item === 'bigkey') { st.bigkeys[G.area] = true }
    else if (item === 'heartpiece') {
      st.heartPieces++
      const n = st.heartPieces % 4
      if (n === 0) { st.maxHp += 2; st.hp = st.maxHp; extra = 'Four pieces! Your hearts grew by one!' } else extra = `You have ${n} of 4 pieces. Collect ${4 - n} more for a new heart.`
    } else if (item === 'container') { st.maxHp += 2; st.hp = st.maxHp }
    else if (item.startsWith('stone')) { st.stones[+item[5]] = true; sound = 'songstone'; st.hp = st.maxHp }
    else if (item === 'gems20') { st.gems = Math.min(999, st.gems + 20); sound = 'chest' }
    save()
    const txt = (W.ITEM_TEXT[item] || ['You got something!']).slice()
    if (extra) txt.push(extra)
    G.mode = 'itemget'; G.itemget = { item, t: 0, txt, onDone }
    P.state = 'walk'; P.carry = null
    audio.duck(true); sfx(sound)
  }
  G.grant = grant
  G.collect = (pk) => {
    const st = G.st, k = pk.kind
    if (k === 'heart') { st.hp = Math.min(st.maxHp, st.hp + 2); sfx('heart') }
    else if (k === 'gem') { st.gems = Math.min(999, st.gems + 1); sfx('gem') }
    else if (k === 'gem5') { st.gems = Math.min(999, st.gems + 5); sfx('gem') }
    else if (k === 'bombs') { st.bombs = Math.min(20, st.bombs + 4); sfx('gem') }
    else if (k === 'arrows') { st.arrows = Math.min(30, st.arrows + 5); sfx('gem') }
    else if (k === 'hp') { if (pk.id) setFlag('hp:' + pk.id); grant('heartpiece') }
    else if (k === 'container') { setFlag('hc:' + G.area); grant('container') }
    else if (k.startsWith('stone')) {
      const d = W.dungeon(G.area)
      if (!flag('hc:' + G.area)) { setFlag('hc:' + G.area); st.maxHp += 2; G.ents.forEach((e) => { if (e instanceof Pickup && e.kind === 'container') e.dead = true }) }
      grant(k, () => exitDungeon(W.stones(st) >= 3 ? 'The Hush Tower gate is open!' : `${3 - W.stones(st)} Songstone${3 - W.stones(st) > 1 ? 's' : ''} left to find!`))
      void d
    }
  }
  G.drop = (x, y, chance) => {
    if (Math.random() > chance) return
    const st = G.st, r = Math.random()
    const low = st.hp <= 2
    let k = r < (low ? 0.45 : 0.25) ? 'heart' : r < 0.62 ? 'gem' : r < 0.72 ? 'gem5' : null
    if (!k && st.items.bombs && r < 0.86) k = 'bombs'
    else if (!k && st.items.bow) k = 'arrows'
    if (!k) k = 'gem'
    G.spawn(new Pickup(x, y, k, { pop: true }))
  }

  // ------------------------------------------------------------ room logic
  function openRoom(silent) {
    if (isOpen()) return
    setFlag(openFlag())
    let changed = false
    for (let y = 0; y < W.ROWS; y++) for (let x = 0; x < W.COLS; x++) {
      const ch = G.grid[y][x]
      if (ch === 'u' && !(G.boss && !G.boss.dead)) { G.grid[y][x] = '.'; changed = true }
      if (ch === 'Q') { G.grid[y][x] = '='; changed = true }
    }
    for (const e of G.ents) if (e instanceof Chest && e.hidden) e.reveal(G)
    if (changed) renderScreen()
    if (!silent) sfx('secret')
    save()
  }
  G.onEnemyKilled = () => {
    if (G.scr.open === 'enemies' && !G.ents.some((e) => e.isEnemy && !e.dead)) openRoom()
  }
  G.checkPlates = () => {
    if (G.scr.open !== 'plates' || isOpen()) return
    const plates = []
    for (let y = 0; y < W.ROWS; y++) for (let x = 0; x < W.COLS; x++) if (G.grid[y][x] === 'o') plates.push([x, y])
    const ptx = Math.floor(P.cx / TILE), pty = Math.floor(P.cy / TILE)
    const covered = plates.every(([x, y]) => (ptx === x && pty === y) || G.ents.some((e) => e instanceof Block && !e.moving && Math.round(e.x / TILE) === x && Math.round(e.y / TILE) === y))
    if (plates.length && covered) openRoom()
  }
  G.switchHit = () => { if (G.scr.open === 'switch' || G.scr.switchFlag) openRoom() }
  G.hitTiles = (b, kind, passive) => {
    const x0 = Math.floor(b.x / TILE), y0 = Math.floor(b.y / TILE), x1 = Math.floor((b.x + b.w - 1) / TILE), y1 = Math.floor((b.y + b.h - 1) / TILE)
    let changed = false
    for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
      if (tx < 0 || ty < 0 || tx >= W.COLS || ty >= W.ROWS) continue
      const ch = G.grid[ty][tx]
      if (kind === 'sword' && (ch === 'b' || ch === '%')) {
        G.grid[ty][tx] = '.'; changed = true
        burst(G, tx * 16 + 8, ty * 16 + 8, ch === 'b' ? '#3aa040' : '#5eae40', 6)
        G.drop(tx * 16 + 8, ty * 16 + 8, ch === 'b' ? 0.25 : 0.2)
        sfx('sword')
      }
      if (kind === 'arrow' && ch === 'E') {
        G.grid[ty][tx] = 'e'; changed = true; sfx('switch')
        if (G.scr.open === 'eyes' && !G.grid.some((r) => r.includes('E'))) { renderScreen(); openRoom() }
      }
      if (kind === 'bomb' && (ch === 'c' || ch === 'r')) {
        if (ch === 'c') { setFlag('crack:' + doorId(tx, ty)); for (const [ax, ay] of doorTiles(tx, ty)) if (G.grid[ay][ax] === 'c') G.grid[ay][ax] = '.' }
        else { setFlag(`rock:${G.area}:${G.sx},${G.sy}:${tx},${ty}`); G.grid[ty][tx] = '.'; burst(G, tx * 16 + 8, ty * 16 + 8, '#9a8a7a', 8) }
        changed = true; sfx('secret'); save()
      }
    }
    if (changed) renderScreen()
    void passive
  }
  G.bossDefeated = (b) => {
    const d = W.dungeon(G.area)
    setFlag('boss:' + G.area); save()
    for (let y = 0; y < W.ROWS; y++) for (let x = 0; x < W.COLS; x++) if ((x === 0 || y === 0 || x === W.COLS - 1 || y === W.ROWS - 1) && G.grid[y][x] === 'u') G.grid[y][x] = '.'
    renderScreen()
    audio.music(null)
    if (d.final) { setTimeout(() => {}, 0); G.endingDelay = 90; return }
    G.spawn(new Pickup(b.cx - 20, b.cy, 'container', {}))
    G.spawn(new Pickup(128, 96, 'stone' + d.stone, {}))
    sfx('secret')
    audio.music(d.music)
  }

  // ------------------------------------------------------------ player
  G.hurtPlayer = (dmg, fx, fy) => {
    if (P.inv > 0 || G.mode !== 'play' || P.state === 'fall') return
    G.st.hp -= dmg; P.inv = 70; sfx('hurt'); G.shake(4)
    const dx = P.cx - fx, dy = P.cy - fy, l = Math.hypot(dx, dy) || 1
    P.kb = { vx: (dx / l) * 2.4, vy: (dy / l) * 2.4, n: 10 }
    if (P.state === 'swing' || P.state === 'charge' || P.state === 'spin') P.state = 'walk'
    if (G.st.hp <= 0) { G.st.hp = 0; G.mode = 'dead'; G.deadT = 0; P.carry = null; sfx('faint'); audio.music(null) }
  }
  function respawn() {
    const st = G.st
    st.hp = st.maxHp; st.faints++
    P.inv = 60; P.kb = null; P.state = 'walk'; P.carry = null
    if (G.area !== 'overworld') { const d = W.dungeon(G.area); P.x = 7 * 16 + 11; P.y = 9 * 16 + 2; P.dir = 'up'; G.loadScreen(G.area, d.start[0], d.start[1]) }
    else { P.x = G.entry.x; P.y = G.entry.y; G.loadScreen('overworld', G.sx, G.sy) }
    G.mode = 'play'
    G.toast('You are OK! Try again!', 120)
  }
  function moveP(vx, vy) {
    let bx = false, by = false
    if (vx) { if (G.free(P.x + vx, P.y, P.w, P.h)) P.x += vx; else { bx = true; nudge('x', vx) } }
    if (vy) { if (G.free(P.x, P.y + vy, P.w, P.h)) P.y += vy; else { by = true; nudge('y', vy) } }
    return [bx, by]
  }
  function nudge(axis, v) {
    // corner assist: slide around corners when nearly aligned
    if (axis === 'x' && !input.dir().y) { for (let o = 1; o <= 6; o++) for (const s of [-1, 1]) if (G.free(P.x + v, P.y + o * s, P.w, P.h)) { if (G.free(P.x, P.y + s, P.w, P.h)) P.y += s; return } }
    if (axis === 'y' && !input.dir().x) { for (let o = 1; o <= 6; o++) for (const s of [-1, 1]) if (G.free(P.x + o * s, P.y + v, P.w, P.h)) { if (G.free(P.x + s, P.y, P.w, P.h)) P.x += s; return } }
  }
  function facingPoint(d = 10) { const [dx, dy] = DIRV[P.dir]; return [P.cx + dx * d, P.cy + dy * d] }
  function interact() {
    const [fx, fy] = facingPoint(9)
    const probe = { x: fx - 3, y: fy - 3, w: 6, h: 6 }
    for (const e of G.ents) {
      if (e.dead || !overlap(probe, e.box())) continue
      if (e instanceof Npc) { const lines = W.TALK[e.talk](G.st); G.say(lines); if (e.kind === 'potato' || e.kind === 'nug') sfx('select'); return true }
      if (e instanceof Chest && !e.hidden && !e.open) { e.open = true; setFlag(e.flag); sfx('chest'); grant(e.item); return true }
      if (e instanceof ShopItem && e.available(G)) { buy(e); return true }
    }
    const tx = Math.floor(fx / TILE), ty = Math.floor(fy / TILE), ch = G.tileAt(tx, ty), k = `${tx},${ty}`
    if (ch === 'S' && G.scr.signs && G.scr.signs[k]) { G.say(G.scr.signs[k]); return true }
    if (ch === 'D' && !isWarp(tx, ty)) { G.say((G.scr.doors && G.scr.doors[k]) || ['It is locked.']); return true }
    if ((ch === 'Z' || ch === 'G') && G.scr.statue) { G.say(G.scr.statue); return true }
    if (ch === 'p') { G.grid[ty][tx] = G.area === 'overworld' ? '.' : '.'; renderScreen(); P.carry = S.pot; P.state = 'carry'; sfx('lift'); if (Math.random() < 0.3) G.drop(tx * 16 + 8, ty * 16 + 8, 1); return true }
    return false
  }
  function buy(item) {
    const names = { heart: 'A heart refill', bombs: '5 bombs', arrows: '10 arrows', heartpiece: 'A piece of heart' }
    G.say([{ text: `${names[item.item]} for ${item.price} gems?    Yes / No`, choice: true, onYes: () => {
      const st = G.st
      if (st.gems < item.price) { sfx('error'); G.say(['Oops! You need more gems.']); return }
      st.gems -= item.price; sfx('select')
      if (item.item === 'heart') { st.hp = st.maxHp; sfx('heart') }
      if (item.item === 'bombs') st.bombs = Math.min(20, st.bombs + 5)
      if (item.item === 'arrows') st.arrows = Math.min(30, st.arrows + 10)
      if (item.item === 'heartpiece') { setFlag(item.once); grant('heartpiece') }
      save()
    } }])
  }
  function activateItem() {
    const st = G.st, it = st.equip
    if (!it) { G.toast('No item yet! Find one in a dungeon.', 90); return }
    const [dx, dy] = DIRV[P.dir]
    if (it === 'boomerang') { if (G.ents.some((e) => e instanceof Boomerang)) return; const d = input.dir(); G.spawn(new Boomerang(G, d.x || d.y ? d.x : dx, d.x || d.y ? d.y : dy)); P.state = 'throw'; P.t = 0 }
    if (it === 'bombs') { if (st.bombs <= 0) { sfx('error'); G.toast('Out of bombs! Buy more at the market.', 90); return } if (G.ents.filter((e) => e instanceof Bomb).length >= 2) return; st.bombs--; G.spawn(new Bomb(P.cx + dx * 12, P.cy - 2 + dy * 12)); sfx('lift') }
    if (it === 'bow') { if (st.arrows <= 0) { sfx('error'); G.toast('Out of arrows!', 90); return } if (G.ents.filter((e) => e instanceof Arrow).length >= 2) return; st.arrows--; G.spawn(new Arrow(G, [dx, dy])); P.state = 'throw'; P.t = 0 }
  }
  function throwCarry() {
    const [dx, dy] = DIRV[P.dir]
    G.spawn(new Thrown(P.cx - 6, P.cy - 8, dx, dy, P.carry)); P.carry = null; P.state = 'walk'; sfx('throw')
  }
  function swordHits(box, src) {
    for (const e of G.ents) {
      if (e.isEnemy && !e.dead && overlap(box, e.box())) e.hurt(G, src === 'spin' ? 2 : 1, P.cx, P.cy, src)
      if (e instanceof Crystal && overlap(box, e.box())) e.hit(G)
    }
    G.hitTiles(box, 'sword')
  }
  function playerUpdate() {
    const st = G.st
    P.t++
    if (P.inv > 0) P.inv--
    if (P.state === 'fall') { if (P.t > 40) { st.hp -= 1; P.state = 'walk'; P.x = G.entry.x; P.y = G.entry.y; P.inv = 60; if (st.hp <= 0) { st.hp = 0; G.mode = 'dead'; G.deadT = 0; sfx('faint') } } return }
    if (P.kb) { moveP(P.kb.vx, 0); moveP(0, P.kb.vy); if (--P.kb.n <= 0) P.kb = null }
    const d = input.dir()
    let sp = P.state === 'charge' ? 0.8 : 1.35
    if (P.state === 'swing' || P.state === 'spin' || P.state === 'throw') sp = 0
    if (d.x && d.y) sp *= 0.75
    const ch = G.tileAt(Math.floor(P.cx / TILE), Math.floor(P.cy / TILE))
    const ice = ch === 'i'
    let tvx = d.x * sp, tvy = d.y * sp
    if (ice) { P.vx += (tvx - P.vx) * 0.04; P.vy += (tvy - P.vy) * 0.04 } else { P.vx = tvx; P.vy = tvy }
    P.moving = !!(d.x || d.y) && sp > 0
    if (P.moving && P.state !== 'charge') {
      // facing: keep current facing if still held, otherwise pick the pressed axis
      const held = DIRV[P.dir]
      if (!((held[0] && held[0] === d.x) || (held[1] && held[1] === d.y))) P.dir = d.x > 0 ? 'right' : d.x < 0 ? 'left' : d.y > 0 ? 'down' : 'up'
    }
    if (P.vx || P.vy) {
      const [bx, by] = moveP(P.vx, P.vy)
      if (ice) { if (bx) P.vx = 0; if (by) P.vy = 0 }
      if (P.moving) P.walk++
      // pushing blocks / opening locked doors
      if ((bx || by) && P.moving && !(d.x && d.y)) {
        const [fx, fy] = facingPoint(8)
        const blk = G.ents.find((e) => e instanceof Block && overlap({ x: fx - 2, y: fy - 2, w: 4, h: 4 }, e.box()))
        if (blk) blk.tryPush(G, DIRV[P.dir][0], DIRV[P.dir][1])
        const tx = Math.floor(fx / TILE), ty = Math.floor(fy / TILE), t = G.tileAt(tx, ty)
        if (t === '+' || t === 'B') tryUnlock(tx, ty, t)
      }
    } else P.walk = 0
    // edges
    if (P.x < 0 && !edgeExit(-1, 0)) P.x = 0
    else if (P.x + P.w > PW && !edgeExit(1, 0)) P.x = PW - P.w
    else if (P.y < 0 && !edgeExit(0, -1)) P.y = 0
    else if (P.y + P.h > PH && !edgeExit(0, 1)) P.y = PH - P.h
    if (G.mode !== 'play') return
    // warps, stairs, pits
    const ctx = Math.floor(P.cx / TILE), cty = Math.floor(P.cy / TILE), under = G.tileAt(ctx, cty)
    const w = isWarp(ctx, cty)
    if (w && !G.fade) { enterDungeon(w.area); return }
    if (under === 'X' && G.area !== 'overworld' && !G.fade) { exitDungeon(); return }
    if (under === 'O' && !P.kb) { P.state = 'fall'; P.t = 0; P.carry = null; sfx('fall'); return }
    if (G.scr.open === 'plates' && G.frame % 6 === 0) G.checkPlates()

    // actions
    if (P.state === 'carry') {
      if (input.hit('sword') || input.hit('item')) throwCarry()
    } else if (P.state === 'walk') {
      if (input.hit('sword')) { if (!interact() && st.items.sword && G.mode === 'play') { P.state = 'swing'; P.t = 0; sfx('sword') } }
      else if (input.hit('item')) activateItem()
    } else if (P.state === 'swing') {
      const sb = P.swordBox(); if (sb) swordHits(sb, 'sword')
      if (P.t >= 14) { P.state = input.held('sword') ? 'charge' : 'walk'; P.charge = 0 }
    } else if (P.state === 'charge') {
      P.charge++
      if (P.charge === 45) sfx('charge')
      if (!input.held('sword')) { if (P.charge >= 45) { P.state = 'spin'; P.t = 0; sfx('spin') } else P.state = 'walk' }
    } else if (P.state === 'spin') {
      swordHits(P.swordBox(), 'spin')
      if (P.t >= 22) P.state = 'walk'
    } else if (P.state === 'throw') { if (P.t >= 10) P.state = 'walk' }
  }
  function tryUnlock(tx, ty, t) {
    const st = G.st
    if (t === '+' && (st.keys[G.area] || 0) > 0) { st.keys[G.area]--; openDoor(tx, ty); return }
    if (t === 'B' && st.bigkeys[G.area]) { openDoor(tx, ty); return }
    if (G.lockMsgT <= 0) { G.toast(t === 'B' ? 'This big door needs the Big Key.' : 'Locked! You need a small key.', 110); G.lockMsgT = 150 }
  }
  function openDoor(tx, ty) {
    setFlag('door:' + doorId(tx, ty))
    for (const [x, y] of doorTiles(tx, ty)) G.grid[y][x] = '.'
    renderScreen(); sfx('door'); save()
  }

  // ------------------------------------------------------------ main update
  G.update = () => {
    G.frame++
    if (G.toastT > 0) G.toastT--
    if (G.lockMsgT > 0) G.lockMsgT--
    if (G.shakeT > 0) G.shakeT--
    if (input.hit('menu') && G.mode === 'play' && !G.fade) { G.mode = 'menu'; G.menuSel = Math.max(0, ITEM_ORDER.indexOf(G.st.equip)); sfx('menu'); audio.duck(true); return }
    if (G.fade) {
      const f = G.fade; f.t++
      if (f.t === f.n && !f.done) { f.done = true; f.fn() }
      if (f.t >= f.n * 2) G.fade = null
      return
    }
    switch (G.mode) {
      case 'title': return titleUpdate()
      case 'intro': return introUpdate()
      case 'dialog': return dialogUpdate()
      case 'menu': return menuUpdate()
      case 'ending': return endingUpdate()
      case 'itemget': {
        const ig = G.itemget; ig.t++
        if (ig.t === 70) G.say(ig.txt, () => { audio.duck(false); G.mode = 'play'; if (ig.onDone) ig.onDone() })
        return
      }
      case 'dead': {
        G.deadT++
        P.dir = ['down', 'left', 'up', 'right'][Math.floor(G.deadT / 6) % 4]
        if (G.deadT === 80) G.fadeTo(respawn)
        return
      }
      case 'scroll': {
        const s = G.scroll; s.t++
        if (s.t >= s.n) { G.scroll = null; G.mode = 'play'; G.entry = { x: P.x, y: P.y } }
        return
      }
      case 'play': break
      default: return
    }
    G.st.time++
    if (G.stopT > 0) { G.stopT--; return }
    if (G.bossIntro > 0) G.bossIntro--
    if (G.endingDelay > 0) { if (--G.endingDelay === 0) startEnding(); }
    playerUpdate()
    if (G.mode !== 'play') return
    for (const e of G.ents) if (!e.dead) e.update(G)
    G.ents = G.ents.filter((e) => !e.dead)
  }

  // ------------------------------------------------------------ menu
  function menuUpdate() {
    const owned = ITEM_ORDER.filter((k) => G.st.items[k])
    if (input.hit('left')) { G.menuSel = (G.menuSel + ITEM_ORDER.length - 1) % ITEM_ORDER.length; sfx('menu') }
    if (input.hit('right')) { G.menuSel = (G.menuSel + 1) % ITEM_ORDER.length; sfx('menu') }
    const sel = ITEM_ORDER[G.menuSel]
    if ((input.hit('sword') || input.hit('item')) && owned.includes(sel)) { G.st.equip = sel; sfx('select') }
    if (input.hit('menu')) { G.mode = 'play'; audio.duck(false); sfx('menu'); if (owned.includes(sel)) G.st.equip = sel }
  }
  G.pause = () => { if (G.mode === 'play' && !G.fade) { G.mode = 'menu'; audio.duck(true) } }

  // ------------------------------------------------------------ title / intro / ending
  const INTRO = [
    'Long ago, the people of Melody Meadow found three magic Songstones.',
    'As long as the Songstones sparkled, the whole land was full of music.',
    'Birds sang. Goats danced. Even the rocks hummed a little.',
    'But one night, Grumblewick, a grumpy shadow owl who HATES noise, swooped down and stole all three!',
    'Now Melody Meadow is quiet. Too quiet. Somebody has to bring the music back...',
    'And that somebody is NORAH!',
  ]
  function startNew() {
    G.st = newSave()
    G.mode = 'intro'; G.introT = 0
    audio.music('title')
    G.say(INTRO, () => {
      G.fadeTo(() => {
        P.x = 5 * 16 + 3; P.y = 3 * 16 + 4; P.dir = 'right'; P.state = 'walk'
        G.loadScreen('overworld', 0, 2)
        G.mode = 'play'
        G.say(W.TALK.grandpa(G.st))
      })
    })
  }
  function continueGame() {
    const s = loadSave()
    if (!s) return startNew()
    G.st = s
    G.fadeTo(() => {
      P.x = s.px; P.y = s.py; P.dir = 'down'; P.state = 'walk'; P.carry = null
      if (s.area !== 'overworld') {
        const scr = W.getScreen(s.area, s.sx, s.sy)
        if (scr && scr.boss && !s.flags['boss:' + s.area]) { const d = W.dungeon(s.area); s.sx = d.start[0]; s.sy = d.start[1]; P.x = 7 * 16 + 11; P.y = 9 * 16 + 2 }
      }
      G.loadScreen(s.area, s.sx, s.sy)
      G.mode = 'play'
      G.toast('Welcome back, Norah!', 120)
    })
  }
  function titleUpdate() {
    if (audio.current !== 'title') audio.music('title')
    const opts = G.savedExists ? ['Continue', 'New Game'] : ['New Game']
    if (G.titleConfirm) return
    if (input.hit('up') || input.hit('down')) { G.titleSel = (G.titleSel + 1) % opts.length; sfx('menu') }
    if (input.hit('sword') || input.hit('menu')) {
      sfx('select')
      const o = opts[G.titleSel] || opts[0]
      if (o === 'Continue') continueGame()
      else if (G.savedExists) {
        G.titleConfirm = true
        G.say([{ text: 'Start a new game? Your saved game will be erased.    Yes / No', choice: true, onYes: () => { G.titleConfirm = false; G.sel = 0; G.fadeTo(startNew) }, onNo: () => { G.titleConfirm = false; G.mode = 'title' } }])
        G.prevMode = 'title'
      } else G.fadeTo(startNew)
    }
  }
  function introUpdate() {}
  function startEnding() {
    G.st.done = true; save()
    G.fadeTo(() => {
      G.mode = 'ending'; G.ending = { t: 0, phase: 0 }
      audio.music('ending')
      P.x = 7 * 16 + 11; P.y = 6 * 16; P.dir = 'down'; P.state = 'walk'
      G.loadScreen('overworld', 1, 2)
      G.mode = 'ending'
      audio.music('ending')
      G.say([
        'Grumblewick tumbled down, down, down... and landed on a soft pillow of moss.',
        '"Hmph," he said. "I only stole the Songstones because nobody ever sang a song for ME."',
        'So Norah sang him a song. A silly one, with a lot of la-la-las. Grumblewick smiled for the very first time.',
        'Norah carried the three Songstones home, and music filled Melody Meadow once again!',
        'The birds sang. The goats danced. Potato howled along. And the rocks hummed, just a little.',
      ], () => { G.mode = 'ending'; G.ending.phase = 1; G.ending.t = 0 })
      G.prevMode = 'ending'
    })
  }
  function endingUpdate() {
    const e = G.ending; e.t++
    if (e.phase === 1 && e.t > 200 && (input.hit('sword') || input.hit('menu'))) { G.fadeTo(() => { G.mode = 'title'; G.titleSel = 0; G.savedExists = true; audio.music('title') }) }
  }
  G.startEnding = startEnding

  // ================================================================ rendering
  const lc = lo
  function drawTiles(ox, oy) {
    lc.drawImage(G.screenCanvas, ox, oy)
    const th = theme(), tn = themeName(), f = Math.floor(G.frame / 24) % 2
    for (const [x, y, ch] of G.animTiles) lc.drawImage(tileImage(ch, th, tn, x, y, f), x * TILE + ox, y * TILE + oy)
  }
  function drawSword(ox, oy, angle, r0 = 4, r1 = 15) {
    const px = P.cx + ox, py = P.y - 3 + oy
    const g = painter(lc)
    const ax = Math.cos(angle), ay = Math.sin(angle)
    g.line(px + ax * r0, py + ay * r0, px + ax * r1, py + ay * r1, '#1c1424', 3)
    g.line(px + ax * r0, py + ay * r0, px + ax * r1, py + ay * r1, '#e8f0ff', 1)
    g.line(px + ax * (r0 + 1), py + ay * (r0 + 1) + 1, px + ax * (r1 - 1), py + ay * (r1 - 1) + 1, '#9ab0d0', 1)
    g.rect(px + ax * r0 - 1, py + ay * r0 - 1, 3, 3, '#e0a020')
  }
  function drawPlayer(ox, oy) {
    if (P.inv > 0 && Math.floor(P.inv / 3) % 2 && G.mode === 'play') return
    const fr = S.norah[P.dir]
    let f = P.moving ? Math.floor(P.walk / 8) % 2 : 0
    const sx = Math.round(P.x - 3 + ox), sy = Math.round(P.y - 8 + oy)
    if (P.state === 'fall') { const k = Math.max(0.1, 1 - P.t / 40); lc.drawImage(fr[0], sx + 8 - 8 * k, sy + 8 - 8 * k + P.t / 4, 16 * k, 16 * k); return }
    lc.drawImage(S.fx.shadow, Math.round(P.x - 1 + ox), Math.round(P.y + 6 + oy))
    let swordAngle = null, r1 = 15
    const fa = DIRA[P.dir]
    if (P.state === 'swing') { const k = Math.min(1, P.t / 10); swordAngle = fa - 1.6 + k * 3.0; f = 1 }
    if (P.state === 'charge') { swordAngle = fa; r1 = 14 }
    if (P.state === 'spin') swordAngle = fa + (P.t / 22) * Math.PI * 2
    const behind = swordAngle !== null && Math.sin(swordAngle) < -0.3
    if (behind) drawSword(ox, oy, swordAngle, 4, r1)
    if (G.mode === 'itemget') { lc.drawImage(S.norah.down[0], sx, sy); return }
    lc.drawImage(fr[f], sx, sy)
    if (swordAngle !== null && !behind) drawSword(ox, oy, swordAngle, 4, r1)
    if (P.state === 'charge' && P.charge >= 45 && G.frame % 8 < 4) { const [dx, dy] = DIRV[P.dir]; lc.drawImage(S.fx.sparkle[2], Math.round(P.cx + dx * 14 - 4 + ox), Math.round(P.y - 6 + dy * 14 + oy)) }
    if (P.carry) lc.drawImage(P.carry, sx, sy - 12)
  }
  function drawWorld(ox, oy) {
    drawTiles(ox, oy)
    const list = G.ents.slice().sort((a, b) => a.sortY - b.sortY)
    let drewP = false
    for (const e of list) {
      if (!drewP && e.sortY > P.y + P.h) { drawPlayer(ox, oy); drewP = true }
      e.draw(lc, ox, oy, G)
    }
    if (!drewP) drawPlayer(ox, oy)
  }
  function shadowText(s, x, y, o = {}) { text(s, x, y, { shadow: true, ...o }) }
  function drawHUD() {
    const st = G.st
    lc.fillStyle = '#18122a'; lc.fillRect(0, 0, VW, HUD)
    lc.fillStyle = '#2e2450'; lc.fillRect(0, HUD - 2, VW, 2)
    // hearts
    const n = st.maxHp / 2
    for (let i = 0; i < n; i++) {
      const v = st.hp - i * 2, img = S.heart[v >= 2 ? 2 : v === 1 ? 1 : 0]
      lc.drawImage(img, 8 + (i % 10) * 9, 7 + Math.floor(i / 10) * 9)
    }
    shadowText('LIFE', 8, 4, { size: 5, color: '#ff8aa0' })
    // item box
    lc.fillStyle = '#0c0818'; lc.fillRect(102, 3, 26, 26); lc.strokeStyle = '#f4c542'; lc.lineWidth = 1; lc.strokeRect(102.5, 3.5, 25, 25)
    if (st.equip) {
      lc.drawImage(S.icon[st.equip === 'bombs' ? 'bomb' : st.equip], 107, 8)
      if (st.equip === 'bombs') shadowText(String(st.bombs), 126, 27, { size: 6, align: 'right' })
      if (st.equip === 'bow') shadowText(String(st.arrows), 126, 27, { size: 6, align: 'right' })
    }
    // counters
    lc.drawImage(S.icon.gem, 136, 6); shadowText(String(st.gems).padStart(3, '0'), 144, 27, { size: 7, align: 'center' })
    if (st.items.bombs) { lc.drawImage(S.icon.bomb, 160, 6); shadowText(String(st.bombs), 168, 27, { size: 7, align: 'center' }) }
    if (st.items.bow) { lc.drawImage(S.icon.arrow, 182, 6); shadowText(String(st.arrows), 190, 27, { size: 7, align: 'center' }) }
    if (G.area !== 'overworld') {
      lc.drawImage(S.icon.key, 206, 6); shadowText(String(st.keys[G.area] || 0), 214, 27, { size: 7, align: 'center' })
      if (st.bigkeys[G.area]) lc.drawImage(S.icon.bigkey, 228, 6)
    } else {
      for (let i = 0; i < 3; i++) { if (st.stones[i]) lc.drawImage(S.icon['stone' + i], 204 + i * 16, 8); else { lc.fillStyle = '#2e2450'; lc.fillRect(208 + i * 16, 12, 8, 8) } }
    }
  }
  function drawBossBar() {
    const b = G.boss
    if (!b || b.dead) return
    const info = BOSS_INFO[b.kind]
    lc.fillStyle = '#0c0818'; lc.fillRect(56, HUD + 10, 144, 8)
    lc.fillStyle = '#e03050'; lc.fillRect(58, HUD + 12, Math.max(0, 140 * (b.hp / b.maxHp)), 4)
    shadowText(info.name, 128, HUD + 8, { size: 6, align: 'center', color: '#ffd0d8' })
    if (G.bossIntro > 0) {
      const a = Math.min(1, G.bossIntro / 30)
      lc.fillStyle = `rgba(0,0,0,${0.5 * a})`; lc.fillRect(0, HUD + 70, VW, 44)
      shadowText(info.name, 128, HUD + 92, { size: 16, align: 'center', color: '#ffd23a' })
      shadowText(info.title, 128, HUD + 106, { size: 8, align: 'center' })
    }
  }
  function drawDialog() {
    const d = G.dialog
    if (!d) return
    let page = d.pages[d.i]; if (typeof page === 'string') page = { text: page }
    if (!d.lines) d.lines = wrap(page.text, 222, 8)
    const top = G.mode === 'title' || G.prevMode === 'title' || G.prevMode === 'intro' || P.y > 110 ? HUD + 10 : HUD + PH - 74
    const y0 = G.prevMode === 'intro' ? 150 : top
    lc.fillStyle = '#0c0818'; lc.fillRect(8, y0, 240, 64)
    lc.strokeStyle = '#f4f0ff'; lc.lineWidth = 1; lc.strokeRect(9.5, y0 + 1.5, 237, 61)
    lc.strokeStyle = '#7b4fd6'; lc.strokeRect(11.5, y0 + 3.5, 233, 57)
    let left = d.n
    d.lines.forEach((ln, i) => { if (left <= 0) return; const s = ln.slice(0, left); left -= ln.length; text(s, 17, y0 + 15 + i * 11, { size: 8 }) })
    const total = d.lines.join('').length
    if (d.n >= total) {
      if (page.choice) {
        text(d.sel === 0 ? '▶ YES      NO' : '   YES   ▶ NO', 128, y0 + 58, { size: 8, align: 'center', color: '#ffd23a' })
      } else if (G.frame % 40 < 26) { lc.fillStyle = '#ffd23a'; lc.fillRect(234, y0 + 54, 6, 2); lc.fillRect(235, y0 + 56, 4, 1); lc.fillRect(236, y0 + 57, 2, 1) }
    }
  }
  function drawMenu() {
    const st = G.st
    lc.fillStyle = 'rgba(12,8,24,0.92)'; lc.fillRect(8, HUD + 6, 240, 180)
    lc.strokeStyle = '#f4c542'; lc.strokeRect(8.5, HUD + 6.5, 239, 179)
    shadowText('ITEMS', 24, HUD + 20, { size: 8, color: '#ffd23a' })
    ITEM_ORDER.forEach((k, i) => {
      const x = 24 + i * 32, y = HUD + 26
      lc.fillStyle = '#231a3c'; lc.fillRect(x, y, 26, 26)
      if (st.items[k]) lc.drawImage(S.icon[k === 'bombs' ? 'bomb' : k], x + 5, y + 5)
      if (i === G.menuSel && G.frame % 30 < 22) { lc.strokeStyle = '#ffffff'; lc.strokeRect(x - 1.5, y - 1.5, 29, 29) }
      if (st.equip === k) { lc.strokeStyle = '#f4c542'; lc.strokeRect(x + 0.5, y + 0.5, 25, 25) }
    })
    const sel = ITEM_ORDER[G.menuSel]
    const desc = { boomerang: 'BOOMERANG: stuns monsters, hits switches, grabs gems.', bombs: 'BOMBS: blast cracked walls and rocks.', bow: 'BOW: shoot eye switches and flying foes.' }
    text(st.items[sel] ? desc[sel] : '???', 24, HUD + 66, { size: 6, color: '#d8d0f0' })
    text('A: choose item    ENTER: back to game', 24, HUD + 76, { size: 6, color: '#9a90c0' })
    // sword & songstones
    shadowText('SONGSTONES', 136, HUD + 20, { size: 8, color: '#ffd23a' })
    for (let i = 0; i < 3; i++) { lc.fillStyle = '#231a3c'; lc.fillRect(136 + i * 24, HUD + 26, 20, 20); if (st.stones[i]) lc.drawImage(S.icon['stone' + i], 138 + i * 24, HUD + 28) }
    lc.drawImage(S.icon.heartpiece, 136, HUD + 52); text(`${st.heartPieces % 4} / 4`, 156, HUD + 63, { size: 7 })
    if (st.items.sword) lc.drawImage(S.icon.sword, 196, HUD + 52)
    // map
    shadowText(G.area === 'overworld' ? 'MAP: THE LAND' : 'MAP: ' + W.dungeon(G.area).name.toUpperCase(), 24, HUD + 96, { size: 8, color: '#ffd23a' })
    const rooms = Object.keys(W.areaRooms(G.area)).map((k) => k.split(',').map(Number))
    const minX = Math.min(...rooms.map((r) => r[0])), minY = Math.min(...rooms.map((r) => r[1]))
    for (const [rx, ry] of rooms) {
      const x = 24 + (rx - minX) * 22, y = HUD + 102 + (ry - minY) * 17
      const seen = st.visited[`${G.area}:${rx},${ry}`]
      lc.fillStyle = seen ? '#5a8ae8' : '#2a2244'; lc.fillRect(x, y, 20, 15)
      if (rx === G.sx && ry === G.sy && G.frame % 30 < 20) { lc.fillStyle = '#ff5fa0'; lc.fillRect(x + 7, y + 5, 6, 5) }
      const scr = W.getScreen(G.area, rx, ry)
      if (scr.boss && seen) { lc.fillStyle = st.flags['boss:' + G.area] ? '#5a5a6a' : '#e03050'; lc.fillRect(x + 2, y + 2, 3, 3) }
    }
    text(`Time ${fmtTime(st.time)}`, 236, HUD + 178, { size: 6, align: 'right', color: '#9a90c0' })
  }
  function fmtTime(fr) { const s = Math.floor(fr / 60), m = Math.floor(s / 60), h = Math.floor(m / 60); return (h ? h + ':' + String(m % 60).padStart(2, '0') : m) + ':' + String(s % 60).padStart(2, '0') }
  let titleBg = null
  function drawTitle() {
    if (!titleBg) {
      const scr = W.getScreen('overworld', 1, 2), [c, g] = canvas(PW, VH)
      for (let y = 0; y < 14; y++) for (let x = 0; x < W.COLS; x++) { const ch = (scr.grid[(y + 3) % 12] || '')[x] || '.'; g.drawImage(tileImage(ch, THEMES.meadow, 'meadow', x, y, 0), x * 16, y * 16) }
      titleBg = c
    }
    lc.drawImage(titleBg, 0, 0)
    lc.fillStyle = 'rgba(16,10,40,0.55)'; lc.fillRect(0, 0, VW, VH)
    for (let i = 0; i < 3; i++) { const a = G.frame / 50 + i * 2.094; lc.drawImage(S.icon['stone' + i], 120 + Math.cos(a) * 46, 104 + Math.sin(a) * 14) }
    lc.drawImage(S.norah.down[Math.floor(G.frame / 20) % 2], 120, 98)
    lc.drawImage(S.npc.potato[Math.floor(G.frame / 15) % 2], 140, 104)
    text('SONGSTONE', 128, 44, { size: 26, align: 'center', color: '#ffd23a', shadow: true, outline: '#3a1a5a' })
    text('QUEST', 128, 70, { size: 22, align: 'center', color: '#ff8ac8', shadow: true, outline: '#3a1a5a' })
    text('A Norah Adventure', 128, 84, { size: 8, align: 'center', color: '#fff', shadow: true })
    const opts = G.savedExists ? ['Continue', 'New Game'] : ['New Game']
    if (!G.dialog) opts.forEach((o, i) => text((i === G.titleSel ? '▶ ' : '   ') + o, 104, 150 + i * 14, { size: 9, color: i === G.titleSel ? '#ffd23a' : '#fff', shadow: true }))
    if (G.savedExists && !G.dialog) {
      const s = loadSave()
      if (s) { for (let i = 0; i < s.maxHp / 2; i++) lc.drawImage(S.heart[s.hp - i * 2 >= 2 ? 2 : s.hp - i * 2 === 1 ? 1 : 0], 168 + (i % 10) * 8, 144 + Math.floor(i / 10) * 8); for (let i = 0; i < 3; i++) if (s.stones[i]) lc.drawImage(S.icon['stone' + i], 168 + i * 14, 156) }
    }
    text(input.isTouch ? 'Tap A to start' : 'Arrows to move · Space = A · X = B · Enter = Menu', 128, 206, { size: 6, align: 'center', color: '#d8d0f0', shadow: true })
    text('© Norah & Dave Tashner', 128, 218, { size: 5, align: 'center', color: '#9a90c0' })
  }
  function drawIntroBg() {
    lc.fillStyle = '#0c0818'; lc.fillRect(0, 0, VW, VH)
    for (let i = 0; i < 40; i++) { lc.fillStyle = i % 3 ? '#5a4a8a' : '#fff'; lc.fillRect((i * 97) % 256, (i * 53) % 140, 1, 1) }
    const d = G.dialog ? G.dialog.i : 0
    for (let i = 0; i < 3; i++) {
      const gone = d >= 3
      const x = 92 + i * 28, y = 70 + Math.sin(G.frame / 20 + i) * 3
      if (!gone) lc.drawImage(S.icon['stone' + i], x, y)
    }
    if (d >= 3) { lc.drawImage(S.boss.dark[Math.floor(G.frame / 12) % 2], 104, 48 + Math.sin(G.frame / 15) * 4) }
    if (d >= 5) lc.drawImage(S.norah.down[0], 120, 100)
  }
  function drawEnding() {
    const e = G.ending
    drawWorld(0, HUD)
    lc.fillStyle = '#18122a'; lc.fillRect(0, 0, VW, HUD)
    for (let i = 0; i < 3; i++) lc.drawImage(S.icon['stone' + i], 104 + i * 18, 8)
    // music notes floating
    for (let i = 0; i < 8; i++) { const x = (i * 37 + G.frame * 0.3) % 256, y = HUD + 180 - ((G.frame * 0.6 + i * 40) % 180); text('♪', x, y, { size: 10, color: ['#ffd23a', '#ff8ac8', '#8ad0ff'][i % 3], shadow: true }) }
    if (e.phase === 1) {
      lc.fillStyle = 'rgba(12,8,24,0.85)'; lc.fillRect(0, HUD, VW, PH)
      const lines = [['THE END', 18, '#ffd23a'], ['SONGSTONE QUEST', 10, '#ff8ac8'], ['Starring NORAH', 8], ['and Potato the corgi', 8], ['Nug the frog as himself', 7], ['', 4], ['Made by Norah & Dave Tashner', 8, '#8ad0ff'], ['', 4],
        [`Time: ${fmtTime(G.st.time)}`, 7], [`Hearts: ${G.st.maxHp / 2}   Gems: ${G.st.gems}`, 7], [`Heart pieces: ${G.st.heartPieces} / 8`, 7], ['', 4], ['Thanks for playing!', 9, '#ffd23a']]
      let y = HUD + 200 - Math.min(e.t * 0.6, 178)
      for (const [s, size, col] of lines) { text(s, 128, y, { size, align: 'center', color: col || '#fff', shadow: true }); y += size + 5 }
      if (e.t > 320 && G.frame % 60 < 40) text('Press A', 128, HUD + PH - 6, { size: 7, align: 'center', color: '#fff' })
    }
  }

  G.render = () => {
    lc.fillStyle = '#000'; lc.fillRect(0, 0, VW, VH)
    if (G.mode === 'title' || (G.mode === 'dialog' && G.prevMode === 'title')) { drawTitle(); drawDialog() }
    else if (G.mode === 'intro' || (G.mode === 'dialog' && G.prevMode === 'intro')) { drawIntroBg(); drawDialog() }
    else if (G.mode === 'ending' || (G.mode === 'dialog' && G.prevMode === 'ending')) { drawEnding(); drawDialog() }
    else {
      const sh = G.shakeT > 0 ? [Math.round(Math.random() * 4 - 2), Math.round(Math.random() * 4 - 2)] : [0, 0]
      if (G.mode === 'scroll' && G.scroll) {
        const s = G.scroll, k = s.t / s.n, e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
        const offX = -s.dx * PW * e, offY = -s.dy * PH * e
        lc.save(); lc.beginPath(); lc.rect(0, HUD, PW, PH); lc.clip()
        lc.drawImage(s.old, offX, HUD + offY)
        drawTiles(offX + s.dx * PW, HUD + offY + s.dy * PH)
        const px = s.fromX + (s.toX + s.dx * PW - s.fromX) * e, py = s.fromY + (s.toY + s.dy * PH - s.fromY) * e
        const sx = P.x, sy = P.y; P.x = px + offX; P.y = py + offY; P.walk = G.frame; P.moving = true
        drawPlayer(0, HUD); P.x = sx; P.y = sy
        lc.restore()
      } else {
        lc.save(); lc.beginPath(); lc.rect(0, HUD, PW, PH); lc.clip()
        drawWorld(sh[0], HUD + sh[1])
        if (G.mode === 'itemget' && G.itemget) {
          const ig = G.itemget, key = ig.item === 'heartpiece' ? 'heartpiece' : ig.item === 'bombs' ? 'bomb' : ig.item
          const img = S.icon[key]; if (img) lc.drawImage(img, Math.round(P.cx - 8), Math.round(HUD + P.y - 30 - Math.min(6, ig.t / 4)))
        }
        lc.restore()
      }
      drawHUD()
      drawBossBar()
      if (G.toastT > 0 && G.toastMsg && G.mode !== 'menu') {
        const lines = wrap(G.toastMsg, 220, 7), h = lines.length * 9 + 6
        const y = P.y < 40 ? HUD + PH - h - 22 : HUD + (G.boss && !G.boss.dead ? 22 : 4)
        lc.fillStyle = 'rgba(12,8,24,0.78)'; lc.fillRect(14, y, 228, h)
        lines.forEach((l, i) => text(l, 128, y + 10 + i * 9, { size: 7, align: 'center', color: '#fff6c8' }))
      }
      if (G.mode === 'menu') drawMenu()
      if (G.mode === 'dialog') drawDialog()
      if (G.mode === 'dead') { lc.fillStyle = `rgba(80,0,20,${Math.min(0.5, G.deadT / 120)})`; lc.fillRect(0, HUD, PW, PH); if (G.deadT > 30) shadowText('Oof! Norah needs a rest...', 128, HUD + 80, { size: 9, align: 'center' }) }
    }
    if (G.fade) { const f = G.fade, a = f.t < f.n ? f.t / f.n : 1 - (f.t - f.n) / f.n; lc.fillStyle = f.color; lc.globalAlpha = Math.max(0, Math.min(1, a)); lc.fillRect(0, 0, VW, VH); lc.globalAlpha = 1 }
  }

  G.startNew = startNew
  G.continueGame = continueGame
  return G
}
