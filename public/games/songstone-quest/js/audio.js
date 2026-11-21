// Chiptune music + SFX with WebAudio. Everything is synthesised; no audio files.
let ctx = null, master, musicBus, sfxBus, noiseBuf
let muted = false
try { muted = localStorage.getItem('sq-muted') === '1' } catch { /* private mode */ }
let musicVol = 1

function init() {
  if (ctx) return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ctx = new AC()
  master = ctx.createGain(); master.gain.value = muted ? 0 : 0.5; master.connect(ctx.destination)
  musicBus = ctx.createGain(); musicBus.gain.value = 0.32
  const delay = ctx.createDelay(); delay.delayTime.value = 0.18
  const fb = ctx.createGain(); fb.gain.value = 0.22
  musicBus.connect(master); musicBus.connect(delay); delay.connect(fb); fb.connect(delay); fb.connect(master)
  sfxBus = ctx.createGain(); sfxBus.gain.value = 0.55; sfxBus.connect(master)
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const d = noiseBuf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
}

const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
function freq(n) {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(n)
  if (!m) return 0
  const s = SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (parseInt(m[3]) + 1) * 12
  return 440 * Math.pow(2, (s - 69) / 12)
}

function tone(bus, type, f, t, dur, vol, slideTo) {
  const o = ctx.createOscillator(), g = ctx.createGain()
  o.type = type; o.frequency.setValueAtTime(f, t)
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.02)
}
function noise(bus, t, dur, vol, hp = 800, lp = 9000) {
  const s = ctx.createBufferSource(); s.buffer = noiseBuf
  const f1 = ctx.createBiquadFilter(); f1.type = 'highpass'; f1.frequency.value = hp
  const f2 = ctx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = lp
  const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  s.connect(f1); f1.connect(f2); f2.connect(g); g.connect(bus); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02)
}

// ---------------------------------------------------------------- songs
const r = (s, n) => Array(n).fill(s).join(' ')
const SONGS = {
  title: { bpm: 92, lead: 'G4 - B4 - D5 - - - G5 - - F#5 E5 - D5 - C5 - E5 - G5 - - - F#5 - - - - - - - E5 - G5 - B5 - A5 G5 F#5 - D5 - E5 - F#5 - G5 - - - D5 - B4 - G4 - - - - - - -',
    bass: 'G2 - D3 - G3 - D3 - E2 - B2 - E3 - B2 - C3 - G3 - C3 - G3 - D3 - A3 - D3 - F#3 - C3 - G3 - C3 - G3 - D3 - A3 - D3 - A3 - G2 - D3 - G3 - D3 - G2 - D3 - G2 - - -',
    drums: r('k . . . . . h .', 8) },
  overworld: { bpm: 138, lead: 'C5 - E5 G5 C6 - B5 A5 G5 - - E5 F5 G5 A5 - F5 - A5 C6 F5 - E5 D5 E5 - - - G4 - - - A4 - C5 E5 A5 - G5 F5 E5 - C5 - D5 E5 F5 - D5 - G5 - B4 - D5 - C5 - - - . . G4 -',
    bass: 'C3 . G3 . C3 . G3 . C3 . G3 . C3 . E3 . F2 . C3 . F2 . C3 . C3 . G3 . C3 . G2 . A2 . E3 . A2 . E3 . C3 . G3 . C3 . G3 . G2 . D3 . G2 . B2 . C3 . G3 . C3 . . .',
    drums: r('k . h . s . h .', 7) + ' k . h . s s s s' },
  village: { bpm: 104, lead: 'F5 - A5 - C6 - A5 - G5 - Bb5 - A5 - F5 - E5 - G5 - C6 - Bb5 A5 G5 - - - - - . . F5 - A5 - D6 - C6 - Bb5 - A5 - G5 - F5 - G5 - E5 - C5 - E5 - F5 - - - - - . .',
    bass: 'F3 . C4 . A3 . C4 . Bb2 . F3 . D3 . F3 . C3 . G3 . E3 . G3 . C3 . G3 . C3 . . . D3 . A3 . F3 . A3 . Bb2 . F3 . D3 . F3 . C3 . G3 . E3 . G3 . F2 . C3 . F3 . . .',
    drums: r('k . . . h . . .', 8) },
  dungeon: { bpm: 96, lead: 'A4 - - C5 E5 - - D5 C5 - B4 - G4 - - - A4 - - C5 F5 - E5 D5 E5 - - - - - - - F5 - E5 - D5 - C5 - B4 - C5 - D5 - - - C5 - B4 - A4 - G#4 - A4 - - - - - - -',
    bass: 'A2 - E3 - A2 - E3 - G2 - D3 - G2 - D3 - F2 - C3 - F2 - C3 - E2 - B2 - E2 - G#2 - D2 - A2 - D2 - A2 - G2 - D3 - G2 - D3 - A2 - E3 - E2 - B2 - A2 - E3 - A2 - . -',
    drums: r('k . . h . . s .', 8) },
  tower: { bpm: 84, transpose: -2, lead: 'E5 - - - D5 - C5 - B4 - - - C5 - D5 - E5 - G5 - F5 - E5 - D5 - - - - - . . C5 - - - B4 - A4 - G#4 - - - A4 - B4 - C5 - B4 - A4 - G#4 - A4 - - - - - . .',
    bass: 'A2 - - - A2 - - - E2 - - - E2 - - - F2 - - - F2 - - - E2 - - - E2 - - - A2 - - - F2 - - - E2 - - - E2 - - - F2 - - - D2 - - - E2 - - - A2 - - -',
    drums: r('k . . . s . . .', 8) },
  boss: { bpm: 158, lead: 'D5 D5 F5 D5 A5 D5 G5 F5 E5 E5 G5 E5 C6 E5 A5 G5 F5 F5 A5 F5 D6 F5 C6 A5 C#6 - A5 - E5 - C#5 - D5 D5 F5 D5 A5 D5 Bb5 A5 G5 G5 Bb5 G5 D6 G5 C6 Bb5 A5 A5 C#6 A5 E6 A5 C#6 A5 D6 - - - A5 - D5 -',
    bass: [r('D3', 8), r('C3', 8), r('Bb2', 8), r('A2', 8), r('D3', 8), r('G2', 8), r('A2', 8), r('D3', 8)].join(' '),
    drums: r('k h s h k k s h', 8) },
  ending: { bpm: 108, lead: 'E5 - G5 - C6 - - - B5 - A5 - G5 - - - A5 - F5 - D5 - E5 F5 G5 - - - - - - - E5 - G5 - C6 - D6 - E6 - D6 - C6 - A5 - B5 - G5 - D5 - B5 - C6 - - - - - - -',
    bass: 'C3 - G3 - E3 - G3 - G2 - D3 - B2 - D3 - F2 - C3 - A2 - C3 - G2 - D3 - G2 - B2 - C3 - G3 - E3 - G3 - A2 - E3 - C3 - E3 - G2 - D3 - G2 - D3 - C3 - G3 - C3 - - -',
    drums: r('k . h . s . h .', 8) },
}
for (const s of Object.values(SONGS)) for (const ch of ['lead', 'bass', 'drums']) s[ch] = s[ch].split(/\s+/)

