import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
