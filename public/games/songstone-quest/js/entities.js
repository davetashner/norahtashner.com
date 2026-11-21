// Enemies, bosses, projectiles, pickups and props. Every entity gets update(G) and draw(ctx, ox, oy).
import { TILE } from './gfx.js'

export const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
const rnd = (a, b) => a + Math.random() * (b - a)
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

export class Ent {
  constructor(x, y, w, h) { this.x = x; this.y = y; this.w = w; this.h = h; this.dead = false; this.t = 0; this.solid = false }
  get cx() { return this.x + this.w / 2 }
  get cy() { return this.y + this.h / 2 }
  box() { return { x: this.x, y: this.y, w: this.w, h: this.h } }
  update() { this.t++ }
  draw() {}
  get sortY() { return this.y + this.h }
}

// ------------------------------------------------------------------ effects
export class Fx extends Ent {
  constructor(x, y, frames, speed = 5, big = false) { super(x, y, 0, 0); this.frames = frames; this.speed = speed; this.big = big }
  update() { this.t++; if (this.t >= this.frames.length * this.speed) this.dead = true }
  draw(ctx, ox, oy) { const f = this.frames[Math.min(this.frames.length - 1, Math.floor(this.t / this.speed))]; ctx.drawImage(f, Math.round(this.x - f.width / 2 + ox), Math.round(this.y - f.height / 2 + oy)) }
  get sortY() { return 999 }
}
export class Debris extends Ent {
  // little leaf/shard particles
  constructor(x, y, color) { super(x, y, 2, 2); this.vx = rnd(-1.4, 1.4); this.vy = rnd(-2.2, -0.6); this.color = color; this.life = 26 }
  update() { this.t++; this.x += this.vx; this.y += this.vy; this.vy += 0.15; if (this.t > this.life) this.dead = true }
  draw(ctx, ox, oy) { ctx.fillStyle = this.color; ctx.fillRect(Math.round(this.x + ox), Math.round(this.y + oy), 2, 2) }
  get sortY() { return 998 }
}
export function burst(G, x, y, color, n = 6) { for (let i = 0; i < n; i++) G.spawn(new Debris(x, y, color)) }

// ------------------------------------------------------------------ pickups
const MINOR = new Set(['heart', 'gem', 'gem5', 'bombs', 'arrows'])
export class Pickup extends Ent {
  constructor(x, y, kind, opts = {}) {
    super(x - 6, y - 6, 12, 12); this.kind = kind; this.life = MINOR.has(kind) && !opts.stay ? 480 : Infinity
    this.vy = opts.pop ? -2 : 0; this.z = 0; this.id = opts.id; this.big = !MINOR.has(kind)
  }
  update(G) {
    this.t++
    if (this.vy || this.z < 0) { this.z += this.vy; this.vy += 0.2; if (this.z >= 0) { this.z = 0; this.vy = 0 } }
    if (this.t > this.life) this.dead = true
    if (this.carrier) { this.x = this.carrier.cx - 6; this.y = this.carrier.cy - 6; if (this.carrier.dead) this.carrier = null }
    if (this.t > 8 && overlap(this.box(), G.player.hurtBox())) { this.dead = true; G.collect(this) }
  }
  draw(ctx, ox, oy, G) {
    if (this.life - this.t < 120 && Math.floor(this.t / 4) % 2) return
    const S = G.S
    const img = this.kind === 'heart' ? S.heart[2] : this.kind === 'gem' ? S.icon.gem : this.kind === 'gem5' ? S.icon.gem5 : this.kind === 'bombs' ? S.icon.bomb : this.kind === 'arrows' ? S.icon.arrow : this.kind === 'hp' ? S.icon.heartpiece : this.kind === 'container' ? S.icon.container : S.icon[this.kind]
    if (!img) return
    const bob = this.big ? Math.round(Math.sin(this.t / 10) * 1.5) : 0
    ctx.drawImage(S.fx.shadow, Math.round(this.x + ox), Math.round(this.y + 9 + oy))
    ctx.drawImage(img, Math.round(this.cx - img.width / 2 + ox), Math.round(this.cy - img.height / 2 + this.z + bob - 2 + oy))
    if (this.big && this.t % 30 < 10) { const sp = S.fx.sparkle[Math.floor(this.t / 4) % 3]; ctx.drawImage(sp, Math.round(this.x + 8 + ox), Math.round(this.y - 6 + oy)) }
  }
}

