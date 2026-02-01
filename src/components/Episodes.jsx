import './Episodes.css'
import SpotifyEmbed from './SpotifyEmbed'

const SPOTIFY_SHOW_URL = 'https://open.spotify.com/show/4VY57mUtnr7fqRtmN2j9Ra'

const episodes = [
  { num: 5, title: 'Sea Turtles', desc: 'A fun episode about Sea Turtles!', duration: '13 min', date: 'Jan 31' },
  { num: 4, title: 'Snow Day!', desc: 'Snow days, a trip to Italy, and true/false questions', duration: '14 min', date: 'Jan 26' },
  { num: 3, title: 'SCIENCE', desc: 'Jokes, quizzes, and discussions about DNA, volcanoes, and gravity', duration: '19 min', date: 'Jan 17' },
  { num: 2, title: 'All About Norah', desc: "Deep dive into Norah's favorite things with jokes and puzzles", duration: '9 min', date: 'Jan 11' },
  { num: 1, title: 'How We Got Penny', desc: 'Stories about getting dogs, jokes, and a true/false quiz', duration: '9 min', date: 'Jan 11' }
]

const episodeEmojis = ['🐢', '❄️', '🔬', '🌟', '🐕']

function EpisodeCard({ episode, emoji }) {
  return (
    <div className="episode-card">
      <div className="episode-number">
        <span className="episode-emoji" role="img" aria-hidden="true">{emoji}</span>
        <span className="episode-num">#{episode.num}</span>
      </div>
      <div className="episode-info">
        <h3 className="episode-title">{episode.title}</h3>
        <p className="episode-desc">{episode.desc}</p>
        <div className="episode-meta">
          <span className="episode-duration">
            <span role="img" aria-hidden="true">🎧</span> {episode.duration}
          </span>
          <span className="episode-date">
            <span role="img" aria-hidden="true">📅</span> {episode.date}
          </span>
        </div>
      </div>
      <a
        href={SPOTIFY_SHOW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="episode-play-btn"
        aria-label={`Play episode ${episode.num}: ${episode.title} on Spotify`}
      >
        <svg viewBox="0 0 24 24" className="play-icon" aria-hidden="true">
          <path d="M8 5v14l11-7z" fill="currentColor" />
        </svg>
        Play
      </a>
    </div>
  )
}

function Episodes() {
  return (
    <section className="episodes" id="episodes">
      <h2 className="section-title">
        <span role="img" aria-hidden="true">🎙️</span> Latest Episodes
      </h2>

      <div className="episodes-list">
        {episodes.map((episode, index) => (
          <EpisodeCard
            key={episode.num}
            episode={episode}
            emoji={episodeEmojis[index]}
          />
        ))}
      </div>

      <div className="spotify-section">
        <h3 className="spotify-section-title">
          <span role="img" aria-hidden="true">🎵</span> Listen on Spotify
        </h3>
        <SpotifyEmbed />
        <div className="listen-links">
          <a
            href={SPOTIFY_SHOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="listen-button spotify"
          >
            <svg viewBox="0 0 24 24" className="spotify-icon" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" fill="currentColor"/>
            </svg>
            Open in Spotify
          </a>
        </div>
      </div>
    </section>
  )
}

export default Episodes
