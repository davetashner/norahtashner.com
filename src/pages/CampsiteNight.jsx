import React, { useEffect, useState, useRef } from 'react'
import NavigationButton from '../components/NavigationButton'
import './Campsite.css'

export default function CampsiteNight() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: "url('/assets/img/campsite-night.png')",
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
        Piper’s Great Adventure: Day 1 — A Night to Remember
      </div>

      {/* Scene & Typewriter */}
      <div
        style={{
          position: 'relative',
          flex: '1',
          overflow: 'hidden',
        }}
      >

        <div
          className="shooting-star"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100px',
            height: '100px',
            animation: 'shootAcrossSky 8s linear infinite',
            zIndex: 100,
            pointerEvents: 'none',
          }}
        >
          <img
            src="/assets/img/shooting-star.png"
            alt="Shooting Star"
            style={{ width: '100%' }}
          />
        </div>

        {/* Camper */}
        <img
          src="/assets/img/camper-night.png"
          alt="Camper"
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '3%',
            width: '24%',
            minWidth: '200px',
          }}
        />

        <img src="/assets/img/unicorn-peanut-butter-eyes-open-reversed.png" alt="Peanut Butter" style={{ position: 'absolute', bottom: '17%', right: '48%', height: '14%' }} />

        {/* Campfire */}
        <img
          src="/assets/img/campfire.png"
          alt="Campfire"
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '45%',
            height: '18%',
          }}
        />

        {/* Piper */}
        <img src="/assets/img/unicorn-piper-eyes-open.png" alt="Piper" style={{ position: 'absolute', bottom: '16%', left: '40%', height: '14%' }} />

        {/* Isla */}
        <img src="/assets/img/unicorn-isla-eyes-open.png" alt="Isla" style={{ position: 'absolute', bottom: '6%', left: '36%', height: '14%' }} />
        
        {/* Oreo */}
        <img src="/assets/img/unicorn-oreo.png" alt="Oreo" style={{ position: 'absolute', bottom: '14%', left: '52%', height: '14%' }} />
        
        {/* Shiny */}
        <img src="/assets/img/unicorn-shiny-eyes-open.png" alt="Shiny" style={{ position: 'absolute', bottom: '10%', left: '53%', height: '14%' }} />
        
        {/* Thumper */}
        <img src="/assets/img/bunny-thumper-reversed.png" alt="Thumper" style={{ position: 'absolute', bottom: '10%', left: '40%', height: '10%' }} />
        
        {/* Spotty */}
        <img src="/assets/img/deer-spotty-rear.png" alt="Spotty" style={{ position: 'absolute', bottom: '2%', right: '48%', height: '14%' }} />
        
        {/* Tortuga */}
        <img src="/assets/img/turtle-tortuga.png" alt="Tortuga" style={{ position: 'absolute', bottom: '4%', right: '42%', height: '12%' }} />

        {/* Typewriter Story */}
        <TypewriterStory />
      </div>

      {/* Footer Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      >
        <NavigationButton to="/lake-edge" align="left">
          ← Back to Lake Edge
        </NavigationButton>
      </div>
    </div>
  )
}

function TypewriterStory() {
  const paragraphs = [
    "Stars twinkled above the campsite as the unicorns and their new friends gathered around the campfire. The soft light of the shooting star lamp glowed from inside the camper.",
    "“We did it!” Piper cheered. “We hiked the mountain, made new friends, and watched the sun set over the lake!”",
    "Isla smiled and nuzzled Piper. “You were brave and kind today, little one,” she said.",
    "Spotty, Thumper, and Tortuga sat happily around the fire as Oreo handed out marshmallow treats.",
    "Laughter filled the air, and above them, a real shooting star streaked across the night sky.",
    "Piper’s heart was full. Tomorrow, they’d explore even more, but tonight, they had the stars and each other."
  ]

  const [currentParagraph, setCurrentParagraph] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const storyRef = useRef(null)

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
  }, [charIndex, currentParagraph])

  return (
    <div
      className="story-box"
      style={{
        position: 'absolute',
        top: '6%',
        left: '12.5%',
        width: '75%',
        maxHeight: '32vh',
        overflowY: 'auto',
        textAlign: 'left',
        padding: '20px',
        borderRadius: '12px',
        textShadow: '1px 1px 4px #000',
      }}
    >
      {paragraphs.slice(0, currentParagraph).map((p, i) => (
        <p key={i} style={{ marginBottom: '1rem' }}>{p}</p>
      ))}
      {currentParagraph < paragraphs.length && <p>{displayedText}</p>}
    </div>
  )
}