// ------------------------------------------------------------------ props
export class Chest extends Ent {
  constructor(tx, ty, item, flag, open, hidden) { super(tx * TILE, ty * TILE, TILE, TILE); this.item = item; this.flag = flag; this.open = open; this.solid = !hidden; this.hidden = hidden }
  reveal(G) { if (!this.hidden) return; this.hidden = false; this.solid = true; G.sfx('secret'); G.spawn(new Fx(this.cx, this.cy, G.S.fx.puff, 5)) }
  draw(ctx, ox, oy, G) { if (!this.hidden) ctx.drawImage(G.S.chest[this.open ? 1 : 0], this.x + ox, this.y + oy) }
}
export class Npc extends Ent {
  constructor(tx, ty, kind, talk) { super(tx * TILE, ty * TILE, TILE, TILE); this.kind = kind; this.talk = talk; this.solid = true }
  draw(ctx, ox, oy, G) {
    const fr = G.S.npc[this.kind]; const f = fr[Math.floor((this.t + this.x) / 40) % 2]
    ctx.drawImage(f, this.x + ox, this.y + oy - 2)
  }
}
export class ShopItem extends Ent {
  constructor(tx, ty, item, price, need, once) { super(tx * TILE, ty * TILE, TILE, TILE); this.item = item; this.price = price; this.need = need; this.once = once; this.solid = true }
  available(G) { return (!this.need || G.st.items[this.need]) && (!this.once || !G.st.flags[this.once]) }
  draw(ctx, ox, oy, G) {
    if (!this.available(G)) return
    const S = G.S
    const img = { heart: S.heart[2], bombs: S.icon.bomb, arrows: S.icon.arrow, heartpiece: S.icon.heartpiece }[this.item]
    ctx.drawImage(img, Math.round(this.cx - img.width / 2 + ox), Math.round(this.y + 1 + oy - (img.height < 16 ? -2 : 0)))
    if (G.mode !== 'menu') G.text(String(this.price), this.cx + ox, this.y + 15 + oy, { size: 6, align: 'center', color: '#fff', shadow: true })
  }
}
export class Block extends Ent {
  constructor(tx, ty, theme) { super(tx * TILE, ty * TILE, TILE, TILE); this.theme = theme; this.solid = true; this.push = 0; this.moving = null }
  tryPush(G, dx, dy) {
    if (this.moving) return
    this.push++
    if (this.push < 18) return
    this.push = 0
    const tx = Math.round(this.x / TILE) + dx, ty = Math.round(this.y / TILE) + dy
    const ch = G.tileAt(tx, ty)
    if (!'.o_i'.includes(ch)) return
    if (G.ents.some((e) => e !== this && e.solid && overlap(e.box(), { x: tx * TILE + 1, y: ty * TILE + 1, w: 14, h: 14 }))) return
    this.moving = { dx, dy, n: 16 }
    G.sfx('push')
  }
  update(G) {
    this.t++
    if (this.moving) { this.x += this.moving.dx; this.y += this.moving.dy; if (--this.moving.n <= 0) { this.moving = null; G.checkPlates() } }
  }
  draw(ctx, ox, oy, G) { ctx.drawImage(G.S.block[this.theme] || G.S.block.leafy, this.x + ox, this.y + oy) }
}
export class Crystal extends Ent {
  // crystal switch on a pedestal (tile 'w'), hit by sword, boomerang or arrows
  constructor(tx, ty, on) { super(tx * TILE + 2, ty * TILE, 12, 14); this.on = on; this.solid = true; this.cool = 0 }
  hit(G) { if (this.cool > 0) return; this.cool = 30; this.on = !this.on; G.sfx('switch'); G.switchHit() }
  update() { this.t++; if (this.cool > 0) this.cool-- }
  draw(ctx, ox, oy, G) { ctx.drawImage(G.S.crystal[this.on ? 1 : 0], this.x + 1 + ox, this.y - 2 + Math.round(Math.sin(this.t / 15)) + oy) }
}
export class Thrown extends Ent {
  // a pot or bush thrown by Norah
  constructor(x, y, dx, dy, img) { super(x, y, 12, 12); this.dx = dx; this.dy = dy; this.img = img; this.z = -12; this.dist = 0 }
  update(G) {
    this.t++
    this.x += this.dx * 3; this.y += this.dy * 3; this.dist += 3; this.z = -12 + (this.dist / 64) * 12
    let hit = this.dist > 64 || !G.free(this.x + 2, this.y + 2, 8, 8, 'fly')
    for (const e of G.ents) if (e.isEnemy && !e.dead && overlap(this.box(), e.box())) { e.hurt(G, 2, this.cx, this.cy, 'thrown'); hit = true }
    if (hit) { this.dead = true; G.sfx('shatter'); burst(G, this.cx, this.cy, this.img === G.S.pot ? '#b8683a' : '#3aa040', 8); if (this.img === G.S.pot) G.drop(this.cx, this.cy, 0.6) }
  }
  draw(ctx, ox, oy, G) { ctx.drawImage(G.S.fx.shadow, Math.round(this.x + ox), Math.round(this.y + 10 + oy)); ctx.drawImage(this.img, Math.round(this.x - 2 + ox), Math.round(this.y - 2 + this.z + oy)) }
}

