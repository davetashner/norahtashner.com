import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FarmDaysPage from './FarmDaysPage'

describe('FarmDaysPage', () => {
  it('shows the game title', () => {
    render(<FarmDaysPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Farm Days/i)
  })

  it('embeds the standalone game in an iframe', () => {
    render(<FarmDaysPage />)
    const frame = screen.getByTitle(/Farm Days Game/i)
    expect(frame).toHaveAttribute('src', '/games/farm-days/index.html')
  })

  it('links to the full-screen game', () => {
    render(<FarmDaysPage />)
    expect(screen.getByRole('link', { name: /play full screen/i })).toHaveAttribute('href', '/games/farm-days/index.html')
  })

  it('explains the controls and chores', () => {
    render(<FarmDaysPage />)
    expect(screen.getByText(/six farm chores/i)).toBeInTheDocument()
  })
})
