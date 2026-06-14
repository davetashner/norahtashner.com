import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const GAMES = [
  { to: '/game', label: 'Unikittyville' },
  { to: '/vacation', label: 'England Vacation' },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // Close the menu when navigating to a new route.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <span className="logo-icon" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 40"
              width="40"
              height="40"
            >
              {/* Microphone body */}
              <rect x="14" y="6" width="12" height="18" rx="6" fill="currentColor" />
              {/* Microphone stand */}
              <path
                d="M20 24v6M14 30h12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Sparkles */}
              <circle cx="8" cy="10" r="2" fill="#ffd700" className="sparkle sparkle-1" />
              <circle cx="32" cy="8" r="1.5" fill="#ff69b4" className="sparkle sparkle-2" />
              <circle cx="34" cy="20" r="1" fill="#00d4ff" className="sparkle sparkle-3" />
            </svg>
          </span>
          <span className="logo-text">
            <span className="logo-title">Norah&apos;s Notes</span>
            <span className="logo-subtitle">Podcast</span>
          </span>
        </Link>
        <nav className="header-nav">
          <div className="nav-dropdown" ref={menuRef}>
            <button
              type="button"
              className="nav-link nav-dropdown-toggle"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              Games
              <span className="nav-dropdown-caret" aria-hidden="true">▾</span>
            </button>
            {menuOpen && (
              <ul className="nav-dropdown-menu" role="menu">
                {GAMES.map((game) => (
                  <li key={game.to} role="none">
                    <Link to={game.to} className="nav-dropdown-item" role="menuitem">
                      {game.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export default Header;
