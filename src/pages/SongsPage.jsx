import { useEffect, useRef, useState } from 'react'
import { SONGS } from '../data/songs'
import './GamesPage.css'
import './SongsPage.css'

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// One <audio> element plays every song, so starting a song stops the one before it, and when a song
// finishes the next one starts.
function SongsPage() {
  const audioRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [openLyrics, setOpenLyrics] = useState(() => new Set())

  const current = currentIndex === null ? null : SONGS[currentIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || currentIndex === null) return
    audio.play()?.catch?.(() => setIsPlaying(false))
  }, [currentIndex])

  function playSong(index) {
    const audio = audioRef.current
    if (index === currentIndex) {
      if (audio.paused) audio.play()?.catch?.(() => setIsPlaying(false))
      else audio.pause()
      return
    }
    setCurrentTime(0)
    setCurrentIndex(index)
  }

  function handleEnded() {
    setIsPlaying(false)
    if (currentIndex !== null && currentIndex < SONGS.length - 1) {
      setCurrentTime(0)
      setCurrentIndex(currentIndex + 1)
    }
  }

  function seek(event, song) {
    const audio = audioRef.current
    const rect = event.currentTarget.getBoundingClientRect()
    const percent = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    audio.currentTime = percent * (audio.duration || song.durationSeconds)
  }

  function toggleLyrics(id) {
    setOpenLyrics((open) => {
      const next = new Set(open)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section className="games-page songs-page">
      <h1 className="games-title">Norah&apos;s Songs</h1>
      <p className="games-subtitle">
        Songs about Obi Bear, Penny and the whole pet crew. Press play and sing along!
      </p>

      <audio
        ref={audioRef}
        src={current?.src}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={handleEnded}
      />

      <ol className="songs-list">
        {SONGS.map((song, index) => {
          const isCurrent = index === currentIndex
          const playingThis = isCurrent && isPlaying
          const lyricsOpen = openLyrics.has(song.id)
          const progress = isCurrent ? Math.min(100, (currentTime / song.durationSeconds) * 100) : 0
          return (
            <li key={song.id} className={`song-card${isCurrent ? ' song-card-current' : ''}`}>
              <div className="song-row">
                <button
                  type="button"
                  className={`song-play${playingThis ? ' playing' : ''}`}
                  onClick={() => playSong(index)}
                  aria-label={`${playingThis ? 'Pause' : 'Play'} ${song.title}`}
                >
                  {playingThis ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <div className="song-info">
                  <h2 className="song-title">{song.title}</h2>
                  <p className="song-desc">{song.description}</p>
                </div>
                <div className="song-meta">
                  <span className="song-tag">{song.tag}</span>
                  <span className="song-duration">{formatTime(song.durationSeconds)}</span>
                </div>
              </div>

              {isCurrent && (
                <div className="song-progress">
                  <span className="song-time">{formatTime(currentTime)}</span>
                  <div
                    className="song-bar"
                    onClick={(e) => seek(e, song)}
                    role="slider"
                    tabIndex={0}
                    aria-label={`Seek in ${song.title}`}
                    aria-valuemin={0}
                    aria-valuemax={song.durationSeconds}
                    aria-valuenow={Math.round(currentTime)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') audioRef.current.currentTime += 5
                      if (e.key === 'ArrowLeft') audioRef.current.currentTime -= 5
                    }}
                  >
                    <div className="song-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="song-time">{formatTime(song.durationSeconds)}</span>
                </div>
              )}

              <button
                type="button"
                className="song-lyrics-toggle"
                aria-expanded={lyricsOpen}
                aria-controls={`lyrics-${song.id}`}
                onClick={() => toggleLyrics(song.id)}
              >
                {lyricsOpen ? 'Hide lyrics' : 'Show lyrics'}
              </button>
              {lyricsOpen && (
                <div className="song-lyrics" id={`lyrics-${song.id}`}>
                  {song.lyrics.map((section, i) => (
                    <div key={i} className="song-lyrics-section">
                      {section.label && <p className="song-lyrics-label">{section.label}</p>}
                      {section.lines.map((line, j) => (
                        <p key={j} className="song-lyrics-line">
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default SongsPage
