import type { DesktopPage } from './DesktopApp'
import './DesktopNav.css'

interface Props {
  page: DesktopPage
  go: (p: DesktopPage) => void
  goContact: () => void
}

const navLinks: { label: string; page: DesktopPage }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About Me', page: 'about' },
  { label: 'Portfolio', page: 'portfolio' },
  { label: 'Services', page: 'services' },
]

export default function DesktopNav({ page, go, goContact }: Props) {
  return (
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
        <button className="dnav-contact" onClick={goContact}>
          Contact
        </button>
      </div>
    </nav>
  )
}
