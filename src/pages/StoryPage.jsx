import { Link, useParams } from 'react-router-dom'
import { STORIES } from '../data/stories'
import { spreadId, useNarration } from './useNarration'
import './StoryPage.css'

function Paragraphs({ text }) {
  return text.split('\n\n').map((para) => (
    <p key={para} className="story-text">
      {para}
    </p>
  ))
}

// `eager` loads pictures up front. Narrated stories need it: lazy images popping in below the reader shift the
// layout, which would make the follow-along scroll lurch.
function Spread({ page, id, narration, eager }) {
  return (
    <article id={id} className={`story-spread${narration?.reading ? ' story-spread-reading' : ''}`}>
      <h2 className="story-chip">{page.heading}</h2>
      {narration && (
        <button type="button" className="story-listen" onClick={narration.onListen} aria-pressed={narration.active}>
          {narration.active ? '⏸ Pause' : '🔊 Listen to this page'}
        </button>
      )}
      {page.image && <img className="story-picture" src={page.image} alt={page.imageAlt} loading={eager ? 'eager' : 'lazy'} />}
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

function NarrationBar({ story, narration }) {
  const { parts, current, playing, holding, mode, follow, setFollow, playAll } = narration
  const allActive = current !== null && mode === 'all'
  let status = 'Hear the whole story read aloud.'
  if (current !== null) {
    const first = parts[current].pages[0]
    const page = first === 'end' ? story.ending : story.pages[first]
    status = `${playing || holding ? 'Reading' : 'Paused'}: ${page.heading}`
  }
  return (
    <div className="story-narration" role="region" aria-label="Narration">
      <button type="button" className="story-narration-play" onClick={playAll}>
        {allActive && (playing || holding) ? '⏸ Pause' : allActive ? '▶ Resume' : '▶ Play all'}
      </button>
      <span className="story-narration-status" aria-live="polite">
        {status}
      </span>
      <label className="story-narration-follow">
        <input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} /> Follow along
      </label>
    </div>
  )
}

function Story({ story }) {
  const narration = useNarration(story)
  const hasNarration = narration.parts.length > 0

  const spreadNarration = (ref) => {
    if (!hasNarration) return undefined
    const index = narration.partFor(ref)
    if (index < 0) return undefined
    const active = narration.current === index
    return {
      reading: active,
      active: active && (narration.playing || narration.holding) && narration.mode === 'single',
      onListen: () => narration.listen(index),
    }
  }

  return (
    <section className="story-page">
      <h1 className="story-title">{story.title}</h1>
      <p className="story-byline">Written by {story.author}</p>
      {hasNarration && (
        <>
          <NarrationBar story={story} narration={narration} />
          <audio ref={narration.audioRef} preload="none" />
        </>
      )}

      <figure className="story-cover">
        <img src={story.image} alt={story.imageAlt} />
      </figure>

      {story.pages.map((page, i) => (
        <Spread key={page.heading} page={page} id={spreadId(i)} narration={spreadNarration(i)} eager={hasNarration} />
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

      <Spread page={story.ending} id={spreadId('end')} narration={spreadNarration('end')} eager={hasNarration} />

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

  return <Story story={story} />
}

export default StoryPage
