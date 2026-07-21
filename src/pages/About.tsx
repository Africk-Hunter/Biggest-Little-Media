import type { Page } from '../App'
import PreFooter from '../components/PreFooter'
import './About.css'

interface Props {
  go: (p: Page) => void
  goContactDesktop: () => void
}

const VALUES = [
  {
    num: '01',
    title: 'Strategy First',
    body: "Every post, every campaign, every decision is rooted in data and intention. I don't believe in posting for the sake of posting. Your content should always have a purpose and move your brand forward.",
  },
  {
    num: '02',
    title: 'Authenticity Over Aesthetics',
    body: 'Trends come and go, but a genuine brand voice is timeless. I help you find and own what makes you different, then communicate it clearly and consistently across every platform.',
  },
  {
    num: '03',
    title: 'Real Partnership',
    body: "You're not just a client, you're a collaborator. I take the time to understand your goals, your audience, and your vision so that the work we create together actually feels like you.",
  },
]

export default function About({ go, goContactDesktop }: Props) {
  return (
    <>
      {/* ── Mobile / tablet about (<1024px) ── */}
      <div className="about">
        {/* Portrait */}
        <div className="about-portrait-wrap fade-up" style={{ animationDelay: '0s' }}>
          <picture>
            <source srcSet="/AboutMe3.webp" type="image/webp" />
            <img
              src="/AboutMe3.jpeg"
              alt="Bianka Patel, social media strategist and brand consultant at Biggest Little Media"
              className="about-portrait-img"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>

        <section className="about-content fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="about-intro">
            <h1 className="about-name">BIANKA PATEL</h1>
            <p className="about-subtitle">Social Media Strategist &amp; Brand Consultant</p>
          </div>

          <div className="about-bio">
            <p>
              Being the Biggest Little City means thinking big while staying true to our local roots
              As a small business, we focus on helping local businesses create an impact both
              digitally and physically! Our mission is to bridge the gap between local influence
              and digital trends. Being in a small city shouldn't limit any business to expand
              their unique products and services to customers.
            </p>
            <p>
              With a background in content strategy and a passion for storytelling, I bring a
              personalized, hands-on approach to every client I work with. No cookie-cutter
              templates, just real strategy built around <em>your</em> brand.
            </p>
          </div>

          <div className="about-ctas">
            <button className="btn-filled" onClick={() => go('contact')}>
              Book with me
            </button>
            <button className="btn-outline-light" onClick={() => go('services')}>
              View my services
            </button>
          </div>
        </section>

        {/* Pre-footer */}
        <PreFooter variant="mobile" onCta={() => go('contact')} />
      </div>

      {/* ── Desktop about (>=1024px) ── */}
      <div className="dabt">
        <section className="dabt-hero">
          <div className="dabt-portrait-wrap dabt-anim" style={{ animationDelay: '0s' }}>
            <div className="dabt-portrait-grid">
              <div className="dabt-portrait-cell is-forward">
                <picture>
                  <source srcSet="/AboutMe1.webp" type="image/webp" />
                  <img
                    src="/AboutMe1.jpeg"
                    alt="Bianka Patel, social media strategist and brand consultant at Biggest Little Media"
                    className="dabt-portrait-img"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </picture>
              </div>
              <div className="dabt-portrait-cell">
                <picture>
                  <source srcSet="/AboutMe2.webp" type="image/webp" />
                  <img src="/AboutMe2.jpeg" alt="" className="dabt-portrait-img" loading="eager" decoding="async" />
                </picture>
              </div>
              <div className="dabt-portrait-cell">
                <picture>
                  <source srcSet="/AboutMe3.webp" type="image/webp" />
                  <img src="/AboutMe3.jpeg" alt="" className="dabt-portrait-img" loading="eager" decoding="async" />
                </picture>
              </div>
              <div className="dabt-portrait-cell is-forward">
                <picture>
                  <source srcSet="/AboutMe4.webp" type="image/webp" />
                  <img src="/AboutMe4.jpeg" alt="" className="dabt-portrait-img" loading="eager" decoding="async" />
                </picture>
              </div>
            </div>
          </div>

          <div className="dabt-bio dabt-anim" style={{ animationDelay: '0.1s' }}>
            <p className="dabt-eyebrow">About Me</p>
            <h1 className="dabt-name">Bianka Patel</h1>
            <p className="dabt-role">Social Media Strategist &amp; Brand Consultant</p>
            <div className="dabt-divider" />
            <p className="dabt-p">
              Being the Biggest Little City means thinking big while staying true to our local roots
              As a small business, we focus on helping local businesses create an impact both
              digitally and physically! Our mission is to bridge the gap between local influence
              and digital trends. Being in a small city shouldn't limit any business to expand
              their unique products and services to customers.
            </p>
            <p className="dabt-p">
              With a background in content strategy and a passion for storytelling, I bring a
              personalized, hands-on approach to every client I work with. No cookie-cutter
              templates, just real strategy built around <em>your</em> brand.
            </p>
            <div className="dabt-ctas">
              <button className="dabt-btn-primary" onClick={goContactDesktop}>
                Work With Me
              </button>
              <button className="dabt-btn-ghost" onClick={() => go('services')}>
                See My Services
              </button>
            </div>
          </div>
        </section>

        <section className="dabt-values dabt-anim" style={{ animationDelay: '0.1s' }}>
          <div className="dabt-values-label">
            <p className="dabt-eyebrow">My Approach</p>
            <h2 className="dabt-values-heading">How I Work</h2>
          </div>

          <div className="dabt-values-list">
            {VALUES.map(val => (
              <div className="dabt-value-row" key={val.num}>
                <span className="dabt-value-num">{val.num}</span>
                <div>
                  <h3 className="dabt-value-title">{val.title}</h3>
                  <p className="dabt-value-body">{val.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <PreFooter variant="desktop" onCta={goContactDesktop} />
      </div>
    </>
  )
}
