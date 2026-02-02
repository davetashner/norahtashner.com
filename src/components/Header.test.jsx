import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../context/ThemeContext'
import Header from './Header'

function renderWithTheme(component) {
  return render(<ThemeProvider>{component}</ThemeProvider>)
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

  it('has navigation element', () => {
    renderWithTheme(<Header />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