let song = null, songName = null, step = 0, nextT = 0, timer = null
function noteLen(arr, i) { let n = 1; while (arr[(i + n) % arr.length] === '-' && n < 16) n++; return n }
function shift(f, tr) { return tr ? f * Math.pow(2, tr / 12) : f }
function schedule() {
  if (!ctx || !song) return
  const spb = 60 / song.bpm / 2 // eighth notes
  while (nextT < ctx.currentTime + 0.15) {
    const t = nextT
    const L = song.lead[step % song.lead.length], B = song.bass[step % song.bass.length], D = song.drums[step % song.drums.length]
    if (L && L !== '-' && L !== '.') tone(musicBus, 'square', shift(freq(L), song.transpose), t, spb * noteLen(song.lead, step % song.lead.length) * 0.95, 0.16 * musicVol)
    if (B && B !== '-' && B !== '.') tone(musicBus, 'triangle', shift(freq(B), song.transpose), t, spb * noteLen(song.bass, step % song.bass.length) * 0.9, 0.38 * musicVol)
    if (D === 'k') tone(musicBus, 'sine', 140, t, 0.12, 0.5 * musicVol, 45)
    if (D === 's') noise(musicBus, t, 0.09, 0.22 * musicVol, 1200)
    if (D === 'h') noise(musicBus, t, 0.03, 0.08 * musicVol, 6000)
    step++; nextT += spb
  }
}

