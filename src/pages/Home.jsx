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
            top: '5%',
            left: '1%',
            width: '20%',
            transform: 'scaleX(-1)', // head facing stove
            zIndex: 1,
          }}
        />

        {/* Oreo near sink */}
        <img
          src="/assets/img/unicorn-oreo.png"
          alt="Oreo the unicorn"
          style={{
            position: 'absolute',
            top: '30%',
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
    "Inside the cozy camper, morning sunlight filtered softly through the curtains. Piper was still snuggled into the top bunk, surrounded by fluffy pillows and her favorite plush moon. The gentle hum of birds chirping outside blended with the smell of waffles from the tiny galley kitchen.",
    "Isla stirred at the stove, flipping breakfast with a smile. Today was a special day—the first of many magical adventures waiting just outside the camper door.",
    "\"Time to rise and shine, Piper!\" Isla called gently."
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