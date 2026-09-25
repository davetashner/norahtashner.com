import './VacationGamePage.css'

function VacationGamePage() {
  return (
    <section className="vacay-page">
      <h1 className="vacay-title">Norah&apos;s Big Vacation</h1>
      <p className="vacay-subtitle">12 chapters, 12 mini-games · England &amp; France ✈️🎡🗼</p>
      <div className="vacay-container">
        <iframe
          src="/games/norahs-big-vacation/index.html"
          title="Norah's Big Vacation Game"
          className="vacay-frame"
          allowFullScreen
        />
      </div>
      <div className="vacay-howto">
        <h3>How to play</h3>
        <p>
          Every stop on the trip has its own mini-game: pack the suitcase before the
          pups sneak their toys in, fly to New York, snap a photo from the top of the
          London Eye, zoom under the sea to France, make the Eiffel Tower sparkle to
          music and more. Earn up to 3 stars and a passport stamp at each stop, and
          look for <b>Camile</b> hiding in every picture! Works offline. 📖✈️
        </p>
      </div>
    </section>
  )
}

export default VacationGamePage