// ------------------------------------------------------------------ Norah's weapons
export class Boomerang extends Ent {
  constructor(G, dx, dy) {
    const p = G.player
    super(p.cx - 5, p.cy - 5, 10, 10); this.dx = dx; this.dy = dy; this.out = true; this.dist = 0; this.max = 100; this.carried = []
    G.sfx('boomerang')
  }
  update(G) {
    this.t++
    if (this.t % 8 === 0) G.sfx('boomerang')
    const sp = 3.2
    if (this.out) {
      const l = Math.hypot(this.dx, this.dy) || 1
      this.x += (this.dx / l) * sp; this.y += (this.dy / l) * sp; this.dist += sp
      if (this.dist >= this.max) this.out = false
      if (!G.free(this.x + 1, this.y + 1, 8, 8, 'fly')) { this.out = false; G.sfx('tink'); G.hitTiles(this.box(), 'boomerang') }
    } else {
      const p = G.player, ddx = p.cx - this.cx, ddy = p.cy - this.cy, l = Math.hypot(ddx, ddy)
      if (l < 6) { this.dead = true; for (const c of this.carried) if (!c.dead) { c.dead = true; G.collect(c) } return }
      this.x += (ddx / l) * sp; this.y += (ddy / l) * sp
    }
    G.hitTiles(this.box(), 'boomerang', true)
    for (const e of G.ents) {
      if (e.isEnemy && !e.dead && overlap(this.box(), e.box())) { e.stun(G, 150); this.out = false }
      if (e instanceof Crystal && overlap(this.box(), e.box())) { e.hit(G); this.out = false }
      if (e instanceof Pickup && !e.dead && !e.carrier && overlap(this.box(), e.box())) { e.carrier = this; this.carried.push(e); this.out = false }
    }
  }
  draw(ctx, ox, oy, G) {
    const img = G.S.icon.boomerang
    ctx.save(); ctx.translate(Math.round(this.cx + ox), Math.round(this.cy + oy)); ctx.rotate(Math.floor(this.t / 3) * Math.PI / 2); ctx.drawImage(img, -8, -8); ctx.restore()
  }
  get sortY() { return 997 }
}
export class Arrow extends Ent {
  constructor(G, dir) {
    const p = G.player, [dx, dy] = dir
    super(p.cx - 3 + dx * 8, p.cy - 3 + dy * 8, 6, 6); this.dx = dx; this.dy = dy; this.stuck = 0
    G.sfx('arrow')
  }
  update(G) {
    this.t++
    if (this.stuck) { if (++this.stuck > 20) this.dead = true; return }
    for (let i = 0; i < 2; i++) {
      this.x += this.dx * 2.5; this.y += this.dy * 2.5
      if (this.x < -8 || this.y < -8 || this.x > 264 || this.y > 200) { this.dead = true; return }
      if (!G.free(this.x, this.y, 6, 6, 'fly')) { G.hitTiles({ x: this.x + this.dx * 4, y: this.y + this.dy * 4, w: 6, h: 6 }, 'arrow'); this.stuck = 1; G.sfx('tink'); return }
      for (const e of G.ents) {
        if (e.isEnemy && !e.dead && overlap(this.box(), e.box())) { e.hurt(G, 2, this.cx - this.dx * 10, this.cy - this.dy * 10, 'arrow'); this.dead = true; return }
        if (e instanceof Crystal && overlap(this.box(), e.box())) { e.hit(G); this.dead = true; return }
      }
    }
  }
  draw(ctx, ox, oy, G) {
    const img = G.S.icon.arrow
    ctx.save(); ctx.translate(Math.round(this.cx + ox), Math.round(this.cy + oy)); ctx.rotate(Math.atan2(this.dy, this.dx)); ctx.drawImage(img, -8, -8); ctx.restore()
  }
  get sortY() { return 997 }
}
export class Bomb extends Ent {
  constructor(x, y) { super(x - 6, y - 6, 12, 12); this.fuse = 96 }
  update(G) {
    this.t++
    if (this.t % 12 === 0) G.sfx('fuse')
    if (this.t >= this.fuse) { this.dead = true; G.spawn(new Explosion(this.cx, this.cy)) }
  }
  draw(ctx, ox, oy, G) {
    const img = this.t > this.fuse - 30 && Math.floor(this.t / 3) % 2 ? G.S.enemy.blob_hit[0] && G.S.icon.bomb : G.S.icon.bomb
    ctx.drawImage(G.S.fx.shadow, Math.round(this.x + ox), Math.round(this.y + 9 + oy))
    if (this.t > this.fuse - 30 && Math.floor(this.t / 3) % 2) { ctx.globalAlpha = 0.6 }
    ctx.drawImage(img, Math.round(this.x - 2 + ox), Math.round(this.y - 4 + oy))
    ctx.globalAlpha = 1
  }
}
export class Explosion extends Ent {
  constructor(cx, cy) { super(cx - 20, cy - 20, 40, 40); this.done = new Set() }
  update(G) {
    if (this.t === 0) { G.sfx('bomb'); G.shake(10); G.hitTiles({ x: this.x + 4, y: this.y + 4, w: 32, h: 32 }, 'bomb') }
    this.t++
    if (this.t < 14) {
      const b = { x: this.x + 6, y: this.y + 6, w: 28, h: 28 }
      for (const e of G.ents) if (e.isEnemy && !e.dead && !this.done.has(e) && overlap(b, e.box())) { this.done.add(e); e.hurt(G, 4, this.cx, this.cy, 'bomb') }
      if (!this.done.has('p') && overlap(b, G.player.hurtBox())) { this.done.add('p'); G.hurtPlayer(1, this.cx, this.cy) }
    }
    if (this.t >= 25) this.dead = true
  }
  draw(ctx, ox, oy, G) { const f = G.S.fx.boom[Math.min(4, Math.floor(this.t / 5))]; ctx.drawImage(f, Math.round(this.x + ox), Math.round(this.y + oy)) }
  get sortY() { return 996 }
}

