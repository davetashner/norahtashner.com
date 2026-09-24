import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '../context/ThemeContext'
import Header from './Header'

// Header uses router hooks (useLocation), so wrap in a router.
function renderWithTheme(component) {
  return render(
    <MemoryRouter>
      <ThemeProvider>{component}</ThemeProvider>
    </MemoryRouter>
  )
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem.mockReturnValue(null)
  })

  it('renders the header element', () => {
    renderWithTheme(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('displays the logo with text', () => {
    renderWithTheme(<Header />)
    expect(screen.getByText("Norah's Notes")).toBeInTheDocument()
    expect(screen.getByText('Podcast')).toBeInTheDocument()
  })

  it('has a link to the homepage', () => {
    renderWithTheme(<Header />)
    const homeLink = screen.getByRole('link', { name: /norah's notes/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('contains the theme toggle button', () => {
    renderWithTheme(<Header />)
    expect(screen.getByRole('button', { name: /switch to/i })).toBeInTheDocument()
  })

  it('links to the all-games page from the Games menu', () => {
    renderWithTheme(<Header />)
    fireEvent.click(screen.getByRole('button', { name: /games/i }))
    expect(screen.getByRole('menuitem', { name: /all games/i })).toHaveAttribute('href', '/games')
    expect(screen.getByRole('menuitem', { name: /nug's pond/i })).toHaveAttribute('href', '/nugs-pond')
  })

  it('has navigation element', () => {
    renderWithTheme(<Header />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
