// Maps audio progress to a scroll position so the page can follow along with a narration clip.
//
// A clip's "segments" are the pieces of page it reads, in reading order. Each one has the document-space
// top/bottom of the element it covers and a weight (how much speech it holds, measured in characters).
// Progress through the clip (0..1) is spread across the segments by weight, then eased linearly down the
// current segment, so the page glides through a picture while its heading is read and through each
// paragraph while that paragraph is read.

export function scrollTargetFor(progress, segments) {
  const live = segments.filter((s) => s.weight > 0)
  if (live.length === 0) return segments.length ? segments[0].top : null
  const total = live.reduce((sum, s) => sum + s.weight, 0)
  let at = Math.min(Math.max(progress, 0), 1) * total
  for (const seg of live) {
    if (at <= seg.weight) {
      return seg.top + (seg.bottom - seg.top) * (at / seg.weight)
    }
    at -= seg.weight
  }
  const last = live[live.length - 1]
  return last.bottom
}

// Builds the segments for one narration part from the rendered spreads it covers.
//   spreads: [{ el, headingSilent }]   readsNotes: whether the EAT/HEAR/MEET card is spoken in this clip
// Positions are read at call time (the page layout shifts as lazy images load), relative to the document.
export function segmentsFor(spreads, { readsNotes = false, scrollY = 0 } = {}) {
  const pieces = []
  for (const { el, headingSilent } of spreads) {
    if (!el) continue
    const top = (node) => node.getBoundingClientRect().top + scrollY
    const nodes = Array.from(el.querySelectorAll('.story-chip, .story-text, .story-notes'))
    nodes.forEach((node) => {
      const isChip = node.classList.contains('story-chip')
      const isNotes = node.classList.contains('story-notes')
      let weight = (node.textContent || '').length
      if (isChip && headingSilent) weight = 0
      if (isNotes && !readsNotes) weight = 0
      pieces.push({ top: top(node), weight, articleBottom: top(el) + el.getBoundingClientRect().height })
    })
  }
  // Each piece runs from its own top to the top of the next piece (the last one runs to its article's end).
  return pieces.map((p, i) => ({
    top: p.top,
    bottom: i + 1 < pieces.length ? pieces[i + 1].top : p.articleBottom,
    weight: p.weight,
  }))
}
