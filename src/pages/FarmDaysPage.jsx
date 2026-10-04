import './FarmDaysPage.css'

function FarmDaysPage() {
  return (
    <section className="farm-page">
      <h1 className="farm-title">Farm Days</h1>
      <p className="farm-subtitle">Three levels with Mr. Jersh &amp; Mrs. Carish: farm chores, corn harvest and a pool party 🐐🌽🦈</p>
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
          <b>Level 1 – Farm chores:</b> pick your farmer, then finish the six farm chores: collect eggs,
          pet the goats, pick sunflowers, catch a fish, feed a cow and ride the goose up to the Golden Egg.
        </p>
        <p>
          <b>Level 2 – Corn harvest:</b> climb into the combine and drive through the cornfield from above.
          Fill the grain tank, then hold <kbd>E</kbd> beside the grain cart to unload.
        </p>
        <p>
          <b>Level 3 – Sharks &amp; Minnows:</b> dive into the pool and be the shark! Swim with the arrow keys,
          lunge with <kbd>Space</kbd>, and tag the kids as they cross. Tagged minnows become baby sharks.
          On a phone or tablet, use the on-screen buttons.
        </p>
      </div>
    </section>
  )
}

export default FarmDaysPage
