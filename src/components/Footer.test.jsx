import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the footer element', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('displays the current year in copyright', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument()
  })

  it('displays the tagline', () => {
    render(<Footer />)
    expect(screen.getByText(/made with love by a 7-year-old/i)).toBeInTheDocument()
  })

  it('has Spotify link with correct attributes', () => {
    render(<Footer />)
    const spotifyLink = screen.getByRole('link', { name: /spotify/i })
    expect(spotifyLink).toHaveAttribute('href', 'https://open.spotify.com')
    expect(spotifyLink).toHaveAttribute('target', '_blank')
    expect(spotifyLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('has Apple Podcasts link with correct attributes', () => {
    render(<Footer />)
    const appleLink = screen.getByRole('link', { name: /apple podcasts/i })
    expect(appleLink).toHaveAttribute('href', 'https://podcasts.apple.com')
    expect(appleLink).toHaveAttribute('target', '_blank')
    expect(appleLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('has YouTube link with correct attributes', () => {
    render(<Footer />)
    const youtubeLink = screen.getByRole('link', { name: /youtube/i })
    expect(youtubeLink).toHaveAttribute('href', 'https://youtube.com')
    expect(youtubeLink).toHaveAttribute('target', '_blank')
    expect(youtubeLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders all three platform links', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
  })
})
