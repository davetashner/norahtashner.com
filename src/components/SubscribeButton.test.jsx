import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SubscribeButton from './SubscribeButton'

describe('SubscribeButton', () => {
  it('renders a link element', () => {
    render(<SubscribeButton />)
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('has correct Spotify URL', () => {
    render(<SubscribeButton />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', expect.stringContaining('open.spotify.com/show'))
  })

  it('opens in new tab', () => {
    render(<SubscribeButton />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('has security attributes', () => {
    render(<SubscribeButton />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('has accessible label', () => {
    render(<SubscribeButton />)
    expect(screen.getByRole('link')).toHaveAccessibleName(/spotify/i)
  })

  it('displays button text', () => {
    render(<SubscribeButton />)
    expect(screen.getByText(/listen on spotify/i)).toBeInTheDocument()
  })

  it('contains Spotify icon', () => {
    render(<SubscribeButton />)
    const svg = document.querySelector('.spotify-icon')
    expect(svg).toBeInTheDocument()
  })
})
