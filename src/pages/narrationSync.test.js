import { describe, it, expect } from 'vitest'
import { scrollTargetFor, segmentsFor } from './narrationSync'

describe('scrollTargetFor', () => {
  const segments = [
    { top: 0, bottom: 100, weight: 10 }, // heading + picture
    { top: 100, bottom: 300, weight: 30 }, // paragraph 1
    { top: 300, bottom: 400, weight: 60 }, // paragraph 2
  ]

  it('starts at the top of the first segment and ends at the bottom of the last', () => {
    expect(scrollTargetFor(0, segments)).toBe(0)
    expect(scrollTargetFor(1, segments)).toBe(400)
  })

  it('moves through a segment in proportion to the weight it has been read', () => {
    // 10% of total weight (100) is the heading, so 10% progress is exactly the start of paragraph 1.
    expect(scrollTargetFor(0.1, segments)).toBe(100)
    // 25% progress = 25 chars in = 15 chars into the 30-char paragraph = half of its 200px.
    expect(scrollTargetFor(0.25, segments)).toBe(200)
  })

  it('skips zero-weight segments and clamps out-of-range progress', () => {
    const withNotes = [...segments, { top: 400, bottom: 600, weight: 0 }]
    expect(scrollTargetFor(1, withNotes)).toBe(400)
    expect(scrollTargetFor(-1, segments)).toBe(0)
    expect(scrollTargetFor(5, segments)).toBe(400)
  })

  it('returns null with nothing to follow', () => {
    expect(scrollTargetFor(0.5, [])).toBeNull()
  })
})

describe('segmentsFor', () => {
  it('builds weighted segments from a rendered spread, silencing the heading and notes when asked', () => {
    document.body.innerHTML = `
      <article id="a">
        <h2 class="story-chip">Hello</h2>
        <p class="story-text">Twelve chars</p>
        <dl class="story-notes">Notes!</dl>
      </article>`
    const el = document.getElementById('a')
    const segs = segmentsFor([{ el, headingSilent: true }], { readsNotes: false })
    expect(segs.map((s) => s.weight)).toEqual([0, 12, 0])
    const spoken = segmentsFor([{ el }], { readsNotes: true })
    expect(spoken.map((s) => s.weight)).toEqual([5, 12, 6])
  })
})
