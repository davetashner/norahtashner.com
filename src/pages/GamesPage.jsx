import { Link } from 'react-router-dom'
import { GAMES } from '../data/games'
import './GamesPage.css'

function GamesPage() {
  return (
    <section className="games-page">
      <h1 className="games-title">Norah&apos;s Games</h1>
      <p className="games-subtitle">
        {GAMES.length} games to play right in your browser. Pick one!
      </p>
      <ul className="games-grid">
        {GAMES.map((game) => (
          <li key={game.id}>
            <Link to={game.to} className="game-card" aria-label={`Play ${game.title}`}>
              <div className="game-card-shot">
                <img
                  src={game.image}
                  alt={game.imageAlt}
                  loading="lazy"
                  style={{ objectPosition: game.imagePosition }}
                />
              </div>
              <div className="game-card-body">
                <h2 className="game-card-title">{game.title}</h2>
                <p className="game-card-tagline">{game.tagline}</p>
                <p className="game-card-desc">{game.description}</p>
                <div className="game-card-footer">
                  <ul className="game-card-tags" aria-label="Tags">
                    {game.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <span className="game-card-play" aria-hidden="true">
                    Play →
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default GamesPage
