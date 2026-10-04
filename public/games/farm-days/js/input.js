// Keyboard + touch input. `down` = currently held, `pressed` = went down this frame.
const down = new Set()
const pressed = new Set()
const ALIAS = { KeyA: 'ArrowLeft', KeyD: 'ArrowRight', KeyW: 'Space', ArrowUp: 'Space', Enter: 'KeyE', KeyF: 'KeyE' }

function press(code) { if (!down.has(code)) pressed.add(code); down.add(code) }
function release(code) { down.delete(code) }

addEventListener('keydown', (e) => {
  const code = ALIAS[e.code] || e.code
  if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault()
  if (!e.repeat) press(code)
  if (e.code === 'ArrowUp' || e.code === 'KeyW') press('MoveUp')
  if (e.code === 'ArrowDown' || e.code === 'KeyS') press('MoveDown')
  if (e.code.startsWith('Shift')) down.add('Shift')
})
addEventListener('keyup', (e) => { release(ALIAS[e.code] || e.code); if (e.code === 'ArrowUp' || e.code === 'KeyW') release('MoveUp'); if (e.code === 'ArrowDown' || e.code === 'KeyS') release('MoveDown'); if (e.code.startsWith('Shift')) down.delete('Shift') })
addEventListener('blur', () => down.clear())

for (const el of document.querySelectorAll('#touch button')) {
  const code = el.dataset.key
  el.addEventListener('pointerdown', (e) => { e.preventDefault(); el.setPointerCapture(e.pointerId); press(code) })
  const up = () => release(code)
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('lostpointercapture', up)
}

export const input = {
  held: (c) => down.has(c),
  hit: (c) => pressed.has(c),
  axisY: () => (down.has('MoveDown') ? 1 : 0) - (down.has('MoveUp') ? 1 : 0),
  axis: () => (down.has('ArrowRight') ? 1 : 0) - (down.has('ArrowLeft') ? 1 : 0),
  endFrame: () => pressed.clear(),
}
