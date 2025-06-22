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

        {/* Thumper emerges */}
        <img
          src="/assets/img/bunny-thumper.png"
          alt="Thumper the Bunny"
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '69%',
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
    "The whole unicorn family gathered outside the camper, stretching in the fresh morning air.",
    "Isla brushed Piper’s mane gently. “Are you ready for your first big hike?”",
    "“I think so,” Piper said, still blinking the sleep from her eyes.",
    "Just then, a little white bunny hopped out from behind a bush.",
    "“Hi there!” he said with a wiggle of his nose. “I’m Thumper! Can I come with you?”",
    "The unicorns smiled. “Of course,” said Isla. “The more the merrier.”",
    "And with that, their adventure began."
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
        top: '2%',
        right: '3%',
        width: '33%',
        minWidth: '280px',
        maxHeight: '50vh',
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