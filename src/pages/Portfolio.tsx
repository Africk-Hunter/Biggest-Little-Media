import type { Page } from '../App'
import './Portfolio.css'

interface Props {
  go: (p: Page) => void
}

const PLACEHOLDERS = [1, 2, 3]

export default function Portfolio({ go }: Props) {
  return (
    <div className="portfolio">
      <section className="portfolio-header">
        <h1 className="portfolio-heading">Portfolio</h1>
      </section>

      <section className="portfolio-grid">
        {PLACEHOLDERS.map(n => (
          <div key={n} className="portfolio-item">
            <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="300" fill="#252220" />
              <pattern id={`stripe-${n}`} patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="20" stroke="#2e2b28" strokeWidth="10" />
              </pattern>
              <rect width="400" height="300" fill={`url(#stripe-${n})`} opacity="0.5" />
              <text x="200" y="155" textAnchor="middle" fill="#454038" fontFamily="sans-serif" fontSize="13" letterSpacing="2">
                COMING SOON
              </text>
            </svg>
          </div>
        ))}
      </section>

      <section className="portfolio-promo-row">
        <div className="portfolio-promo-card portfolio-promo-awards">
          <span className="promo-label">Awards</span>
          <p className="promo-title">CLIENT WORK COMING SOON.</p>
        </div>

        <div className="portfolio-promo-card portfolio-promo-cta">
          <p className="promo-cta-headline">NOW ACCEPTING NEW CLIENTS.</p>
          <button className="btn-promo" onClick={() => go('contact')}>
            Here's how →
          </button>
        </div>
      </section>
    </div>
  )
}
