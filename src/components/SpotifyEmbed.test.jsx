import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SpotifyEmbed from './SpotifyEmbed'

describe('SpotifyEmbed', () => {
  it('renders an iframe', () => {
    render(<SpotifyEmbed />)
    const iframe = screen.getByTitle(/spotify/i)
    expect(iframe).toBeInTheDocument()
    expect(iframe.tagName).toBe('IFRAME')
  })

  it('embeds the show by default', () => {
    render(<SpotifyEmbed />)
    const iframe = screen.getByTitle(/spotify/i)
    expect(iframe).toHaveAttribute('src', expect.stringContaining('embed/show'))
  })

  it('embeds specific episode when episodeId provided', () => {
    render(<SpotifyEmbed episodeId="abc123" />)
    const iframe = screen.getByTitle(/spotify/i)
    expect(iframe).toHaveAttribute('src', expect.stringContaining('embed/episode/abc123'))
  })

  it('uses full height by default', () => {
    render(<SpotifyEmbed />)
    const iframe = screen.getByTitle(/spotify/i)
    expect(iframe).toHaveAttribute('height', '352')
  })

  it('uses compact height when compact prop is true', () => {
    render(<SpotifyEmbed compact />)
    const iframe = screen.getByTitle(/spotify/i)
    expect(iframe).toHaveAttribute('height', '152')
  })

  it('has 100% width', () => {
    render(<SpotifyEmbed />)
    const iframe = screen.getByTitle(/spotify/i)
    expect(iframe).toHaveAttribute('width', '100%')
  })

  it('has lazy loading attribute', () => {
    render(<SpotifyEmbed />)
    const iframe = screen.getByTitle(/spotify/i)
    expect(iframe).toHaveAttribute('loading', 'lazy')
  })

  it('has accessible title', () => {
    render(<SpotifyEmbed />)
    expect(screen.getByTitle(/norah's notes podcast on spotify/i)).toBeInTheDocument()
  })

  it('applies compact class when compact', () => {
    render(<SpotifyEmbed compact />)
    const container = document.querySelector('.spotify-embed--compact')
    expect(container).toBeInTheDocument()
  })
})
