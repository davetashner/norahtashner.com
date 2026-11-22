import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import StoryPage from './StoryPage'

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/stories/:slug" element={<StoryPage />} />
      </Routes>
    </MemoryRouter>,
  )

describe('StoryPage', () => {
  it("shows Camille's story at its new address", () => {
    renderAt('/stories/camilles-great-big-wonderful-adventure')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Camille's Great Big Wonderful World Adventure")
  })

  it('redirects the old misspelled address to the new one', () => {
    renderAt('/stories/camiles-great-big-wonderful-adventure')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Camille's Great Big Wonderful World Adventure")
  })

  it('says when a story does not exist', () => {
    renderAt('/stories/no-such-story')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Story not found/i)
  })
})