// ------------------------------------------------------------------ enemy shots
export class Shot extends Ent {
  constructor(x, y, vx, vy, kind, dmg = 1) { super(x - 3, y - 3, 6, 6); this.vx = vx; this.vy = vy; this.kind = kind; this.dmg = dmg; this.reflected = false }
  update(G) {
    this.t++
    this.x += this.vx; this.y += this.vy
    if (this.kind === 'icicle') { if (this.t > this.fall) { this.dead = true; G.sfx('shatter'); burst(G, this.cx, this.cy, '#cfefff', 6) } }
    else if (this.x < -10 || this.y < -10 || this.x > 266 || this.y > 202 || (this.kind !== 'orb' && !G.free(this.x, this.y, 6, 6, 'fly'))) { this.dead = true; return }
    if (this.reflected) {
      for (const e of G.ents) if (e.isEnemy && e.isBoss && !e.dead && overlap(this.box(), e.box())) { e.hurt(G, 2, this.cx, this.cy, 'orb'); this.dead = true }
      return
    }
    const p = G.player
    if ((this.kind !== 'icicle' || this.t > this.fall - 6) && overlap(this.box(), p.hurtBox())) {
      if (this.kind === 'orb' && p.swordBox() && overlap(this.box(), p.swordBox())) return this.reflect(G)
      this.dead = true; G.hurtPlayer(this.dmg, this.cx - this.vx * 4, this.cy - this.vy * 4)
    }
    if (this.kind === 'orb') { const sb = p.swordBox(); if (sb && overlap(this.box(), sb)) this.reflect(G) }
  }
  reflect(G) {
    if (this.reflected) return
    const boss = G.ents.find((e) => e.isBoss && !e.dead)
    this.reflected = true; G.sfx('tink')
    if (boss) { const dx = boss.cx - this.cx, dy = boss.cy - this.cy, l = Math.hypot(dx, dy) || 1; this.vx = (dx / l) * 3.2; this.vy = (dy / l) * 3.2 } else { this.vx *= -1.5; this.vy *= -1.5 }
  }
  draw(ctx, ox, oy, G) {
    const fx = G.S.fx
    if (this.kind === 'orb') ctx.drawImage(fx.orb[Math.floor(this.t / 4) % 2], Math.round(this.x - 2 + ox), Math.round(this.y - 2 + oy))
    else if (this.kind === 'icicle') {
      const k = clamp(this.t / this.fall, 0, 1)
      ctx.drawImage(fx.shadow, Math.round(this.x - 3 + ox), Math.round(this.y + 4 + oy))
      ctx.drawImage(fx.icicle, Math.round(this.x - 1 + ox), Math.round(this.y - 10 - (1 - k) * 90 + oy))
    } else if (this.kind === 'snow') { ctx.fillStyle = '#fff'; ctx.fillRect(Math.round(this.x + 1 + ox), Math.round(this.y + oy), 4, 6); ctx.fillRect(Math.round(this.x + ox), Math.round(this.y + 1 + oy), 6, 4) }
    else ctx.drawImage(fx.rockShot, Math.round(this.x - 1 + ox), Math.round(this.y - 1 + oy))
  }
  get sortY() { return 995 }
}

