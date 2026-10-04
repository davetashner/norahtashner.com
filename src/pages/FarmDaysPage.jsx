import './FarmDaysPage.css'

function FarmDaysPage() {
  return (
    <section className="farm-page">
      <h1 className="farm-title">Farm Days</h1>
      <p className="farm-subtitle">A quick farm adventure with Mr. Jersh &amp; Mrs. Carish 🐐🐔🪿</p>
      <div className="farm-container">
        <iframe
          src="/games/farm-days/index.html"
          title="Farm Days Game"
          className="farm-frame"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
      <p className="farm-fullscreen">
        <a href="/games/farm-days/index.html">Play full screen</a>
      </p>
      <div className="farm-howto">
        <h3>How to play</h3>
        <div className="farm-controls">
          <span><kbd>← →</kbd> Run</span>
          <span><kbd>Shift</kbd> Run faster</span>
          <span><kbd>Space</kbd> Jump / flap</span>
          <span><kbd>E</kbd> Pet, feed, ride, fish</span>
        </div>
        <p>
          Pick your farmer, then finish the six farm chores: collect eggs, pet the goats,
          pick sunflowers, catch a fish, feed a cow and ride the goose up to the Golden Egg.
          Hop on the goat ramp, swim the pond and grab every star on the way!
          On a phone or tablet, use the on-screen buttons.
        </p>
      </div>
    </section>
  )
}

export default FarmDaysPage
