import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="Listen on Spotify"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Spotify</span>
          </a>
          <a
            href="https://podcasts.apple.com/us/podcast/norahs-notes/id1873846864"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="Listen on Apple Podcasts"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c4.988 0 9.037 4.012 9.037 8.955 0 4.942-4.05 8.955-9.037 8.955-4.988 0-9.038-4.013-9.038-8.955 0-4.943 4.05-8.955 9.038-8.955zm-.004 2.07a6.87 6.87 0 00-6.867 6.885 6.87 6.87 0 006.867 6.885 6.87 6.87 0 006.867-6.885 6.87 6.87 0 00-6.867-6.885zm0 1.64a5.227 5.227 0 015.235 5.245 5.227 5.227 0 01-5.235 5.245 5.227 5.227 0 01-5.235-5.245 5.227 5.227 0 015.235-5.245zm0 1.395a3.85 3.85 0 00-3.849 3.85 3.85 3.85 0 003.849 3.85 3.85 3.85 0 003.849-3.85 3.85 3.85 0 00-3.849-3.85zm0 2.1c.972 0 1.75.79 1.75 1.75a1.75 1.75 0 01-1.75 1.75 1.75 1.75 0 01-1.75-1.75c0-.96.79-1.75 1.75-1.75z"/>
            </svg>
            <span>Apple Podcasts</span>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            aria-label="Watch on YouTube"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YouTube</span>
          </a>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} Norah&apos;s Notes Podcast
          </p>
          <p className="footer-tagline">
            Made with love by a 7-year-old
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