// ------------------------------------------------------------------ enemies
const STATS = {
  blob: { hp: 2, dmg: 1, speed: 0.5 },
  buzzbee: { hp: 2, dmg: 1, speed: 0.7, fly: true },
  thornback: { hp: 4, dmg: 2, speed: 0.45 },
  crab: { hp: 3, dmg: 1, speed: 0.6 },
  bat: { hp: 1, dmg: 1, speed: 1.2, fly: true },
  snowman: { hp: 3, dmg: 1, speed: 0.35 },
  wisp: { hp: 3, dmg: 2, speed: 0.45, ghost: true },
}
export class Enemy extends Ent {
  constructor(tx, ty, kind) {
    super(tx * TILE + 2, ty * TILE + 2, 12, 12)
    this.kind = kind; Object.assign(this, { ...STATS[kind] }); this.maxHp = this.hp
    this.isEnemy = true; this.flash = 0; this.stunT = 0; this.kb = null; this.state = 'idle'; this.timer = rnd(20, 70); this.dx = 0; this.dy = 0; this.inv = 0
    this.mode = this.ghost ? 'ghost' : this.fly ? 'fly' : 'enemy'
    if (kind === 'bat') this.state = 'sleep'
  }
  hurt(G, dmg, fx, fy, src) {
    if (this.inv > 0 || this.dead) return
    if (this.kind === 'wisp' && src === 'boomerang') return
    this.hp -= dmg; this.flash = 12; this.inv = 14
    const dx = this.cx - fx, dy = this.cy - fy, l = Math.hypot(dx, dy) || 1
    this.kb = { vx: (dx / l) * 3, vy: (dy / l) * 3, n: 8 }
    G.sfx('hit'); G.hitStop(3)
    if (this.hp <= 0) this.die(G)
  }
  stun(G, n) { if (this.kind === 'wisp') return; this.stunT = n; this.flash = 6; G.sfx('tink'); if (this.hp <= 1 && this.kind === 'bat') this.hurt(G, 1, G.player.cx, G.player.cy, 'boomerang') }
  die(G) {
    this.dead = true; G.sfx('kill')
    G.spawn(new Fx(this.cx, this.cy, G.S.fx.puff, 5))
    G.drop(this.cx, this.cy, 0.65)
    G.onEnemyKilled(this)
  }
  move(G, vx, vy) {
    let moved = true
    if (vx && G.free(this.x + vx, this.y, this.w, this.h, this.mode)) this.x += vx; else if (vx) moved = false
    if (vy && G.free(this.x, this.y + vy, this.w, this.h, this.mode)) this.y += vy; else if (vy) moved = false
    this.x = clamp(this.x, 0, 256 - this.w); this.y = clamp(this.y, 0, 192 - this.h)
    return moved
  }
  update(G) {
    this.t++
    if (this.flash > 0) this.flash--
    if (this.inv > 0) this.inv--
    if (this.kb) { this.move(G, this.kb.vx, this.kb.vy); if (--this.kb.n <= 0) this.kb = null; return this.touch(G) }
    if (this.stunT > 0) { this.stunT--; return }
    const p = G.player, pdx = p.cx - this.cx, pdy = p.cy - this.cy, dist = Math.hypot(pdx, pdy)
    const AI = this[this.kind]
    if (AI) AI.call(this, G, p, pdx, pdy, dist)
    this.touch(G)
  }
  touch(G) { if (this.stunT <= 0 && overlap(this.box(), G.player.hurtBox())) G.hurtPlayer(this.dmg, this.cx, this.cy) }
  wander(G, sp) {
    if (--this.timer <= 0) { const d = DIRS[Math.floor(Math.random() * 4)]; this.dx = d[0]; this.dy = d[1]; this.timer = rnd(30, 90); if (Math.random() < 0.3) { this.dx = this.dy = 0 } }
    if (!this.move(G, this.dx * sp, this.dy * sp)) this.timer = 0
  }
  blob(G) {
    if (this.state === 'idle') { if (--this.timer <= 0) { this.state = 'hop'; this.timer = 30; const d = DIRS[Math.floor(Math.random() * 4)]; this.dx = d[0]; this.dy = d[1] } }
    else { this.move(G, this.dx * this.speed, this.dy * this.speed); if (--this.timer <= 0) { this.state = 'idle'; this.timer = rnd(30, 80) } }
  }
  buzzbee(G, p, dx, dy, dist) {
    if (dist < 110) { const a = Math.atan2(dy, dx) + Math.sin(this.t / 14) * 1.1; this.move(G, Math.cos(a) * this.speed, Math.sin(a) * this.speed) } else this.wander(G, this.speed)
  }
  thornback(G, p, dx, dy) {
    if (this.state === 'charge') { if (!this.move(G, this.dx * 2.2, this.dy * 2.2)) { this.state = 'idle'; this.timer = 50; G.sfx('tink') } return }
    if (this.state === 'tell') { this.x += (this.t % 4 < 2 ? 0.5 : -0.5); if (--this.timer <= 0) this.state = 'charge'; return }
    if (Math.abs(dx) < 8 && Math.abs(dy) < 90) { this.state = 'tell'; this.timer = 22; this.dx = 0; this.dy = Math.sign(dy) }
    else if (Math.abs(dy) < 8 && Math.abs(dx) < 90) { this.state = 'tell'; this.timer = 22; this.dy = 0; this.dx = Math.sign(dx) }
    else this.wander(G, this.speed)
  }
  crab(G, p, dx, dy) {
    if (this.state === 'tell') { if (--this.timer <= 0) { this.state = 'idle'; this.timer = rnd(90, 150); const l = Math.hypot(dx, dy) || 1; G.spawn(new Shot(this.cx, this.cy, (dx / l) * 1.6, (dy / l) * 1.6, 'rock')) } return }
    if (--this.timer <= 0) { this.state = 'tell'; this.timer = 18; return }
    if (this.t % 70 === 0) this.dx = Math.random() < 0.5 ? -1 : 1
    if (!this.dx) this.dx = 1
    if (!this.move(G, this.dx * this.speed, 0)) this.dx *= -1
  }
  bat(G, p, dx, dy, dist) {
    if (this.state === 'sleep') { if (dist < 60) { this.state = 'fly'; this.timer = 100 } return }
    if (this.state === 'rest') { if (--this.timer <= 0) { this.state = 'fly'; this.timer = 100 } return }
    const a = Math.atan2(dy, dx) + Math.sin(this.t / 6) * 1.2
    this.move(G, Math.cos(a) * this.speed, Math.sin(a) * this.speed)
    if (--this.timer <= 0) { this.state = 'rest'; this.timer = 50 }
  }
  snowman(G, p, dx, dy, dist) {
    if (dist > 24) { const l = dist || 1; this.move(G, (dx / l) * this.speed, (dy / l) * this.speed) }
    if (this.t % 160 === 120) { const l = dist || 1; G.spawn(new Shot(this.cx, this.cy, (dx / l) * 1.5, (dy / l) * 1.5, 'snow')) }
  }
  wisp(G, p, dx, dy, dist) {
    const l = dist || 1, a = Math.sin(this.t / 20) * 0.6
    this.move(G, (dx / l) * this.speed + Math.cos(this.t / 15) * a, (dy / l) * this.speed + Math.sin(this.t / 17) * a)
  }
  draw(ctx, ox, oy, G) {
    const fr = G.S.enemy[this.kind + (this.flash > 0 && this.flash % 4 < 2 ? '_hit' : '')]
    let f = Math.floor(this.t / 12) % 2
    if (this.kind === 'bat' && (this.state === 'sleep' || this.state === 'rest')) f = 1
    if (this.kind === 'thornback' && this.state === 'charge') f = Math.floor(this.t / 3) % 2
    if (this.stunT > 0) f = 0
    const fly = this.fly || this.ghost
    if (fly) ctx.drawImage(G.S.fx.shadow, Math.round(this.x + ox), Math.round(this.y + 11 + oy))
    if (this.ghost) ctx.globalAlpha = 0.85
    ctx.drawImage(fr[f], Math.round(this.x - 2 + ox), Math.round(this.y - 3 - (fly ? 4 + Math.sin(this.t / 8) * 2 : 0) + oy))
    ctx.globalAlpha = 1
    if (this.stunT > 0 && Math.floor(this.t / 6) % 2) { const sp = G.S.fx.sparkle[1]; ctx.drawImage(sp, Math.round(this.x + 2 + ox), Math.round(this.y - 8 + oy)); ctx.drawImage(sp, Math.round(this.x + 8 + ox), Math.round(this.y - 6 + oy)) }
    if (this.state === 'tell' && this.kind === 'crab' && this.t % 6 < 3) { ctx.fillStyle = '#fff'; ctx.fillRect(Math.round(this.cx + ox) - 1, Math.round(this.y - 6 + oy), 2, 3) }
  }
}

