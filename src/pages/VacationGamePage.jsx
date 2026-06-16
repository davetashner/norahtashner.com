import './VacationGamePage.css'

function VacationGamePage() {
  return (
    <section className="vacay-page">
      <h1 className="vacay-title">Norah&apos;s Big Vacation</h1>
      <p className="vacay-subtitle">12 chapters · England &amp; France ✈️🎡🗼</p>
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
          Tap where you want <b>Norah</b> to walk and she&apos;ll head there with
          Camile following along. Walk into the things to collect (paw prints,
          clouds, swans, croissants…), find the hidden Camile, and earn a passport
          stamp — then on to the next stop! Works fully offline. 📖✈️
        </p>
      </div>
    </section>
  )
}

export default VacationGamePage
