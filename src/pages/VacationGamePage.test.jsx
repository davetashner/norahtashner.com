import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import VacationGamePage from './VacationGamePage'

describe('VacationGamePage', () => {
  it('renders the page section', () => {
    render(<VacationGamePage />)
    expect(document.querySelector('.vacay-page')).toBeInTheDocument()
  })

  it('shows the game title', () => {
    render(<VacationGamePage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Norah's Big Vacation/i)
  })

  it('embeds the standalone game in an iframe', () => {
    render(<VacationGamePage />)
    const frame = screen.getByTitle(/Norah's Big Vacation Game/i)
    expect(frame).toBeInTheDocument()
    expect(frame).toHaveAttribute('src', '/games/norahs-big-vacation/index.html')
  })

  it('includes how-to-play instructions', () => {
    render(<VacationGamePage />)
    expect(screen.getByText(/tap where you want/i)).toBeInTheDocument()
  })
})
