import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GamesPage from './GamesPage'
import { GAMES } from '../data/games'

function renderPage() {
  return render(
    <MemoryRouter>
      <GamesPage />
    </MemoryRouter>
  )
}

describe('GamesPage', () => {
  it('shows the page title', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Norah's Games/i)
  })

  it('links to every game', () => {
    renderPage()
    for (const game of GAMES) {
      expect(screen.getByRole('link', { name: `Play ${game.title}` })).toHaveAttribute('href', game.to)
    }
  })

  it('shows a screenshot for every game', () => {
    renderPage()
    for (const game of GAMES) {
      expect(screen.getByAltText(game.imageAlt)).toHaveAttribute('src', game.image)
    }
  })

  it('includes Nug\'s Pond', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: "Nug's Pond" })).toBeInTheDocument()
  })
})
