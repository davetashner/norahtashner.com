export const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
export const lerp = (a, b, t) => a + (b - a) * t
export const rand = (a, b) => a + Math.random() * (b - a)
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
export const dist = (a, b) => Math.abs(a - b)
export const ease = (t) => t * t * (3 - 2 * t)
