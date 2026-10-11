import { useCallback, useEffect, useRef, useState } from 'react'
import { scrollTargetFor, segmentsFor } from './narrationSync'

// How long to rest on a page's picture before its narration begins.
export const PICTURE_HOLD_MS = 4000

// Fraction of the remaining distance the page covers each frame while easing toward the narrator's position.
const EASE = 0.12

// Where in the viewport the spoken line should sit while following along (fraction of viewport height).
const FOLLOW_LINE = 0.35

export function spreadId(pageRef) {
  return `spread-${pageRef}`
}

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

// Drives a story's narration: one shared <audio> element, a "play all" chain through the story's clips,
// and (optionally) scrolling the page in step with the voice.
//
// story.narration is [{ src, pages: [pageIndex | 'end', ...], readsNotes? }], in reading order. A clip may
// cover more than one spread. `page.headingSilent` marks headings the narrator does not say aloud.
export function useNarration(story) {
  const parts = story.narration ?? []
  const audioRef = useRef(null)
  const modeRef = useRef('single')
  const [current, setCurrent] = useState(null)
  const [playing, setPlaying] = useState(false)
  const holdTimer = useRef(null)
  const followRef = useRef(true)
  const [holding, setHolding] = useState(false)
  const [follow, setFollow] = useState(() => !prefersReducedMotion())

  useEffect(() => {
    followRef.current = follow
  }, [follow])
  useEffect(() => () => clearTimeout(holdTimer.current), [])

  const startPart = useCallback(
    (index, mode) => {
      const audio = audioRef.current
      if (!audio || !parts[index]) return
      clearTimeout(holdTimer.current)
      modeRef.current = mode
      setCurrent(index)
      audio.src = parts[index].src
      audio.currentTime = 0
      const begin = () => {
        setHolding(false)
        const attempt = audio.play()
        if (attempt && typeof attempt.catch === 'function') attempt.catch(() => setPlaying(false))
      }
      // When following along, rest on the page's picture for a moment before the voice starts.
      const first = parts[index].pages[0]
      const hasPicture = Boolean((first === 'end' ? story.ending : story.pages[first])?.image)
      if (followRef.current && hasPicture) {
        setHolding(true)
        holdTimer.current = setTimeout(begin, PICTURE_HOLD_MS)
      } else {
        begin()
      }
    },
    // parts is derived from story, which is stable for the page's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [story]
  )

  const pause = useCallback(() => {
    clearTimeout(holdTimer.current)
    setHolding(false)
    audioRef.current?.pause()
  }, [])
  const resume = useCallback(() => {
    const attempt = audioRef.current?.play()
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => setPlaying(false))
  }, [])

  const playAll = useCallback(() => {
    if (current !== null && modeRef.current === 'all') {
      if (playing || holding) pause()
      else resume()
    } else {
      startPart(0, 'all')
    }
  }, [current, playing, holding, pause, resume, startPart])

  const listen = useCallback(
    (index) => {
      if (current === index && modeRef.current === 'single') {
        if (playing || holding) pause()
        else resume()
      } else {
        startPart(index, 'single')
      }
    },
    [current, playing, holding, pause, resume, startPart]
  )

  // Audio element events.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => {
      setPlaying(false)
      if (modeRef.current === 'all' && current !== null && current + 1 < parts.length) {
        startPart(current + 1, 'all')
      } else {
        setCurrent(null)
      }
    }
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, startPart])

  // Follow along: every frame, ease the page toward where the narrator is (or toward the picture while resting on it).
  useEffect(() => {
    if (!(playing || holding) || !follow || current === null) return undefined
    const part = parts[current]
    let frame
    let y = window.scrollY
    const tick = () => {
      const audio = audioRef.current
      const spreads = part.pages.map((ref) => ({
        el: document.getElementById(spreadId(ref)),
        headingSilent: Boolean((ref === 'end' ? story.ending : story.pages[ref])?.headingSilent),
      }))
      let desired = null
      if (holding) {
        const pic = spreads[0].el?.querySelector('.story-picture')
        if (pic) {
          const box = pic.getBoundingClientRect()
          const vh = window.innerHeight
          const top = box.top + window.scrollY
          desired = box.height > vh * 0.9 ? top - vh * 0.05 : top + box.height / 2 - vh / 2
        }
      } else if (audio && audio.duration > 0) {
        const segments = segmentsFor(spreads, { readsNotes: Boolean(part.readsNotes), scrollY: window.scrollY })
        const target = scrollTargetFor(audio.currentTime / audio.duration, segments)
        if (target !== null) desired = target - window.innerHeight * FOLLOW_LINE
      }
      if (desired !== null) {
        desired = Math.max(0, desired)
        y = Math.abs(desired - y) < 0.5 ? desired : y + (desired - y) * EASE
        window.scrollTo({ top: y, behavior: 'auto' })
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, holding, follow, current, story])

  // If the reader takes the wheel, stop steering. They can switch Follow along back on.
  useEffect(() => {
    if (!(playing || holding) || !follow) return undefined
    const stop = () => setFollow(false)
    const keys = new Set(['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End', ' '])
    const onKey = (e) => keys.has(e.key) && stop()
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchmove', stop, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
      window.removeEventListener('keydown', onKey)
    }
  }, [playing, holding, follow])

  const partFor = useCallback(
    (pageRef) => parts.findIndex((p) => p.pages.includes(pageRef)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [story]
  )

  return {
    audioRef,
    parts,
    current,
    playing,
    holding,
    mode: modeRef.current,
    follow,
    setFollow,
    playAll,
    listen,
    partFor,
  }
}
