// Level 3: Sharks & Minnows. You are the shark; the kids are the minnows trying to cross the pool.
// Tag a minnow and it joins your team as a baby shark. Tag them all (or as many as you can) in four rounds.
import { A, img, drawFrame } from './assets.js'
import { sfx } from './audio.js'
import { updateFx, drawFx, burst, floatText, hearts, confetti, clearFx } from './fx.js'
import { roundRect } from './fishing.js'
import { clamp, lerp, rand } from './util.js'

const VIEW_W = 1280, VIEW_H = 720
const FONT = '"Trebuchet MS", system-ui, sans-serif'
const ROUNDS = 4
const KIDS = 8
const SAFE_W = 92          // end zones inside the water
const TAG_R = 48
const ROUND_TIME = 24

export function createPool(host) {
  const W = () => A.pool
  const S = {
    done: false, result: null,
    start() {
      clearFx()
      const w = W()
      S.shark = { x: (w.x0 + w.x1) / 2, y: (w.y0 + w.y1) / 2, vx: 0, vy: 0, dir: 1, anim: 0, dash: 0, cool: 0, tagT: 0 }
      S.minnows = []
      for (let i = 0; i < KIDS; i++) S.minnows.push({ id: i, kid: i % 6, x: 0, y: 0, vx: 0, vy: 0, state: 'wait', side: 'L', go: 0, tx: 0, ty: 0, anim: rand(0, 6), dir: 1, flip: 0, speed: rand(150, 205), helper: false })
      S.round = 0; S.t = 0; S.phase = 'intro'; S.phaseT = 0; S.tagged = 0; S.done = false; S.result = null
      S.layout('L')
      S.banner = { text: `${host.name()} dives in!`, t: 2.4 }
      burst(S.shark.x, S.shark.y, 28, { color: '#d8f4ff', speed: 300, life: 0.9, size: 7, grav: 500, up: 320 }); sfx.dive()
      S.ripples = []
    },
    layout(side) {   // line the (non-tagged) minnows up along the start wall
      const w = W(), free = S.minnows.filter((m) => !m.helper)
      free.forEach((m, i) => {
        m.side = side; m.state = 'wait'
        m.x = side === 'L' ? w.x0 + 38 + rand(0, 28) : w.x1 - 38 - rand(0, 28)
        m.y = lerp(w.y0 + 40, w.y1 - 40, (i + 0.5) / free.length)
        m.dir = side === 'L' ? 1 : -1; m.vx = m.vy = 0
      })
    },
    beginRound() {
      S.phase = 'play'; S.phaseT = 0; S.round++; S.t = 0
      const free = S.minnows.filter((m) => !m.helper)
      free.forEach((m, i) => { m.state = 'cross'; m.go = rand(0, 1.1); m.ty = rand(W().y0 + 40, W().y1 - 40) })
      S.banner = { text: 'Fishy fishy, cross my ocean!', t: 2 }
      sfx.honk()
    },
    stop() {},
    update(dt, input) {
      const w = W(), sh = S.shark
      S.phaseT += dt
      S.banner && (S.banner.t = Math.max(0, S.banner.t - dt))
      for (const r of S.ripples) r.t += dt
      S.ripples = S.ripples.filter((r) => r.t < 1)
      if (S.done) { updateFx(dt); S.endT += dt; return }
      // ---- player shark
      const ax = input.axis(), ay = input.axisY()
      const sp = sh.dash > 0 ? 470 : 255
      const len = Math.hypot(ax, ay) || 1
      sh.vx = lerp(sh.vx, (ax / len) * (ax || ay ? sp : 0), 1 - Math.pow(0.0008, dt))
      sh.vy = lerp(sh.vy, (ay / len) * (ax || ay ? sp : 0), 1 - Math.pow(0.0008, dt))
      if (input.hit('Space') && sh.cool <= 0) { sh.dash = 0.32; sh.cool = 1.1; sfx.dive(); burst(sh.x, sh.y + 20, 14, { color: '#d8f4ff', speed: 200, life: 0.6, size: 6, grav: 300, up: 100 }) }
      sh.dash = Math.max(0, sh.dash - dt); sh.cool = Math.max(0, sh.cool - dt); sh.tagT = Math.max(0, sh.tagT - dt)
      sh.x = clamp(sh.x + sh.vx * dt, w.x0 + 30, w.x1 - 30); sh.y = clamp(sh.y + sh.vy * dt, w.y0 + 40, w.y1 - 20)
      if (Math.abs(sh.vx) > 12) sh.dir = Math.sign(sh.vx)
      sh.anim += dt * (3 + Math.hypot(sh.vx, sh.vy) / 60)
      if (Math.hypot(sh.vx, sh.vy) > 30 && Math.random() < dt * 8) S.ripples.push({ x: sh.x, y: sh.y + 36, t: 0 })

      if (S.phase === 'intro') { if (S.phaseT > 2.6) S.phase = 'ready'; S.phaseT = S.phase === 'ready' ? 0 : S.phaseT }
      if (S.phase === 'ready') {
        if (!S.readyBanner) { S.banner = { text: `Round ${S.round + 1}: press E to call the minnows!`, t: 99 }; S.readyBanner = true }
        if (input.hit('KeyE') || S.phaseT > 6) { S.readyBanner = false; S.banner = null; S.beginRound() }
      }
      // ---- minnows
      const sharks = [sh, ...S.minnows.filter((m) => m.helper && m.state !== 'wait')]
      for (const m of S.minnows) {
        m.anim += dt * 6
        if (m.helper) { S.updateHelper(m, dt); continue }
        if (m.state === 'wait' || m.state === 'safe') { m.y += Math.sin(S.phaseT * 3 + m.id) * 0.2; continue }
        if (S.phase !== 'play') continue
        m.go -= dt; if (m.go > 0) continue
        const targetX = m.side === 'L' ? w.x1 - 40 : w.x0 + 40
        let dx = targetX - m.x, dy = m.ty - m.y
        let l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l
        // dodge sharks that get close
        for (const s of sharks) {
          const ex = m.x - s.x, ey = m.y - s.y, d = Math.hypot(ex, ey)
          if (d < 190 && !s.isMinnow) { const f = (1 - d / 190) * 2.4; dx += (ex / (d || 1)) * f; dy += (ey / (d || 1)) * f * 1.4 }
        }
        l = Math.hypot(dx, dy) || 1
        m.vx = lerp(m.vx, (dx / l) * m.speed, 1 - Math.pow(0.01, dt)); m.vy = lerp(m.vy, (dy / l) * m.speed, 1 - Math.pow(0.01, dt))
        m.x = clamp(m.x + m.vx * dt, w.x0 + 20, w.x1 - 20); m.y = clamp(m.y + m.vy * dt, w.y0 + 36, w.y1 - 16)
        if (Math.abs(m.vx) > 10) m.dir = Math.sign(m.vx)
        // reached the far wall?
        if ((m.side === 'L' && m.x > w.x1 - SAFE_W) || (m.side === 'R' && m.x < w.x0 + SAFE_W)) { m.state = 'safe'; m.side = m.side === 'L' ? 'R' : 'L'; floatText(m.x, m.y - 60, 'Safe!', '#bff5c8') }
        // tagged by a shark?
        for (const s of sharks) {
          if (Math.hypot(m.x - s.x, m.y - s.y) < TAG_R + (s === sh && sh.dash > 0 ? 14 : 0)) { S.tag(m, s === sh); break }
        }
        if (Math.random() < dt * 6) S.ripples.push({ x: m.x, y: m.y + 28, t: 0.3 })
      }
      // ---- round over?
      if (S.phase === 'play') {
        S.t += dt
        const crossing = S.minnows.filter((m) => !m.helper && m.state === 'cross').length
        if (crossing === 0 || S.t > ROUND_TIME) {
          // anyone still swimming when time's up is caught by the clock = tagged
          S.minnows.filter((m) => !m.helper && m.state === 'cross').forEach((m) => { m.state = 'safe'; m.side = m.side === 'L' ? 'R' : 'L' })
          S.phase = 'between'; S.phaseT = 0
          const left = S.minnows.filter((m) => !m.helper).length
          if (left === 0) S.finish(true)
          else if (S.round >= ROUNDS) S.finish(false)
          else S.banner = { text: `${left} minnow${left > 1 ? 's' : ''} left!`, t: 2.2 }
        }
      }
      if (S.phase === 'between' && !S.done && S.phaseT > 2.4) {
        const side = S.minnows.find((m) => !m.helper)?.side || 'L'   // everyone arrived on the same side
        S.layout(side); S.phase = 'ready'; S.phaseT = 0; S.readyBanner = false
      }
      updateFx(dt)
    },
    updateHelper(m, dt) {
      const prey = S.minnows.filter((o) => !o.helper && o.state === 'cross')
      let tx = m.hx, ty = m.hy
      if (prey.length && S.phase === 'play') {
        const p = prey.reduce((a, b) => (Math.hypot(a.x - m.x, a.y - m.y) < Math.hypot(b.x - m.x, b.y - m.y) ? a : b))
        tx = p.x; ty = p.y
      }
      const dx = tx - m.x, dy = ty - m.y, d = Math.hypot(dx, dy) || 1
      const sp = prey.length && S.phase === 'play' ? 170 : 40
      m.vx = lerp(m.vx, (dx / d) * sp, 1 - Math.pow(0.02, dt)); m.vy = lerp(m.vy, (dy / d) * sp, 1 - Math.pow(0.02, dt))
      m.x = clamp(m.x + m.vx * dt, W().x0 + 20, W().x1 - 20); m.y = clamp(m.y + m.vy * dt, W().y0 + 36, W().y1 - 16)
      if (Math.abs(m.vx) > 10) m.dir = Math.sign(m.vx)
    },
    tag(m, byPlayer) {
      m.helper = true; m.state = 'helper'; m.hx = m.x; m.hy = m.y; S.tagged++
      sfx.tag(); burst(m.x, m.y, 16, { color: '#d8f4ff', speed: 260, life: 0.7, size: 6, grav: 400, up: 200 })
      floatText(m.x, m.y - 70, byPlayer ? 'Tagged!' : 'Tagged by a baby shark!', '#fff')
      if (byPlayer) S.shark.tagT = 0.5
    },
    finish(allTagged) {
      const pct = S.tagged / KIDS
      const stars = allTagged ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0
      S.done = true; S.endT = 0; S.result = { stars, tagged: S.tagged, total: KIDS, rounds: S.round, all: allTagged }
      S.banner = null; sfx.win(); confetti(VIEW_W / 2, 100, 120)
    },
    draw(ctx) {
      const bg = img('layers', 'pool'), w = W()
      if (bg) ctx.drawImage(bg, 0, 0, VIEW_W, VIEW_H); else { ctx.fillStyle = '#58c4e8'; ctx.fillRect(0, 0, VIEW_W, VIEW_H) }
      // animated caustics
      ctx.save(); ctx.beginPath(); ctx.rect(w.x0, w.y0, w.x1 - w.x0, w.y1 - w.y0); ctx.clip()
      ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.lineWidth = 3
      for (let i = 0; i < 14; i++) {
        const y = w.y0 + ((i * 53 + S.phaseT * 12) % (w.y1 - w.y0))
        ctx.beginPath(); for (let x = w.x0; x <= w.x1; x += 20) { const yy = y + Math.sin(x * 0.02 + S.phaseT * 1.4 + i) * 6; x === w.x0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy) } ctx.stroke()
      }
      // safe zones
      const pulse = 0.18 + 0.06 * Math.sin(S.phaseT * 3)
      for (const [x, label] of [[w.x0, 'SAFE'], [w.x1 - SAFE_W, 'SAFE']]) {
        ctx.fillStyle = `rgba(255,255,255,${pulse})`; ctx.fillRect(x, w.y0, SAFE_W, w.y1 - w.y0)
        ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.setLineDash([14, 10]); ctx.lineWidth = 3
        ctx.beginPath(); const lx = x === w.x0 ? x + SAFE_W : x; ctx.moveTo(lx, w.y0); ctx.lineTo(lx, w.y1); ctx.stroke(); ctx.setLineDash([])
        ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = `800 20px ${FONT}`; ctx.textAlign = 'center'
        ctx.save(); ctx.translate(x + SAFE_W / 2, (w.y0 + w.y1) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(label, 0, 6); ctx.restore()
      }
      // ripples
      for (const r of S.ripples) { ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - r.t)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(r.x, r.y, 14 + r.t * 34, 6 + r.t * 14, 0, 0, 7); ctx.stroke() }
      // swimmers sorted by y
      const all = [...S.minnows.map((m) => ({ y: m.y, draw: () => S.drawMinnow(ctx, m) })), { y: S.shark.y, draw: () => S.drawShark(ctx) }].sort((a, b) => a.y - b.y)
      all.forEach((e) => e.draw())
      ctx.restore()
      drawFx(ctx, 0, 0)
      S.drawHud(ctx)
    },
    drawMinnow(ctx, m) {
      const key = `k${m.kid}${Math.floor(m.anim) % 2 ? 'a' : 'b'}`
      const bob = Math.sin(m.anim * 0.8) * 3
      const tilt = clamp(m.vy / 400, -0.35, 0.35) * (m.dir > 0 ? 1 : -1)
      if (m.helper) {
        drawFrame(ctx, 'kids', key, m.x, m.y + bob, 150, { flip: m.dir < 0, rot: tilt, alpha: 0.96 })
        // shark fin
        ctx.save(); ctx.translate(m.x - m.dir * 6, m.y - 34 + bob); ctx.scale(m.dir, 1); ctx.fillStyle = '#7f8ea0'; ctx.strokeStyle = '#4c5866'; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(-14, 6); ctx.quadraticCurveTo(-4, -22, 10, -30); ctx.quadraticCurveTo(10, -10, 22, 6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore()
      } else {
        drawFrame(ctx, 'kids', key, m.x, m.y + bob, 150, { flip: m.dir < 0, rot: tilt })
      }
    },
    drawShark(ctx) {
      const sh = S.shark, who = host.who()
      const moving = Math.hypot(sh.vx, sh.vy) > 30
      const key = sh.tagT > 0 || sh.dash > 0 ? `${who}_tag` : `${who}_${Math.floor(sh.anim) % 2 ? 'a' : 'b'}`
      const tilt = clamp(sh.vy / 500, -0.3, 0.3) * (sh.dir > 0 ? 1 : -1)
      void moving
      drawFrame(ctx, 'sharks', key, sh.x, sh.y + Math.sin(sh.anim) * 3, 260, { flip: sh.dir < 0, rot: tilt })
      // dash cooldown ring
      if (sh.cool > 0) { ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(sh.x, sh.y + 52, 14, -Math.PI / 2, -Math.PI / 2 + (1 - sh.cool / 1.1) * Math.PI * 2); ctx.stroke() }
    },
    drawHud(ctx) {
      ctx.save()
      ctx.fillStyle = 'rgba(255,247,222,.93)'; ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 4; roundRect(ctx, 16, 12, 360, 70, 16); ctx.fill(); ctx.stroke()
      ctx.fillStyle = '#4a3320'; ctx.font = `800 22px ${FONT}`; ctx.textAlign = 'left'; ctx.fillText('Sharks & Minnows', 32, 42)
      ctx.font = `700 17px ${FONT}`; ctx.fillText(`Round ${Math.min(S.round + (S.phase === 'play' || S.phase === 'between' ? 0 : 1), ROUNDS)}/${ROUNDS} · Tagged ${S.tagged}/${KIDS}${S.phase === 'play' ? ` · ${Math.max(0, Math.ceil(ROUND_TIME - S.t))}s` : ''}`, 32, 68)
      if (S.banner && S.banner.t > 0) {
        ctx.globalAlpha = Math.min(1, S.banner.t); ctx.font = `800 36px ${FONT}`; ctx.textAlign = 'center'; ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(30,60,90,.85)'
        ctx.strokeText(S.banner.text, VIEW_W / 2, 200); ctx.fillStyle = '#fff'; ctx.fillText(S.banner.text, VIEW_W / 2, 200)
      }
      ctx.globalAlpha = 1
      if (S.phase === 'ready' || S.phase === 'play') {
        ctx.font = `700 18px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(40,28,16,.8)'
        ctx.fillText('Swim with the arrows · SPACE to lunge', VIEW_W / 2, VIEW_H - 18)
      }
      ctx.restore()
      if (S.done) S.drawResult(ctx)
    },
    drawResult(ctx) {
      const a = clamp(S.endT - 0.5, 0, 1), r = S.result
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(20,50,80,.5)'; ctx.fillRect(0, 0, VIEW_W, VIEW_H)
      ctx.fillStyle = 'rgba(255,247,222,.97)'; ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 6; roundRect(ctx, VIEW_W / 2 - 310, 160, 620, 340, 28); ctx.fill(); ctx.stroke()
      ctx.textAlign = 'center'; ctx.fillStyle = '#1f78a8'; ctx.font = `800 50px ${FONT}`; ctx.fillText(r.all ? 'Every minnow tagged!' : 'Pool party over!', VIEW_W / 2, 240)
      const star = img('ui', 'star')
      for (let i = 0; i < 3 && star; i++) { ctx.globalAlpha = a * (i < r.stars ? 1 : 0.2); ctx.drawImage(star, VIEW_W / 2 - 110 + i * 80, 265, 70, 66) }
      ctx.globalAlpha = a; ctx.fillStyle = '#4a3320'; ctx.font = `700 24px ${FONT}`
      ctx.fillText(`${r.tagged} of ${r.total} minnows joined the shark team in ${r.rounds} round${r.rounds > 1 ? 's' : ''}`, VIEW_W / 2, 380)
      if (S.endT > 1.2 && Math.floor(S.endT * 2) % 2 === 0) { ctx.fillStyle = '#3f8f4a'; ctx.font = `800 26px ${FONT}`; ctx.fillText('Press E or tap to finish the day', VIEW_W / 2, 450) }
      ctx.restore()
    },
  }
  void hearts; void clamp
  return S
}
