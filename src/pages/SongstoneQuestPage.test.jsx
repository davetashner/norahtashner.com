import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SongstoneQuestPage from './SongstoneQuestPage'

describe('SongstoneQuestPage', () => {
  it('shows the game title', () => {
    render(<SongstoneQuestPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Songstone Quest/i)
  })

  it('embeds the standalone game in an iframe', () => {
    render(<SongstoneQuestPage />)
    expect(screen.getByTitle(/Songstone Quest Game/i)).toHaveAttribute('src', '/games/songstone-quest/index.html')
  })

  it('links to the full-screen game', () => {
    render(<SongstoneQuestPage />)
    expect(screen.getByRole('link', { name: /play full screen/i })).toHaveAttribute('href', '/games/songstone-quest/index.html')
  })

  it('explains the controls and the three dungeons', () => {
    render(<SongstoneQuestPage />)
    expect(screen.getByText(/spin attack/i)).toBeInTheDocument()
    expect(screen.getByText(/Three dungeons, three Songstones/i)).toBeInTheDocument()
    expect(screen.getByText(/B: use item/i)).toBeInTheDocument()
  })
})
