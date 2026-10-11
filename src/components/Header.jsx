import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { GAMES } from '../data/games';
import { STORIES } from '../data/stories';
import './Header.css';

// A header menu button with an "All ..." link followed by one link per item. Closes on navigation,
// outside click or Escape.
function NavDropdown({ label, allTo, allLabel, items }) {
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
    <div className="nav-dropdown" ref={menuRef}>
      <button
        type="button"
        className="nav-link nav-dropdown-toggle"
        aria-haspopup="true"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {label}
        <span className="nav-dropdown-caret" aria-hidden="true">▾</span>
      </button>
      {menuOpen && (
        <ul className="nav-dropdown-menu" role="menu">
          <li role="none">
            <Link to={allTo} className="nav-dropdown-item nav-dropdown-all" role="menuitem">
              {allLabel}
            </Link>
          </li>
          {items.map((item) => (
            <li key={item.to} role="none">
              <Link to={item.to} className="nav-dropdown-item" role="menuitem">
                {item.menuLabel}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

NavDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  allTo: PropTypes.string.isRequired,
  allLabel: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({ to: PropTypes.string.isRequired, menuLabel: PropTypes.string.isRequired })
  ).isRequired,
};

function Header() {
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
          <NavDropdown label="Games" allTo="/games" allLabel="All games" items={GAMES} />
          <NavDropdown label="Stories" allTo="/stories" allLabel="All stories" items={STORIES} />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export default Header;
