import { describe, it, expect, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import StoriesPage from './StoriesPage'
import StoryPage from './StoryPage'
import { STORIES } from '../data/stories'

describe('StoriesPage', () => {
  it('links to every story', () => {
    render(
      <MemoryRouter>
        <StoriesPage />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Stories')
    for (const story of STORIES) {
      expect(screen.getByRole('link', { name: `Read ${story.title}` })).toHaveAttribute('href', story.to)
    }
  })
})

describe('StoryPage', () => {
  function renderStory(path) {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/stories/:slug" element={<StoryPage />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it.each(STORIES.map((story) => [story.title, story]))(
    'shows every page of %s and the printable booklet link',
    (_title, story) => {
      renderStory(story.to)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(story.title)
      for (const page of story.pages) {
        expect(screen.getByRole('heading', { name: page.heading })).toBeInTheDocument()
        if (page.image) {
          // Some stories reuse one picture on several pages, so there can be more than one match.
          const pics = screen.getAllByAltText(page.imageAlt)
          expect(pics[0]).toHaveAttribute('src', page.image)
        }
      }
      expect(screen.getByRole('heading', { name: story.logTitle })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /printable booklet/i })).toHaveAttribute('href', story.printPdf)
    }
  )

  it('shows a friendly message for an unknown story', () => {
    renderStory('/stories/nope')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/not found/i)
  })
})

describe('StoryPage narration', () => {
  const narrated = STORIES.find((s) => s.narration)

  function renderNarrated() {
    return render(
      <MemoryRouter initialEntries={[narrated.to]}>
        <Routes>
          <Route path="/stories/:slug" element={<StoryPage />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('has one clip per part of the story, each pointing at real spreads', () => {
    for (const part of narrated.narration) {
      expect(part.src).toMatch(/\.mp3$/)
      for (const ref of part.pages) {
        expect(ref === 'end' || narrated.pages[ref]).toBeTruthy()
      }
    }
    // every page is covered by exactly one clip
    const covered = narrated.narration.flatMap((p) => p.pages)
    expect(covered).toHaveLength(new Set(covered).size)
    expect(covered).toContain('end')
    narrated.pages.forEach((_, i) => expect(covered).toContain(i))
  })

  it('starts the first clip from Play all and plays a single page from its Listen button', async () => {
    const play = vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    const { default: userEvent } = await import('@testing-library/user-event')
    const user = userEvent.setup()
    const { container } = renderNarrated()

    await user.click(screen.getByRole('button', { name: /play all/i }))
    expect(play).toHaveBeenCalledTimes(1)
    expect(container.querySelector('audio').getAttribute('src')).toBe(narrated.narration[0].src)

    const listenButtons = screen.getAllByRole('button', { name: /listen to this page/i })
    await user.click(listenButtons[1])
    expect(container.querySelector('audio').getAttribute('src')).toBe(narrated.narration[1].src)
  })

  it('rests on a page picture for four seconds before its narration starts', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const play = vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue()
    play.mockClear()
    renderNarrated()
    // The Tokyo page (second Listen button) opens with a picture; the intro page (first) does not.
    fireEvent.click(screen.getAllByRole('button', { name: /listen to this page/i })[1])
    expect(play).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(3900))
    expect(play).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(200))
    expect(play).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('does not show narration controls for a story without audio', () => {
    const plain = STORIES.find((s) => !s.narration)
    render(
      <MemoryRouter initialEntries={[plain.to]}>
        <Routes>
          <Route path="/stories/:slug" element={<StoryPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.queryByRole('button', { name: /play all/i })).not.toBeInTheDocument()
  })
})
