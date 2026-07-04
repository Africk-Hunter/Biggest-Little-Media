import type { Page } from '../App'
import './Portfolio.css'

interface Props {
  go: (p: Page) => void
  goContactDesktop: () => void
}

const PLACEHOLDERS = [1, 2, 3]

const CLIPS = [
  { platform: 'Instagram Reels', title: 'Short-Form Content' },
  { platform: 'TikTok', title: 'Short-Form Content' },
  { platform: 'Instagram Reels', title: 'Short-Form Content' },
]

export default function Portfolio({ go, goContactDesktop }: Props) {
  return (
    <>
      {/* ── Mobile / tablet portfolio (<1024px) ── */}
      <div className="portfolio">
        <section className="portfolio-header fade-up" style={{ animationDelay: '0s' }}>
          <h1 className="portfolio-heading">Portfolio</h1>
        </section>

        <section className="portfolio-grid fade-up" style={{ animationDelay: '0.1s' }}>
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

        <section className="portfolio-promo-row fade-up" style={{ animationDelay: '0.2s' }}>
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

      {/* ── Desktop portfolio (>=1024px) ── */}
      <div className="dport">
        <section className="dport-header dport-anim" style={{ animationDelay: '0s' }}>
          <div>
            <p className="dport-eyebrow">Featured Works</p>
            <h1 className="dport-heading">Portfolio</h1>
          </div>
          <p className="dport-desc">
            Short-form video content, social strategy, and creative direction. More client work
            on the way — this is just the beginning.
          </p>
        </section>

        <section className="dport-grid dport-anim" style={{ animationDelay: '0.1s' }}>
          {CLIPS.map((clip, i) => (
            <div className="dport-card" key={i}>
              <div className="dport-thumb" />
              <div className="dport-play">
                <div className="dport-play-ring">
                  <div className="dport-play-tri" />
                </div>
              </div>
              <div className="dport-scrim" />
              <div className="dport-label">
                <span className="dport-platform">{clip.platform}</span>
                <h3 className="dport-title">{clip.title}</h3>
              </div>
            </div>
          ))}
        </section>

        <section className="dport-bottom dport-anim" style={{ animationDelay: '0.2s' }}>
          <div className="dport-progress">
            <p className="dport-progress-label">In Progress</p>
            <h3 className="dport-progress-text">Client work dropping soon.</h3>
          </div>

          <div className="dport-cta">
            <p className="dport-cta-label">Availability</p>
            <div>
              <p className="dport-cta-text">Now accepting new clients.</p>
              <button className="dport-cta-btn" onClick={goContactDesktop}>
                Get in Touch →
              </button>
            </div>
          </div>
        </section>

        <section className="dport-footer dport-anim" style={{ animationDelay: '0.2s' }}>
          <div>
            <h2 className="dport-footer-heading">Let's make something great.</h2>
            <p className="dport-footer-sub">Your brand's story starts here.</p>
          </div>
          <button className="dport-footer-btn" onClick={goContactDesktop}>
            Book a Call →
          </button>
        </section>
      </div>
    </>
  )
}
