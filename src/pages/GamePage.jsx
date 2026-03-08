import './GamePage.css'

function GamePage() {
  return (
    <section className="game-page">
      <h1 className="game-title">Unikittyville</h1>
      <p className="game-subtitle">A Unicorn Kitty Adventure</p>
      <div className="game-container">
        <iframe
          src="/games/unikittyville/index.html"
          title="Unikittyville Game"
          className="game-frame"
          allowFullScreen
        />
      </div>
      <div className="game-controls">
        <h3>Controls</h3>
        <div className="controls-grid">
          <span><kbd>Arrow Keys</kbd> Move</span>
          <span><kbd>Space</kbd> Jump</span>
          <span><kbd>Enter</kbd> Enter/Exit</span>
          <span><kbd>F</kbd> Fish</span>
          <span><kbd>C</kbd> Cook/Collect</span>
          <span><kbd>S</kbd> Swim/Surf</span>
          <span><kbd>G</kbd> Gelato</span>
          <span><kbd>T</kbd> Tiki Torch</span>
          <span><kbd>Q</kbd> Talk to NPCs</span>
        </div>
      </div>
    </section>
  )
}

export default GamePage
