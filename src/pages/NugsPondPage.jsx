import './NugsPondPage.css'

const GAME_SRC = '/games/nugs-pond/index.html'

function NugsPondPage() {
  return (
    <section className="nug-page">
      <h1 className="nug-title">Nug&apos;s Pond</h1>
      <p className="nug-subtitle">Adding &amp; subtracting with Nug the frog 🐸➕➖</p>
      <div className="nug-container">
        <iframe
          src={GAME_SRC}
          title="Nug's Pond Game"
          className="nug-frame"
          allow="fullscreen; autoplay"
          allowFullScreen
        />
      </div>
      <p className="nug-fullscreen">
        <a href={GAME_SRC}>Play full screen</a>
      </p>
      <div className="nug-howto">
        <h3>How to play</h3>
        <p>
          Pick how big the numbers are, then choose a game: guess where <b>Nug</b> lands
          in Lily Hop, pop the right bubble in Bubble Pop, race Duck in Pond Race, or
          finish the math sentence in Fish Friends. Stars unlock 14 hats, 48 stickers
          that make animal sounds and new sticker-page backgrounds, and at 100 stars Nug
          can start wearing outfits. Made for iPad. 🦆🫧🐟
        </p>
      </div>
    </section>
  )
}

export default NugsPondPage
