import SubscribeButton from './SubscribeButton'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-sparkles">
        <span className="sparkle sparkle-1"></span>
        <span className="sparkle sparkle-2"></span>
        <span className="sparkle sparkle-3"></span>
        <span className="sparkle sparkle-4"></span>
        <span className="sparkle sparkle-5"></span>
      </div>

      <div className="hero-content">
        <div className="podcast-cover-wrapper">
          <img
            src="https://i.scdn.co/image/ab6765630000ba8a4d1be8b00a22d9c52192d5ee"
            alt="Norah's Notes Podcast cover art"
            className="podcast-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="cover-glow"></div>
        </div>

        <div className="hero-text">
          <h1 className="podcast-title">
            Norah's Notes Podcast
          </h1>

          <p className="podcast-tagline">
            Giggles, jokes, and imaginative stories told by a seven-year-old
          </p>

          <p className="podcast-description">
            A family-friendly audio program perfect for car rides, bedtime, or quiet time.
            Spark laughter and creativity while celebrating a child's joyful view of the world.
          </p>

          <div className="hero-cta">
            <SubscribeButton />
          </div>
        </div>
      </div>

      <div className="hero-decorations">
        <span className="decoration star-1">*</span>
        <span className="decoration star-2">*</span>
        <span className="decoration heart">&#9829;</span>
        <span className="decoration note">&#9835;</span>
      </div>
    </section>
  )
}

export default Hero
