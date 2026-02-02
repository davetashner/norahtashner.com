import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '../context/ThemeContext'
import ThemeToggle from './ThemeToggle'

function renderWithTheme(component) {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem.mockReturnValue(null)
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders a button', () => {
    renderWithTheme(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('has accessible label for light mode', () => {
    renderWithTheme(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAccessibleName('Switch to dark mode')
  })

  it('updates accessible label after toggle', async () => {
    const user = userEvent.setup()
    renderWithTheme(<ThemeToggle />)

    const button = screen.getByRole('button')
    await user.click(button)
    expect(button).toHaveAccessibleName('Switch to light mode')
  })

  it('toggles theme on click', async () => {
    const user = userEvent.setup()
    renderWithTheme(<ThemeToggle />)

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    await user.click(screen.getByRole('button'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('has type="button" attribute', () => {
    renderWithTheme(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})
