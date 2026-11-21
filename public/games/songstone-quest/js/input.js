// One input layer for keyboard, gamepad and touch. Logical buttons: up down left right sword item menu.
const KEYS = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  Space: 'sword', KeyZ: 'sword', KeyJ: 'sword', KeyE: 'sword',
  KeyX: 'item', KeyK: 'item', KeyQ: 'item', ShiftLeft: 'item', ShiftRight: 'item',
  Enter: 'menu', Escape: 'menu', KeyP: 'menu', Tab: 'menu',
}
const sources = { key: new Set(), pad: new Set(), touch: new Set() }
const held = new Set()
const prev = new Set()
let anyListeners = []

addEventListener('keydown', (e) => {
  const b = KEYS[e.code]
  if (b) { e.preventDefault(); sources.key.add(b) }
  anyListeners.forEach((f) => f())
})
addEventListener('keyup', (e) => { const b = KEYS[e.code]; if (b) sources.key.delete(b) })
addEventListener('blur', () => { sources.key.clear(); sources.touch.clear() })

// --- touch ---------------------------------------------------------------
const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
if (isTouch) document.body.classList.add('touch')
addEventListener('touchstart', () => { if (!document.body.classList.contains('touch')) document.body.classList.add('touch') }, { once: true, passive: true })

const dpad = document.getElementById('dpad')
const knob = document.getElementById('knob')
const dirTouch = new Set()
function setPad(e) {
  const r = dpad.getBoundingClientRect()
  const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2)
  const len = Math.hypot(dx, dy), max = r.width / 2 - 20
  const k = len > max ? max / len : 1
  knob.style.transform = `translate(${dx * k}px, ${dy * k}px)`
  dirTouch.clear()
  if (len > 14) {
    const a = Math.atan2(dy, dx), oct = Math.round(a / (Math.PI / 4))
    const map = { 0: ['right'], 1: ['right', 'down'], 2: ['down'], 3: ['down', 'left'], 4: ['left'], '-4': ['left'], '-3': ['left', 'up'], '-2': ['up'], '-1': ['up', 'right'] }
    for (const d of map[oct]) dirTouch.add(d)
  }
}
if (dpad) {
  dpad.addEventListener('pointerdown', (e) => { e.preventDefault(); dpad.setPointerCapture(e.pointerId); setPad(e); anyListeners.forEach((f) => f()) })
  dpad.addEventListener('pointermove', (e) => { if (dpad.hasPointerCapture(e.pointerId)) setPad(e) })
  const end = () => { dirTouch.clear(); knob.style.transform = '' }
  dpad.addEventListener('pointerup', end); dpad.addEventListener('pointercancel', end); dpad.addEventListener('lostpointercapture', end)
}
const btnTouch = new Set()
for (const el of document.querySelectorAll('#touch button')) {
  const b = el.dataset.key
  el.addEventListener('pointerdown', (e) => { e.preventDefault(); el.setPointerCapture(e.pointerId); btnTouch.add(b); anyListeners.forEach((f) => f()) })
  const up = () => btnTouch.delete(b)
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('lostpointercapture', up)
}
addEventListener('contextmenu', (e) => e.preventDefault())

// --- gamepad -------------------------------------------------------------
function pollPad() {
  sources.pad.clear()
  const pads = navigator.getGamepads ? navigator.getGamepads() : []
  for (const p of pads) {
    if (!p) continue
    const b = (i) => p.buttons[i] && p.buttons[i].pressed
    const ax = p.axes[0] || 0, ay = p.axes[1] || 0
    if (b(12) || ay < -0.45) sources.pad.add('up')
    if (b(13) || ay > 0.45) sources.pad.add('down')
    if (b(14) || ax < -0.45) sources.pad.add('left')
    if (b(15) || ax > 0.45) sources.pad.add('right')
    if (b(0) || b(1)) sources.pad.add('sword')
    if (b(2) || b(3) || b(4) || b(5)) sources.pad.add('item')
    if (b(9) || b(8)) sources.pad.add('menu')
    if (sources.pad.size) anyListeners.forEach((f) => f())
  }
}

export const input = {
  isTouch,
  // call once per fixed update step
  update() {
    pollPad()
    prev.clear(); for (const b of held) prev.add(b)
    held.clear()
    for (const s of [sources.key, sources.pad, dirTouch, btnTouch]) for (const b of s) held.add(b)
  },
  held: (b) => held.has(b),
  hit: (b) => held.has(b) && !prev.has(b),
  released: (b) => !held.has(b) && prev.has(b),
  dir() {
    return { x: (held.has('right') ? 1 : 0) - (held.has('left') ? 1 : 0), y: (held.has('down') ? 1 : 0) - (held.has('up') ? 1 : 0) }
  },
  onAny(f) { anyListeners.push(f) },
  clear() { sources.key.clear(); btnTouch.clear(); dirTouch.clear(); held.clear(); prev.clear() },
}
