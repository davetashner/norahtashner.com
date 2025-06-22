// MountainForest.jsx
import React, { useEffect, useState, useRef } from 'react'
import NavigationButton from '../components/NavigationButton'
import './Campsite.css' // for shared .story-box styling

export default function MountainForest() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: "url('/assets/img/mountain-forest-path.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: 'white',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          fontSize: '28px',
          fontWeight: 'bold',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      >
        Piper’s Great Adventure: Day 1 — The Mountain Forest
      </div>

      {/* Scene & Typewriter */}
      <div
        style={{
          position: 'relative',
          flex: '1',
          overflow: 'hidden',
        }}
      >
      
        {/* Piper mid-jump over the fallen log */}
        <img
          src="/assets/img/unicorn-piper-leaping-rear.png"
          alt="Piper jumping"
          style={{
            position: 'absolute',
            bottom: '8%',
            left: '56%',
            width: '14%',
            minWidth: '72px',
            transform: 'rotate(-4deg)',
          }}
        />

        {/* Isla near the back of the group */}
        <img
          src="/assets/img/unicorn-isla-eyes-open.png"
          alt="Isla the unicorn"
          style={{
            position: 'absolute',
            top: '75%',
            left: '58%',
            width: '13%',
            minWidth: '80px',
          }}
        />

        {/* Oreo a little closer to center */}
        <img
          src="/assets/img/unicorn-oreo.png"
          alt="Oreo the unicorn"
          style={{
            position: 'absolute',
            bottom: '4%',
            left: '77%',
            width: '15%',
            minWidth: '72px',
          }}
        />

        {/* Peanut Butter dozing peacefully */}
        <img
          src="/assets/img/unicorn-peanut-butter-eyes-closed.png"
          alt="Peanut Butter the unicorn"
          style={{
            position: 'absolute',
            bottom: '44%',
            left: '67%',
            width: '9%',
            minWidth: '72px',
          }}
        />

        {/* Shiny at the front of the group */}
        <img
          src="/assets/img/unicorn-shiny-eyes-open.png"
          alt="Shiny the unicorn"
          style={{
            position: 'absolute',
            bottom: '34%',
            left: '63%',
            width: '11%',
            minWidth: '72px',
          }}
        />

        {/* Characters: Thumper and Spotty */}
        <img
          src="/assets/img/bunny-thumper.png"
          alt="Thumper the bunny"
          style={{ 
            position: 'absolute',
            top: '79%',
            left: '68%',
            width: '11%',
            minWidth: '72px', 
          }}
        />
        <img
          src="/assets/img/deer-spotty-rear.png"
          alt="Spotty the deer"
          style={{ 
            position: 'absolute',
            top: '45%',
            left: '65%',
            width: '8%',
            minWidth: '72px', 
          }}
        />

        {/* Typewriter Story */}
        <TypewriterStory />
      </div>

      {/* Footer Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      >
        <NavigationButton to="/campsite" align="left">
          ← Back to Campsite
        </NavigationButton>
        <NavigationButton to="/lake-edge" align="right">
          Next → Lake Edge
        </NavigationButton>
      </div>
    </div>
  )
}

function TypewriterStory() {
  const paragraphs = [
    "The unicorn family trotted along a path that curved beside a steep drop on the left and tall, golden-leaved trees on the right. Piper led the way, her little hooves crunching through colorful leaves.",
    "“Look at that fallen log!” Piper shouted excitedly, jumping over it with a giggle.",
    "As they moved deeper into the forest, a fluffy white bunny hopped into view. “Thumper!” Piper cried. Thumper wiggled his nose and joined the unicorns on the trail.",
    "Further along, they spotted a curious deer with pink polka dots—Spotty!—and a gentle turtle with a flowery shell—Tortuga!",
    "The hike was filled with laughter, leaf piles, and the sound of hooves and paws dancing over the path."
  ]

  const [currentParagraph, setCurrentParagraph] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const storyRef = useRef(null);

  useEffect(() => {
    if (currentParagraph >= paragraphs.length) return

    const currentText = paragraphs[currentParagraph]
    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, 30)
      return () => clearTimeout(timeout)
    } else {
      const delay = setTimeout(() => {
        setCurrentParagraph(currentParagraph + 1)
        setDisplayedText('')
        setCharIndex(0)
      }, 1000)
      return () => clearTimeout(delay)
    }
  }, [charIndex, currentParagraph, paragraphs])

  return (
    <div
      className="story-box"
      style={{
        position: 'absolute',
        top: '12%',
        left: '9%',
        width: '38%',
        minWidth: '260px',
        maxWidth: '620px',
        textAlign: 'left',
        textShadow: '1px 1px 4px #000',
        overflowY: 'auto',
        maxHeight: '70vh',
        paddingRight: '12px',
      }}
    >
      {paragraphs.slice(0, currentParagraph).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {currentParagraph < paragraphs.length && <p>{displayedText}</p>}
    </div>
  )
}