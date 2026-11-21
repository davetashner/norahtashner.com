import './SongstoneQuestPage.css'

function SongstoneQuestPage() {
  return (
    <section className="sq-page">
      <h1 className="sq-title">Songstone Quest</h1>
      <p className="sq-subtitle">
        Grumblewick the grumpy shadow owl stole the three Songstones and Melody Meadow went quiet. Grab Grandpa&apos;s
        sword and bring the music home! 🗡️🎵
      </p>
      <div className="sq-container">
        <iframe
          src="/games/songstone-quest/index.html"
          title="Songstone Quest Game"
          className="sq-frame"
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
        />
      </div>
      <p className="sq-fullscreen">
        <a href="/games/songstone-quest/index.html">Play full screen</a>
      </p>
      <div className="sq-howto">
        <h3>How to play</h3>
        <div className="sq-controls">
          <span><kbd>← ↑ → ↓</kbd> Walk</span>
          <span><kbd>Space</kbd> A: sword, talk, open, lift</span>
          <span><kbd>X</kbd> B: use item</span>
          <span><kbd>Enter</kbd> Menu &amp; map</span>
          <span><kbd>M</kbd> Sound</span>
        </div>
        <p>
          Hold <kbd>Space</kbd> and let go for a <b>spin attack</b>. Talk to everyone in Melody Meadow, and to Potato the
          corgi when you get stuck. She always knows where to go next!
        </p>
        <p>
          <b>Three dungeons, three Songstones:</b> find the Boomerang in Leafy Hollow, Bombs in the Crystal Caverns and
          the Bow in the Frost Spire. Then climb the Hush Tower to face Grumblewick.
        </p>
        <p>
          Collect four <b>heart pieces</b> for an extra heart. Your game saves by itself, so you can come back any time.
          Works with a game controller, and on a phone or iPad with the on-screen buttons.
        </p>
      </div>
    </section>
  )
}

export default SongstoneQuestPage