// ------------------------------------------------------------------ bosses
export const BOSS_INFO = {
  mole: { name: 'MOSSMAW', title: 'the Mushroom Mole', tip: 'Stun it with the Boomerang, then use your sword!' },
  crab: { name: 'GRANITE GRUB', title: 'the Rock Crab', tip: 'Crack its shell with a Bomb!' },
  owl: { name: 'SHIVERWING', title: 'the Ice Owl', tip: 'Shoot it down with arrows!' },
  dark: { name: 'GRUMBLEWICK', title: 'the Shadow Owl', tip: 'Hit his shadow orbs back with your sword!' },
}
export class Boss extends Enemy {
  constructor(kind) {
    super(7, 4, 'blob')
    this.kind = kind; this.isBoss = true; this.fly = false; this.mode = 'enemy'
    const cfg = { mole: [34, 24, 10], crab: [40, 26, 8], owl: [34, 26, 8], dark: [34, 26, 12] }[kind]
    this.w = cfg[0]; this.h = cfg[1]; this.hp = this.maxHp = cfg[2]
    this.x = 128 - this.w / 2; this.y = 50; this.dmg = 2; this.state = 'intro'; this.timer = 60; this.phase = 1
    if (kind === 'crab') { this.shell = 2 }
    if (kind === 'owl' || kind === 'dark') { this.mode = 'ghost'; this.alt = 0 }
  }
  get sortY() { return this.y + this.h + (this.alt ? 40 : 0) }
  touch(G) {
    if (this.state === 'under' || this.state === 'dead' || this.state === 'intro') return
    if (this.alt > 10) return
    if (overlap(this.box(), G.player.hurtBox())) G.hurtPlayer(this.dmg, this.cx, this.cy)
  }
  stun(G, n) {
    if (this.kind === 'mole' && this.state === 'up') { this.stunT = n; this.state = 'stunned'; G.sfx('tink') }
    else if (this.kind === 'dark' && this.phase === 2 && this.state === 'hover') { this.stunT = 90; G.sfx('tink') }
    else G.sfx('tink')
  }
  hurt(G, dmg, fx, fy, src) {
    if (this.inv > 0 || this.dead || this.state === 'intro') return
    const k = this.kind
    if (k === 'mole') { if (this.state !== 'stunned') { if (src === 'sword' || src === 'spin') G.sfx('tink'); return } dmg = src === 'spin' ? 2 : 1 }
    if (k === 'crab') {
      if (this.shell > 0) { if (src === 'bomb') { this.shell--; this.flash = 20; this.inv = 30; G.sfx('hit'); G.shake(8); if (!this.shell) G.sfx('secret') } else G.sfx('tink'); return }
      dmg = src === 'bomb' ? 2 : src === 'spin' ? 2 : 1
    }
    if (k === 'owl') {
      if (this.alt > 10 && src !== 'arrow') { return }
      if (src === 'arrow') { this.state = 'down'; this.timer = 140; this.alt = 0 }
      dmg = src === 'spin' ? 2 : 1
    }
    if (k === 'dark') {
      if (src === 'orb') { dmg = 1; this.state = 'reel'; this.timer = 50 }
      else if (this.phase === 2 && (src === 'arrow' || src === 'bomb' || this.stunT > 0)) dmg = src === 'bomb' ? 2 : 1
      else { G.sfx('tink'); return }
    }
    this.hp -= dmg; this.flash = 20; this.inv = 30; G.sfx('hit'); G.hitStop(4); G.shake(4)
    if (k === 'dark' && this.phase === 1 && this.hp <= 6) { this.phase = 2; this.state = 'hover'; this.timer = 60; G.sfx('boss'); G.toast('Grumblewick is angry! Use arrows!') }
    if (this.hp <= 0) { this.state = 'dead'; this.timer = 100; G.sfx('boss') }
  }
  update(G) {
    this.t++
    if (this.flash > 0) this.flash--
    if (this.inv > 0) this.inv--
    const p = G.player, dx = p.cx - this.cx, dy = p.cy - this.cy, dist = Math.hypot(dx, dy) || 1
    if (this.state === 'intro') { if (--this.timer <= 0) { this.state = this.kind === 'mole' ? 'under' : 'walk'; this.timer = 100 } return }
    if (this.state === 'dead') {
      if (this.t % 6 === 0) { G.spawn(new Fx(this.x + rnd(0, this.w), this.y + rnd(0, this.h), G.S.fx.boom, 3)); G.sfx('kill') }
      if (--this.timer <= 0) { this.dead = true; G.bossDefeated(this) }
      return
    }
    if (this.stunT > 0) { this.stunT--; if (this.stunT <= 0 && this.state === 'stunned') { this.state = 'under'; this.timer = 120 } }
    this[this.kind + 'AI'](G, p, dx, dy, dist)
    this.touch(G)
  }
  moleAI(G, p, dx, dy, dist) {
    if (this.state === 'under') { this.move(G, (dx / dist) * 0.9, (dy / dist) * 0.9); if (--this.timer <= 0) { this.state = 'up'; this.timer = 110; G.sfx('door'); G.shake(4); burst(G, this.cx, this.cy + 8, '#7a5230', 10) } }
    else if (this.state === 'up') {
      if (this.timer === 70 || this.timer === 40) for (let i = -1; i <= 1; i++) { const a = Math.atan2(dy, dx) + i * 0.4; G.spawn(new Shot(this.cx, this.cy, Math.cos(a) * 1.5, Math.sin(a) * 1.5, 'rock')) }
      if (--this.timer <= 0) { this.state = 'under'; this.timer = 130 }
    }
  }
  crabAI(G, p, dx, dy, dist) {
    const sp = this.shell > 0 ? 0.6 : 1.0
    if (this.state === 'walk') {
      if (!this.dx) this.dx = 1
      if (!this.move(G, this.dx * sp, Math.sign(dy) * 0.25)) this.dx *= -1
      if (--this.timer <= 0) { this.state = Math.random() < 0.5 ? 'charge' : 'throw'; this.timer = this.state === 'charge' ? 70 : 40; this.cdx = dx / dist; this.cdy = dy / dist }
    } else if (this.state === 'charge') {
      if (this.timer > 50) { this.x += this.t % 4 < 2 ? 1 : -1 } else if (!this.move(G, this.cdx * 2.2, this.cdy * 2.2)) { this.timer = 0; G.shake(5); G.sfx('door') }
      if (--this.timer <= 0) { this.state = 'walk'; this.timer = rnd(80, 140) }
    } else if (this.state === 'throw') {
      if (this.timer === 20) for (let i = -2; i <= 2; i++) { const a = Math.atan2(dy, dx) + i * 0.35; G.spawn(new Shot(this.cx, this.cy, Math.cos(a) * 1.6, Math.sin(a) * 1.6, 'rock')) }
      if (--this.timer <= 0) { this.state = 'walk'; this.timer = rnd(80, 140) }
    }
  }
  owlAI(G, p, dx) {
    if (this.state === 'down') { this.alt = 0; if (--this.timer <= 0) { this.state = 'walk'; this.timer = 100 } return }
    this.alt = Math.min(24, (this.alt || 0) + 1)
    const tx = 128 + Math.sin(this.t / 60) * 80, ty = 40 + Math.sin(this.t / 30) * 16
    this.x += (tx - this.cx) * 0.03; this.y += (ty - this.cy) * 0.03
    if (this.t % (this.hp < 4 ? 45 : 70) === 0) { const s = new Shot(p.cx + rnd(-10, 10), p.cy + rnd(-6, 6), 0, 0, 'icicle', 2); s.fall = 50; G.spawn(s) }
    void dx
  }
  darkAI(G, p, dx, dy, dist) {
    if (this.state === 'reel') { if (--this.timer <= 0) { this.state = 'walk'; this.timer = 60 } return }
    if (this.phase === 1) {
      this.alt = 6
      if (this.state === 'walk') {
        this.x += Math.sin(this.t / 30) * 1.2
        this.x = clamp(this.x, 20, 236 - this.w)
        if (--this.timer <= 0) { this.state = 'cast'; this.timer = 40 }
      } else if (this.state === 'cast') {
        if (this.timer === 10) { G.spawn(new Shot(this.cx, this.cy + 6, (dx / dist) * 1.4, (dy / dist) * 1.4, 'orb', 2)); G.sfx('boss') }
        if (--this.timer <= 0) { this.state = 'warp'; this.timer = 30 }
      } else if (this.state === 'warp') {
        if (this.timer === 15) { this.x = rnd(30, 226 - this.w); this.y = rnd(24, 70) }
        if (--this.timer <= 0) { this.state = 'walk'; this.timer = rnd(70, 110) }
      }
    } else {
      if (this.stunT > 0) { this.alt = 0; return }
      this.alt = 14
      const tx = 128 + Math.cos(this.t / 50) * 85, ty = 50 + Math.sin(this.t / 25) * 20
      this.x += (tx - this.cx) * 0.04; this.y += (ty - this.cy) * 0.04
      if (this.t % 80 === 0) { for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + this.t; G.spawn(new Shot(this.cx, this.cy, Math.cos(a) * 1.3, Math.sin(a) * 1.3, 'orb', 1)) } G.sfx('boss') }
      if (this.t % 300 === 150 && G.ents.filter((e) => e.kind === 'wisp' && !e.dead).length < 2) G.spawn(new Enemy(Math.round(this.cx / 16), Math.round(this.cy / 16) + 2, 'wisp'))
    }
  }
  draw(ctx, ox, oy, G) {
    const S = G.S.boss, f = Math.floor(this.t / 10) % 2
    const hit = this.flash > 0 && this.flash % 4 < 2
    let img
    if (this.kind === 'mole') img = this.state === 'under' || this.state === 'intro' ? S.moleUnder : (hit ? S.mole_hit : S.mole)[f]
    else if (this.kind === 'crab') img = this.shell > 0 ? (hit ? S.crab_hit[f] : S.crab[f]) : hit ? S.crabHurt : S.crabCracked[f]
    else img = (hit ? S[this.kind + '_hit'] : S[this.kind])[this.alt > 2 ? f : 0]
    if (this.state === 'dead' && this.t % 4 < 2) return
    if (this.kind === 'dark' && this.state === 'warp' && this.t % 4 < 2) return
    const alt = this.alt || 0
    if (alt) ctx.drawImage(G.S.fx.shadow, Math.round(this.cx - 6 + ox), Math.round(this.y + this.h - 2 + oy))
    ctx.drawImage(img, Math.round(this.cx - img.width / 2 + ox), Math.round(this.y + this.h - img.height + 4 - alt + oy))
    if (this.stunT > 0 && Math.floor(this.t / 6) % 2) { const sp = G.S.fx.sparkle[2]; ctx.drawImage(sp, Math.round(this.cx - 10 + ox), Math.round(this.y - 10 - alt + oy)); ctx.drawImage(sp, Math.round(this.cx + 4 + ox), Math.round(this.y - 12 - alt + oy)) }
  }
}
