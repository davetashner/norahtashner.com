import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SubscribeButton from './SubscribeButton'

describe('SubscribeButton', () => {
  it('renders both platform links', () => {
    render(<SubscribeButton />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
  })

  it('has correct Spotify URL', () => {
    render(<SubscribeButton />)
    const spotifyLink = screen.getByRole('link', { name: /spotify/i })
    expect(spotifyLink).toHaveAttribute('href', expect.stringContaining('open.spotify.com/show'))
  })

  it('has correct Apple Podcasts URL', () => {
    render(<SubscribeButton />)
    const appleLink = screen.getByRole('link', { name: /apple podcasts/i })
    expect(appleLink).toHaveAttribute('href', expect.stringContaining('podcasts.apple.com'))
  })

  it('opens links in new tab', () => {
    render(<SubscribeButton />)
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  it('has security attributes on all links', () => {
    render(<SubscribeButton />)
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('has accessible labels', () => {
    render(<SubscribeButton />)
    expect(screen.getByRole('link', { name: /spotify/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /apple podcasts/i })).toBeInTheDocument()
  })

  it('displays button text', () => {
    render(<SubscribeButton />)
    expect(screen.getByText(/spotify/i)).toBeInTheDocument()
    expect(screen.getByText(/apple podcasts/i)).toBeInTheDocument()
  })
})
