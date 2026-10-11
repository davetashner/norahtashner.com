import { Link } from 'react-router-dom'
import { STORIES } from '../data/stories'
import './GamesPage.css'

function StoriesPage() {
  return (
    <section className="games-page">
      <h1 className="games-title">Stories</h1>
      <p className="games-subtitle">
        Picture books to read here or print and staple into your own little book.
      </p>
      <ul className="games-grid">
        {STORIES.map((story) => (
          <li key={story.id}>
            <Link to={story.to} className="game-card" aria-label={`Read ${story.title}`}>
              <div className="game-card-shot">
                <img
                  src={story.image}
                  alt={story.imageAlt}
                  loading="lazy"
                  style={{ objectPosition: story.imagePosition }}
                />
              </div>
              <div className="game-card-body">
                <h2 className="game-card-title">{story.title}</h2>
                <p className="game-card-tagline">{story.tagline}</p>
                <p className="game-card-desc">{story.description}</p>
                <div className="game-card-footer">
                  <ul className="game-card-tags" aria-label="Tags">
                    {story.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <span className="game-card-play" aria-hidden="true">
                    Read →
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

export default StoriesPage
