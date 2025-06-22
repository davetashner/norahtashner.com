import React, { useEffect, useState, useRef } from 'react'
import NavigationButton from '../components/NavigationButton'
import './Campsite.css'

export default function LakeEdge() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: "url('/assets/img/lake-edge.png')",
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
        Piper’s Great Adventure: Day 1 — Sunset at the Lake
      </div>

      {/* Scene & Typewriter */}
      <div
        style={{
          position: 'relative',
          flex: '1',
          overflow: 'hidden',
        }}
      >
        {/* Oreo */}
        <img src="/assets/img/unicorn-oreo.png" alt="Oreo" style={{ position: 'absolute', top: '55%', right: '68%', height: '12%' }} />

        {/* Shiny */}
        <img src="/assets/img/unicorn-shiny-eyes-open.png" alt="Shiny" style={{ position: 'absolute', top: '58%', right: '71%', height: '14%' }} />

        {/* Isla */}
        <img src="/assets/img/unicorn-isla-eyes-open.png" alt="Isla" style={{ position: 'absolute', top: '58%', right: '76%', height: '14%' }} />

        {/* Spotty */}
        <img src="/assets/img/deer-spotty.png" alt="Spotty" style={{ position: 'absolute', top: '58%', right: '81%', height: '24%' }} />

        {/* Peanut Butter */}
        <img src="/assets/img/unicorn-peanut-butter-eyes-closed.png" alt="Peanut Butter" style={{ position: 'absolute', top: '59%', left: '3%', width: '11%' }} />

        {/* Piper */}
        <img src="/assets/img/unicorn-piper-eyes-open.png" alt="Piper" style={{ position: 'absolute', bottom: '6%', left: '12%', width: '14%' }} />
        
        {/* Thumper */}
        <img src="/assets/img/bunny-thumper-reversed.png" alt="Thumper" style={{ position: 'absolute', top: '84%', right: '82%', height: '18%' }} />

        {/* Tortuga on a rock */}
        <img src="/assets/img/turtle-tortuga.png" alt="Tortuga on a rock" style={{ position: 'absolute', top: '75%', right: '48%', height: '22%', transform: 'rotate(-5deg)' }} />

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
        <NavigationButton to="/mountain-forest" align="left">
          ← Back to Forest
        </NavigationButton>
        <NavigationButton to="/campsite-night" align="right">
          Final Page → Camper Celebration
        </NavigationButton>
      </div>
    </div>
  )
}

function TypewriterStory() {
  const paragraphs = [
    "As the sun dipped toward the horizon, Piper and her forest friends followed the lakeside trail home. The sky turned pink and orange, reflecting softly on the water.",
    "\"This is the prettiest sunset I’ve ever seen\" said Piper, pausing to look across the water where their tiny camper sparkled in the distance.  \"What a view\" whispered Isla",
    "On one of the rocks near the edge of the lake sat a young turtle with a flowery shell. \"Hello\", she said shyly. \"I'm Tortuga. I’ve been watching the sky all day.\"",
    "\"We’re having a campfire celebration tonight,\” Piper said. \"Want to join us?\" Tortuga’s eyes lit up. \"I’d love to!\"",
    "The clouds puffed up like marshmallows, glowing red and gold. Thumper did a happy bounce, Spotty gently nuzzled Piper, and Tortuga slowly spun in delight.",
    "The group continued on the path towards the camper having gained another forest friend."
  ];

  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const storyRef = useRef(null);

  useEffect(() => {
    if (currentParagraph >= paragraphs.length) return;

    const currentText = paragraphs[currentParagraph];
    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      const delay = setTimeout(() => {
        setCurrentParagraph(currentParagraph + 1);
        setDisplayedText('');
        setCharIndex(0);
      }, 1000);
      return () => clearTimeout(delay);
    }
  }, [charIndex, currentParagraph]);

  return (
    <div
      className="story-box"
      style={{
        position: 'absolute',
        top: '6%',
        left: '12.5%', // centers it with 75% width
        width: '75%',
        maxHeight: '30vh',
        overflowY: 'auto',
        textAlign: 'left',
        padding: '20px',
        borderRadius: '12px',
        // backgroundColor: 'rgba(0, 0, 0, 0.4)',
        textShadow: '1px 1px 4px #000',
      }}
    >
      {paragraphs.slice(0, currentParagraph).map((p, i) => (
        <p key={i} style={{ marginBottom: '1rem' }}>{p}</p>
      ))}
      {currentParagraph < paragraphs.length && <p>{displayedText}</p>}
    </div>
  );
}