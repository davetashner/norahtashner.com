import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem.mockReturnValue(null)
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders without crashing', () => {
    render(<App />)
    expect(document.querySelector('.app')).toBeInTheDocument()
  })

  it('renders the header', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders the main content area', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders the footer', () => {
    render(<App />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders the hero section', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Norah's Notes")
  })

  it('has skip to content link', () => {
    render(<App />)
    const skipLink = screen.getByText(/skip to content/i)
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  it('main content has correct id for skip link', () => {
    render(<App />)
    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('id', 'main-content')
  })

  it('provides theme context', () => {
    render(<App />)
    // Theme toggle button should be accessible, proving context is provided
    expect(screen.getByRole('button', { name: /switch to/i })).toBeInTheDocument()
  })
})
