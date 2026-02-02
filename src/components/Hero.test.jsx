import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from './Hero'

describe('Hero', () => {
  it('renders the hero section', () => {
    render(<Hero />)
    const section = document.querySelector('.hero')
    expect(section).toBeInTheDocument()
  })

  it('displays the podcast title', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Norah's Notes Podcast")
  })

  it('displays the tagline', () => {
    render(<Hero />)
    expect(screen.getByText(/giggles, jokes, and imaginative stories/i)).toBeInTheDocument()
  })

  it('displays the description', () => {
    render(<Hero />)
    expect(screen.getByText(/family-friendly audio program/i)).toBeInTheDocument()
  })

  it('renders the podcast cover image', () => {
    render(<Hero />)
    const image = screen.getByRole('img', { name: /podcast cover/i })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', expect.stringContaining('scdn.co'))
  })

  it('contains the subscribe buttons', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /spotify/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /apple podcasts/i })).toBeInTheDocument()
  })

  it('has decorative sparkle elements', () => {
    render(<Hero />)
    const sparkles = document.querySelectorAll('.sparkle')
    expect(sparkles.length).toBeGreaterThan(0)
  })
})
