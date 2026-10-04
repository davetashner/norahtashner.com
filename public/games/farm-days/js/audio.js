// All sound is synthesized with WebAudio so the game ships with no audio files.
let ctx = null, master = null, musicTimer = null, muted = false
try { muted = localStorage.getItem('farmdays.muted') === '1' } catch { /* storage unavailable */ }

function ensure() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC(); master = ctx.createGain(); master.gain.value = muted ? 0 : 0.5; master.connect(ctx.destination)
  return ctx
}

function tone(freq, dur, { type = 'sine', vol = 0.2, slide = 0, delay = 0, dest } = {}) {
  const c = ensure(); if (!c) return
  const t = c.currentTime + delay
  const o = c.createOscillator(), g = c.createGain()
  o.type = type; o.frequency.setValueAtTime(freq, t)
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur)
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + dur + 0.05)
}

export const sfx = {
  unlock() { const c = ensure(); if (c && c.state === 'suspended') c.resume() },
  jump() { tone(340, 0.16, { type: 'triangle', slide: 280, vol: 0.18 }) },
  land() { tone(110, 0.08, { type: 'sine', vol: 0.15 }) },
  collect() { tone(740, 0.09, { type: 'triangle' }); tone(1110, 0.12, { type: 'triangle', delay: 0.07 }) },
  star() { [660, 880, 1320].forEach((f, i) => tone(f, 0.14, { type: 'triangle', delay: i * 0.06, vol: 0.16 })) },
  moo() { tone(150, 0.7, { type: 'sawtooth', slide: -40, vol: 0.12 }); tone(160, 0.7, { type: 'triangle', slide: -30, vol: 0.12 }) },
  baa() { tone(380, 0.35, { type: 'sawtooth', slide: -60, vol: 0.09 }); tone(400, 0.35, { type: 'square', slide: -80, vol: 0.04 }) },
  honk() { tone(420, 0.22, { type: 'sawtooth', slide: -120, vol: 0.14 }); tone(300, 0.2, { type: 'square', delay: 0.14, slide: -60, vol: 0.06 }) },
  cluck() { tone(520, 0.05, { type: 'square', vol: 0.06 }); tone(640, 0.06, { type: 'square', delay: 0.07, vol: 0.06 }) },
  flap() { tone(180, 0.1, { type: 'sine', slide: 120, vol: 0.12 }) },
  bite() { tone(880, 0.1, { type: 'square', vol: 0.12 }); tone(880, 0.1, { type: 'square', delay: 0.14, vol: 0.12 }) },
  splash() { tone(260, 0.25, { type: 'sine', slide: -180, vol: 0.14 }) },
  chore() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, { type: 'triangle', delay: i * 0.09, vol: 0.18 })) },
  win() { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, 0.22, { type: 'triangle', delay: i * 0.12, vol: 0.2 })) },
  tag() { tone(520, 0.08, { type: 'square', vol: 0.1 }); tone(300, 0.2, { type: 'sawtooth', slide: -150, vol: 0.1, delay: 0.05 }) },
  dive() { tone(500, 0.35, { type: 'sine', slide: -380, vol: 0.18 }) },
  bump() { tone(90, 0.12, { type: 'square', vol: 0.12 }) },
  nope() { tone(200, 0.15, { type: 'square', slide: -60, vol: 0.08 }) },
}

// combine engine hum: call engine(frac) each frame while driving, engine(null) to stop
let eng = null
export function engine(frac) {
  const c = ensure(); if (!c) return
  if (frac === null) { if (eng) { eng.g.gain.setTargetAtTime(0, c.currentTime, 0.1); const e = eng; setTimeout(() => e.o.stop(), 400); eng = null } return }
  if (!eng) { const o = c.createOscillator(), g = c.createGain(); o.type = 'sawtooth'; g.gain.value = 0; o.connect(g); g.connect(master); o.start(); eng = { o, g } }
  eng.o.frequency.setTargetAtTime(48 + frac * 46, c.currentTime, 0.1); eng.g.gain.setTargetAtTime(0.035 + frac * 0.03, c.currentTime, 0.1)
}

// gentle pentatonic loop
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16]
const BASS = [0, 0, 7, 5]
export const music = {
  start() {
    const c = ensure(); if (!c || musicTimer) return
    let step = 0
    const base = 196 // G3
    musicTimer = setInterval(() => {
      if (c.state !== 'running') return
      const bar = Math.floor(step / 8) % 4
      if (step % 8 === 0) tone(base * 0.5 * Math.pow(2, BASS[bar] / 12), 1.4, { type: 'sine', vol: 0.09 })
      if (step % 2 === 0 || Math.random() < 0.3) {
        const n = SCALE[Math.floor(Math.random() * SCALE.length)]
        tone(base * 2 * Math.pow(2, n / 12), 0.35, { type: 'triangle', vol: 0.055 })
      }
      step++
    }, 260)
  },
  stop() { clearInterval(musicTimer); musicTimer = null },
}

export function setMuted(m) {
  muted = m
  try { localStorage.setItem('farmdays.muted', m ? '1' : '0') } catch { /* ignore */ }
  if (master) master.gain.value = m ? 0 : 0.5
}
export const isMuted = () => muted
