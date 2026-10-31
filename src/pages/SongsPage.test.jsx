import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SongsPage from './SongsPage'
import { SONGS } from '../data/songs'

describe('SongsPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  })

  it('lists all five songs with a play button each', () => {
    render(<SongsPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Norah's Songs")
    expect(SONGS).toHaveLength(5)
    for (const song of SONGS) {
      expect(screen.getByRole('heading', { name: song.title })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: `Play ${song.title}` })).toBeInTheDocument()
    }
  })

  it('every song points at an MP3 in the S3 podcast/songs prefix and has lyrics', () => {
    for (const song of SONGS) {
      expect(song.src).toBe(`/podcast/songs/${song.id}.mp3`)
      expect(song.durationSeconds).toBeGreaterThan(0)
      expect(song.lyrics.flatMap((s) => s.lines).length).toBeGreaterThan(0)
    }
  })

  it('plays the chosen song and moves on to the next one when it ends', async () => {
    const user = userEvent.setup()
    const { container } = render(<SongsPage />)
    const audio = container.querySelector('audio')

    await user.click(screen.getByRole('button', { name: `Play ${SONGS[1].title}` }))
    expect(audio.getAttribute('src')).toBe(SONGS[1].src)
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled()

    fireEvent.play(audio)
    expect(screen.getByRole('button', { name: `Pause ${SONGS[1].title}` })).toBeInTheDocument()

    fireEvent.ended(audio)
    expect(audio.getAttribute('src')).toBe(SONGS[2].src)
  })

  it('shows and hides the lyrics', async () => {
    const user = userEvent.setup()
    render(<SongsPage />)
    const toggle = screen.getAllByRole('button', { name: 'Show lyrics' })[0]
    await user.click(toggle)
    expect(screen.getByText(SONGS[0].lyrics[0].lines[0])).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Hide lyrics' }))
    expect(screen.queryByText(SONGS[0].lyrics[0].lines[0])).not.toBeInTheDocument()
  })

  it('shows each song length as m:ss', () => {
    render(<SongsPage />)
    expect(screen.getByText('0:25')).toBeInTheDocument()
    expect(screen.getByText('4:21')).toBeInTheDocument()
  })
})
