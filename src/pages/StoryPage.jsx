import { Link, useParams } from 'react-router-dom'
import { STORIES } from '../data/stories'
import './StoryPage.css'

function Paragraphs({ text }) {
  return text.split('\n\n').map((para) => (
    <p key={para} className="story-text">
      {para}
    </p>
  ))
}

function Spread({ page }) {
  return (
    <article className="story-spread">
      <h2 className="story-chip">{page.heading}</h2>
      {page.image && <img className="story-picture" src={page.image} alt={page.imageAlt} loading="lazy" />}
      <Paragraphs text={page.text} />
      {page.notes && (
        <dl className="story-notes">
          {page.notes.map((note) => (
            <div key={note.label}>
              <dt>{note.label}</dt>
              <dd>{note.text}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  )
}

function StoryPage() {
  const { slug } = useParams()
  const story = STORIES.find((s) => s.id === slug)

  if (!story) {
    return (
      <section className="story-page">
        <h1 className="story-title">Story not found</h1>
        <p className="story-byline">
          <Link to="/stories">See all stories</Link>
        </p>
      </section>
    )
  }

  return (
    <section className="story-page">
      <h1 className="story-title">{story.title}</h1>
      <p className="story-byline">Written by {story.author}</p>

      <figure className="story-cover">
        <img src={story.image} alt={story.imageAlt} />
      </figure>

      {story.pages.map((page) => (
        <Spread key={page.heading} page={page} />
      ))}

      <article className="story-spread story-log">
        <h2 className="story-chip">{story.logTitle}</h2>
        <ol className="story-log-list">
          {story.log.map((stop, i) => (
            <li key={`${stop.place}-${i}`}>
              <span className="story-log-place">{stop.place}</span>
              <span className="story-log-hello">
                {stop.hello ? <>I said &ldquo;{stop.hello}&rdquo;</> : stop.note}
              </span>
            </li>
          ))}
        </ol>
      </article>

      <Spread page={story.ending} />

      <aside className="story-print">
        <h2>Print your own book</h2>
        <p>
          Print the booklet on letter paper, two-sided, flipping on the short edge. Fold the stack in half
          and staple along the fold.
        </p>
        <a className="story-print-button" href={story.printPdf} download>
          Download the printable booklet (PDF)
        </a>
      </aside>

      <p className="story-back">
        <Link to="/stories">← All stories</Link>
      </p>
    </section>
  )
}

export default StoryPage