export const audio = {
  unlock() { init(); if (ctx && ctx.state === 'suspended') ctx.resume() },
  get muted() { return muted },
  toggleMute() {
    muted = !muted
    try { localStorage.setItem('sq-muted', muted ? '1' : '0') } catch { /* ignore */ }
    if (master) master.gain.value = muted ? 0 : 0.5
    return muted
  },
  music(name) {
    if (name === songName) return
    songName = name; song = SONGS[name] || null; step = 0
    if (!ctx) return
    nextT = ctx.currentTime + 0.05
    if (!timer) timer = setInterval(schedule, 25)
  },
  duck(on) { musicVol = on ? 0.35 : 1 },
  get current() { return songName },
  sfx(name) {
    if (!ctx || muted) return
    const t = ctx.currentTime, b = sfxBus
    switch (name) {
      case 'sword': noise(b, t, 0.12, 0.35, 2500, 9000); tone(b, 'square', 900, t, 0.08, 0.06, 400); break
      case 'spin': for (let i = 0; i < 4; i++) noise(b, t + i * 0.06, 0.08, 0.3, 2000 + i * 800); break
      case 'charge': tone(b, 'square', 1200, t, 0.06, 0.08, 1800); break
      case 'hit': tone(b, 'square', 300, t, 0.1, 0.18, 90); noise(b, t, 0.06, 0.2, 400); break
      case 'kill': tone(b, 'square', 600, t, 0.08, 0.15, 1200); noise(b, t + 0.05, 0.2, 0.25, 300, 3000); break
      case 'hurt': tone(b, 'sawtooth', 500, t, 0.25, 0.18, 120); break
      case 'gem': tone(b, 'square', 1568, t, 0.06, 0.1); tone(b, 'square', 2093, t + 0.06, 0.1, 0.1); break
      case 'heart': tone(b, 'triangle', 880, t, 0.1, 0.3); tone(b, 'triangle', 1318, t + 0.08, 0.15, 0.3); break
      case 'chest': [523, 659, 784, 1046].forEach((f, i) => tone(b, 'square', f, t + i * 0.07, 0.1, 0.1)); break
      case 'item': [[523, 0], [659, 0.15], [784, 0.3], [1046, 0.45], [988, 0.75], [1046, 0.9]].forEach(([f, d]) => { tone(b, 'square', f, t + d, d > 0.8 ? 0.6 : 0.16, 0.12); tone(b, 'triangle', f / 2, t + d, 0.16, 0.2) }); break
      case 'songstone': ['G5', 'B5', 'D6', 'G6', 'F#6', 'D6', 'E6', 'G6'].forEach((n, i) => tone(b, 'square', freq(n), t + i * 0.14, i === 7 ? 1.0 : 0.16, 0.12)); break
      case 'secret': ['G5', 'F#5', 'D#5', 'A4', 'G#4', 'E5', 'G#5', 'C6'].forEach((n, i) => tone(b, 'square', freq(n), t + i * 0.09, 0.1, 0.1)); break
      case 'key': tone(b, 'square', 1046, t, 0.05, 0.1); tone(b, 'square', 1568, t + 0.05, 0.12, 0.1); break
      case 'door': tone(b, 'square', 200, t, 0.2, 0.15, 100); noise(b, t, 0.2, 0.15, 200, 1500); break
      case 'bomb': noise(b, t, 0.6, 0.6, 60, 2500); tone(b, 'sine', 120, t, 0.5, 0.5, 30); break
      case 'fuse': noise(b, t, 0.04, 0.05, 5000); break
      case 'arrow': noise(b, t, 0.1, 0.2, 3000); tone(b, 'triangle', 1400, t, 0.08, 0.1, 700); break
      case 'boomerang': tone(b, 'square', 700, t, 0.07, 0.05, 900); break
      case 'tink': tone(b, 'square', 2200, t, 0.05, 0.1); break
      case 'menu': tone(b, 'square', 880, t, 0.04, 0.08); break
      case 'select': tone(b, 'square', 660, t, 0.06, 0.1); tone(b, 'square', 990, t + 0.05, 0.08, 0.1); break
      case 'text': tone(b, 'square', 1200, t, 0.02, 0.03); break
      case 'lift': tone(b, 'square', 300, t, 0.1, 0.1, 500); break
      case 'throw': noise(b, t, 0.15, 0.15, 1500); break
      case 'shatter': noise(b, t, 0.2, 0.3, 1500, 8000); tone(b, 'square', 1800, t, 0.05, 0.05); break
      case 'push': noise(b, t, 0.15, 0.12, 100, 800); break
      case 'fall': tone(b, 'square', 800, t, 0.6, 0.12, 100); break
      case 'stairs': [400, 350, 300, 250].forEach((f, i) => tone(b, 'square', f, t + i * 0.07, 0.06, 0.1)); break
      case 'error': tone(b, 'square', 200, t, 0.15, 0.12); tone(b, 'square', 150, t + 0.12, 0.2, 0.12); break
      case 'boss': tone(b, 'sawtooth', 110, t, 0.8, 0.2, 55); noise(b, t, 0.8, 0.2, 100, 1200); break
      case 'switch': tone(b, 'square', 1046, t, 0.08, 0.1); tone(b, 'square', 784, t + 0.08, 0.15, 0.1); break
      case 'faint': ['E5', 'D5', 'C5', 'B4', 'A4'].forEach((n, i) => tone(b, 'triangle', freq(n), t + i * 0.18, 0.2, 0.25)); break
      default: break
    }
  },
}
