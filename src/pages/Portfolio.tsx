import type { Page } from '../App'
import PreFooter from '../components/PreFooter'
import PortfolioGrid from '../components/PortfolioGrid'
import './Portfolio.css'

interface Props {
  go: (p: Page) => void
  goContactDesktop: () => void
}

export default function Portfolio({ go, goContactDesktop }: Props) {
  return (
    <>
      {/* ── Mobile / tablet portfolio (<1024px) ── */}
      <div className="portfolio">
        <section className="portfolio-header fade-up" style={{ animationDelay: '0s' }}>
          <h1 className="portfolio-heading">Portfolio</h1>
        </section>

        <PortfolioGrid variant="mobile" className="fade-up" style={{ animationDelay: '0.1s' }} />

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

        {/* Pre-footer */}
        <PreFooter variant="mobile" onCta={() => go('contact')} />
      </div>

      {/* ── Desktop portfolio (>=1024px) ── */}
      <div className="dport">
        <section className="dport-header dport-anim" style={{ animationDelay: '0s' }}>
          <div>
            <p className="dport-eyebrow">Featured Works</p>
            <h1 className="dport-heading">Portfolio</h1>
          </div>
          <p className="dport-desc">
            Short-form video content, social strategy, and creative direction.
          </p>
        </section>

        <PortfolioGrid variant="desktop" className="dport-anim" style={{ animationDelay: '0.1s' }} />

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

        <PreFooter variant="desktop" onCta={goContactDesktop} />
      </div>
    </>
  )
}
