import './VacationGamePage.css'

function VacationGamePage() {
  return (
    <section className="vacay-page">
      <h1 className="vacay-title">Norah&apos;s Big Vacation</h1>
      <p className="vacay-subtitle">Chapter 5 · The London Eye 🎡</p>
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
          It&apos;s all taps! Tap the glowing pod to climb aboard, tap the wheel to
          ride up high, then tap the London sights you can see. Find the hidden
          Camile and earn a passport stamp! 📖
        </p>
      </div>
    </section>
  )
}

export default VacationGamePage
