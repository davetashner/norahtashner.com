// Home.jsx
import React, { useEffect, useState, useRef } from 'react'
import NavigationButton from '../components/NavigationButton'
import './Campsite.css'

export default function Home() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: "url('/assets/img/camper-inside.png')",
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
        Piper’s Great Adventure: Day 1 — Inside the Camper
      </div>

      {/* Scene with characters */}
      <div
        className="camper-scene"
        style={{
          position: 'relative',
          flex: '1',
          overflow: 'hidden',
        }}
      >
        {/* Piper on top bunk */}
        <img
          src="/assets/img/unicorn-piper-sleeping.png"
          alt="Piper laying down"
          style={{
            position: 'absolute',
            top: '1%',
            left: '1%',
            width: '20%',
            transform: 'scaleX(-1)', // head facing stove
            zIndex: 1,
          }}
        />

        {/* Shooting Star Lamp on counter behind Oreo */}
        <img
          src="/assets/img/shooting-star-lamp.png"
          alt="Shooting Star Lamp"
          style={{
            position: 'absolute',
            bottom: '44%',       // adjust as needed
            right: '35%',        // adjust as needed
            height: '28%',        // proportionate to the scene
            zIndex: 1,           // behind Oreo
            pointerEvents: 'none'
          }}
        />

        {/* Oreo near sink */}
        <img
          src="/assets/img/unicorn-oreo.png"
          alt="Oreo the unicorn"
          style={{
            position: 'absolute',
            top: '25%',
            left: '29%',
            width: '36%',
            minWidth: '120px',
          }}
        />

        {/* Typewriter Story */}
        <TypewriterStory />
      </div>

      {/* Footer Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '24px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      >
        <NavigationButton to="/campsite" align="right">
          Start the Story →
        </NavigationButton>
      </div>
    </div>
  )
}

function TypewriterStory() {
  const paragraphs = [
    "Inside the cozy camper, morning sunlight filtered softly through the curtains. Piper was still snuggled into the top bunk, dreaming sweet unicorn dreams.",
    "Down below, Oreo was already up, quietly making waffles and checking on their supplies. “Sleepy head,” Oreo chuckled softly, watching Piper stir under the covers.",
    "The shooting star lamp glowed faintly on the counter, casting gentle light across the kitchen. The sound of birds and insects chirping made its way to Piper's ear.",
    "“Piper, time to wake up,” Oreo called gently, his voice warm and deep like morning sunshine. Piper yawned and stretched. Her pink fur shimmered in the light of the star lamp.",
    "“Is it hiking day already?!” she asked, bouncing to her hooves. Today was the big day."
  ];

  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

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
        right: '3%',
        width: '33%',
        minWidth: '280px',
        maxHeight: '65vh',
        overflowY: 'auto',
        textAlign: 'left',
        padding: '16px',
        // backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '12px',
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