import { useState } from 'react'
import './Episodes.css'
import AudioPlayer from './AudioPlayer'
import episodesData from '../../episodes/episodes.json'

const SPOTIFY_SHOW_URL = 'https://open.spotify.com/show/4VY57mUtnr7fqRtmN2j9Ra'
const APPLE_PODCASTS_URL = 'https://podcasts.apple.com/us/podcast/norahs-notes/id1873846864'

const episodeEmojis = ['🐕', '🌟', '🔬', '❄️', '🐢']

function EpisodeCard({ episode, emoji, isExpanded, onToggle }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className={`episode-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="episode-header" onClick={onToggle}>
        <div className="episode-number">
          <span className="episode-emoji" role="img" aria-hidden="true">{emoji}</span>
          <span className="episode-num">#{episode.episodeNumber}</span>
        </div>
        <div className="episode-info">
          <h3 className="episode-title">{episode.title}</h3>
          <p className="episode-desc">{episode.description}</p>
          <div className="episode-meta">
            <span className="episode-duration">
              <span role="img" aria-hidden="true">🎧</span> {episode.duration}
            </span>
            <span className="episode-date">
              <span role="img" aria-hidden="true">📅</span> {formatDate(episode.publishDate)}
            </span>
          </div>
        </div>
        <button
          className="episode-play-toggle"
          aria-label={isExpanded ? 'Close player' : `Play episode ${episode.episodeNumber}`}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="episode-player">
          <AudioPlayer
            src={episode.audioUrl}
            title={episode.title}
          />
        </div>
      )}
    </div>
  )
}

function Episodes() {
  const [expandedEpisode, setExpandedEpisode] = useState(null)

  // Sort episodes newest first
  const episodes = [...episodesData.episodes].sort((a, b) =>
    new Date(b.publishDate) - new Date(a.publishDate)
  )

  const toggleEpisode = (episodeNum) => {
    setExpandedEpisode(expandedEpisode === episodeNum ? null : episodeNum)
  }

  return (
    <section className="episodes" id="episodes">
      <h2 className="section-title">
        <span role="img" aria-hidden="true">🎙️</span> Latest Episodes
      </h2>

      <div className="episodes-list">
        {episodes.map((episode) => (
          <EpisodeCard
            key={episode.episodeNumber}
            episode={episode}
            emoji={episodeEmojis[episode.episodeNumber - 1] || '🎵'}
            isExpanded={expandedEpisode === episode.episodeNumber}
            onToggle={() => toggleEpisode(episode.episodeNumber)}
          />
        ))}
      </div>

      <div className="spotify-section">
        <h3 className="spotify-section-title">
          <span role="img" aria-hidden="true">🎵</span> Also on Spotify and Apple Podcasts
        </h3>
        <p className="spotify-note">
          Prefer a podcast app? Listen on your favorite platform!
        </p>
        <div className="listen-links">
          <a
            href={SPOTIFY_SHOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="listen-button spotify"
          >
            <svg viewBox="0 0 24 24" className="listen-icon" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" fill="currentColor"/>
            </svg>
            Spotify
          </a>
          <a
            href={APPLE_PODCASTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="listen-button apple"
          >
            <svg viewBox="0 0 24 24" className="listen-icon" aria-hidden="true">
              <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c4.988 0 9.037 4.012 9.037 8.955 0 4.942-4.05 8.955-9.037 8.955-4.988 0-9.038-4.013-9.038-8.955 0-4.943 4.05-8.955 9.038-8.955zm-.004 2.07a6.87 6.87 0 00-6.867 6.885 6.87 6.87 0 006.867 6.885 6.87 6.87 0 006.867-6.885 6.87 6.87 0 00-6.867-6.885zm0 1.64a5.227 5.227 0 015.235 5.245 5.227 5.227 0 01-5.235 5.245 5.227 5.227 0 01-5.235-5.245 5.227 5.227 0 015.235-5.245zm0 1.395a3.85 3.85 0 00-3.849 3.85 3.85 3.85 0 003.849 3.85 3.85 3.85 0 003.849-3.85 3.85 3.85 0 00-3.849-3.85zm0 2.1c.972 0 1.75.79 1.75 1.75a1.75 1.75 0 01-1.75 1.75 1.75 1.75 0 01-1.75-1.75c0-.96.79-1.75 1.75-1.75z" fill="currentColor"/>
            </svg>
            Apple Podcasts
          </a>
        </div>
      </div>
    </section>
  )
}

export default Episodes
