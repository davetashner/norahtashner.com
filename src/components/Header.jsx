import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Header.css';

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
          <Link to="/game" className="nav-link">Game</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export default Header;
