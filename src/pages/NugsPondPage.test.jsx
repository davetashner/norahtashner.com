import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NugsPondPage from './NugsPondPage'

describe('NugsPondPage', () => {
  it('renders the page section', () => {
    render(<NugsPondPage />)
    expect(document.querySelector('.nug-page')).toBeInTheDocument()
  })

  it('shows the game title', () => {
    render(<NugsPondPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Nug's Pond/i)
  })

  it('embeds the standalone game in an iframe', () => {
    render(<NugsPondPage />)
    const frame = screen.getByTitle(/Nug's Pond Game/i)
    expect(frame).toBeInTheDocument()
    expect(frame).toHaveAttribute('src', '/games/nugs-pond/index.html')
  })

  it('links to the full-screen game', () => {
    render(<NugsPondPage />)
    expect(screen.getByRole('link', { name: /play full screen/i })).toHaveAttribute('href', '/games/nugs-pond/index.html')
  })

  it('includes how-to-play instructions', () => {
    render(<NugsPondPage />)
    expect(screen.getByText(/pick how big the numbers are/i)).toBeInTheDocument()
  })
})
