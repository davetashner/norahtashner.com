import React, { useEffect, useState, useRef } from 'react';
import NavigationButton from '../components/NavigationButton';
import './Campsite.css';

export default function Campsite() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: "url('/assets/img/campsite.png')",
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
        Piper's Great Adventure: Day 1 — Morning at the Campsite
      </div>

      {/* Scene Illustration */}
      <div
        className="campsite-scene"
        style={{
          position: 'relative',
          flex: '1',
          overflow: 'hidden',
        }}
      >
        {/* Camper image positioned lower-left on the grass */}
        <img
          src="/assets/img/camper.png"
          alt="Camper"
          className="camper"
        />

        {/* Typewriter Story */}
        <TypewriterStory />
      </div>

        {/* Piper next to camper */}
        <img
          src="/assets/img/unicorn-piper-eyes-open.png"
          alt="Piper the unicorn"
          className="piper"
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '36%',
            width: '12%',
            minWidth: '80px',
          }}
        />

        {/* Isla near the camper */}
        <img
          src="/assets/img/unicorn-isla-eyes-open.png"
          alt="Isla the unicorn"
          className="isla"
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '44%',
            width: '23%',
            minWidth: '80px',
          }}
        />

        {/* Peanut Butter on the path */}
        <img
          src="/assets/img/unicorn-peanut-butter-eyes-open-reversed.png"
          alt="Peanut Butter the unicorn"
          style={{
            position: 'absolute',
            bottom: '37%',
            left: '90%',
            width: '7%',
            minWidth: '72px',
          }}
        />

        {/* Shiny behind Peanut Butter */}
        <img
          src="/assets/img/unicorn-shiny-eyes-open.png"
          alt="Shiny the unicorn"
          style={{
            position: 'absolute',
            bottom: '28%',
            left: '90%',
            width: '9%',
            minWidth: '72px',
          }}
        />

        {/* Oreo near Shiny */}
        <img
          src="/assets/img/unicorn-oreo.png"
          alt="Oreo the unicorn"
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '84%',
            width: '12%',
            minWidth: '72px',
          }}
        />

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
        <NavigationButton to="/" align="left">
          ← Home
        </NavigationButton>
        <NavigationButton to="/mountain-forest" align="right">
          Next → Mountain Forest
        </NavigationButton>
      </div>
    </div>
  );
}

function TypewriterStory() {
  const paragraphs = [
    "The sun was rising gently over the misty purple mountains. A soft glow sparkled on the lake’s surface, where a big white camper rested at the edge of the woods. On the camper's side was a beautiful painting of a unicorn with golden stars twinkling around it.",
    "Inside, a cozy shooting star lamp glowed softly in yellow, casting warm light over sleeping unicorns.",
    "“Piper, time to wake up, sweetheart,” Isla called gently, her voice warm like morning sunshine. Piper yawned and stretched. Her pink fur shimmered in the light of the star lamp.",
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
        bottom: '6%',
        right: '3%',
        width: '33%',
        minWidth: '280px',
        maxHeight: '65vh',
        overflowY: 'auto',
        textAlign: 'left',
        padding: '16px',
        // backgroundColor: 'rgba(0, 0, 0, 0.4)', // optional
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