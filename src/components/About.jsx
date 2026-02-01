import './About.css'

function About() {
  return (
    <section className="about-section" id="about">
      {/* Decorative elements */}
      <div className="decoration decoration-star decoration-1"></div>
      <div className="decoration decoration-star decoration-2"></div>
      <div className="decoration decoration-star decoration-3"></div>
      <div className="decoration decoration-circle decoration-4"></div>
      <div className="decoration decoration-circle decoration-5"></div>

      <div className="about-container">
        <h2 className="about-title">About the Show</h2>

        <div className="about-host">
          <p className="host-intro">
            Welcome to <span className="host-name">Norah&apos;s Notes</span>! I&apos;m Norah, and I&apos;m 7 years old.
            I love sharing jokes that make you giggle, telling stories from my imagination,
            and learning fun facts that will surprise you. Join me on my podcast adventure!
          </p>
        </div>

        <div className="about-expect">
          <div className="expect-card">
            <span className="expect-icon" role="img" aria-label="laughing face">&#128518;</span>
            <h3 className="expect-title">Giggles Galore</h3>
            <p className="expect-desc">Silly jokes and funny moments that will make the whole family laugh</p>
          </div>

          <div className="expect-card">
            <span className="expect-icon" role="img" aria-label="open book">&#128214;</span>
            <h3 className="expect-title">Imaginative Stories</h3>
            <p className="expect-desc">Adventures and tales straight from my imagination to yours</p>
          </div>

          <div className="expect-card">
            <span className="expect-icon" role="img" aria-label="question mark">&#10067;</span>
            <h3 className="expect-title">Fun Quizzes</h3>
            <p className="expect-desc">Test your knowledge with kid-friendly trivia and brain teasers</p>
          </div>

          <div className="expect-card">
            <span className="expect-icon" role="img" aria-label="star">&#11088;</span>
            <h3 className="expect-title">Cool Facts</h3>
            <p className="expect-desc">Amazing things about animals, space, nature, and more!</p>
          </div>
        </div>

        <div className="about-perfect-for">
          <h3 className="perfect-for-title">
            <span role="img" aria-label="headphones">&#127911;</span>
            Perfect For:
          </h3>
          <ul className="perfect-for-list">
            <li className="perfect-for-item">
              <span role="img" aria-label="car">&#128663;</span>
              Car rides
            </li>
            <li className="perfect-for-item">
              <span role="img" aria-label="bed">&#128716;</span>
              Bedtime listening
            </li>
            <li className="perfect-for-item">
              <span role="img" aria-label="lotus">&#129495;</span>
              Quiet time
            </li>
            <li className="perfect-for-item">
              <span role="img" aria-label="smiling face">&#128522;</span>
              Whenever you need a smile
            </li>
          </ul>
        </div>

        <div className="about-fun-facts">
          <h3 className="fun-facts-title">
            <span role="img" aria-label="sparkles">&#10024;</span>
            Fun Facts About Norah
          </h3>
          <ul className="fun-facts-list">
            <li className="fun-fact-item">
              <span className="fun-fact-icon" role="img" aria-label="dog">&#128054;</span>
              <span>Loves all animals, especially dogs and dolphins</span>
            </li>
            <li className="fun-fact-item">
              <span className="fun-fact-icon" role="img" aria-label="microscope">&#128300;</span>
              <span>Super curious about science and how things work</span>
            </li>
            <li className="fun-fact-item">
              <span className="fun-fact-icon" role="img" aria-label="party face">&#129395;</span>
              <span>Known for having a great sense of humor</span>
            </li>
            <li className="fun-fact-item">
              <span className="fun-fact-icon" role="img" aria-label="rainbow">&#127752;</span>
              <span>Favorite color is purple (can you tell?)</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default About
