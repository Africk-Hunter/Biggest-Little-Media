import type { Page } from '../App'
import './Nav.css'

interface Props {
  page: Page
  go: (p: Page) => void
  goContactDesktop: () => void
  menuOpen: boolean
  toggleMenu: () => void
}

const navLinks: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About Me', page: 'about' },
  { label: 'Portfolio', page: 'portfolio' },
  { label: 'Services', page: 'services' },
]

export default function Nav({ page, go, goContactDesktop, menuOpen, toggleMenu }: Props) {
  return (
    <>
      {/* ── Mobile / tablet nav (<1024px) ── */}
      <header className="nav">
        <div className="nav-inner">
          {/* Logo */}
          <button className="nav-logo" onClick={() => go('home')}>
            <img src="/Logo.svg" alt="Biggest Little Media" className="nav-logo-img" />
          </button>

          {/* Desktop-width links (still within the mobile design, shown 769-1023px) */}
          <nav className="nav-links-desktop">
            {navLinks.map(({ label, page: p }) => (
              <button
                key={p}
                className={`nav-link ${page === p ? 'active' : ''}`}
                onClick={() => go(p)}
              >
                {label}
              </button>
            ))}
            <button
              className={`nav-contact-btn ${page === 'contact' ? 'active' : ''}`}
              onClick={() => go('contact')}
            >
              Contact
            </button>
          </nav>

          {/* Hamburger */}
          <button
            className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="17" y1="3" x2="3" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                <line x1="0" y1="0.75" x2="22" y2="0.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="0" y1="8.75" x2="15" y2="8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="0" y1="15.25" x2="22" y2="15.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile overlay menu */}
        {menuOpen && (
          <div className="nav-mobile-overlay">
            <div className="nav-mobile-links">
              {navLinks.map(({ label, page: p }) => (
                <button
                  key={p}
                  className={`nav-mobile-link ${page === p ? 'active' : ''}`}
                  onClick={() => go(p)}
                >
                  {label}
                </button>
              ))}
              <button
                className="nav-mobile-contact-btn"
                onClick={() => go('contact')}
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Desktop nav (>=1024px) ── */}
      <nav className="dnav">
        <button className="dnav-brand" onClick={() => go('home')}>
          <span className="dnav-badge">BLM</span>
          <span className="dnav-wordmark">Biggest Little Media</span>
        </button>

        <div className="dnav-links">
          {navLinks.map(({ label, page: p }) => (
            <button
              key={p}
              className={`dnav-link ${page === p ? 'is-active' : ''}`}
              onClick={() => go(p)}
            >
              {label}
            </button>
          ))}
          <button className="dnav-contact" onClick={goContactDesktop}>
            Contact
          </button>
        </div>
      </nav>
    </>
  )
}
