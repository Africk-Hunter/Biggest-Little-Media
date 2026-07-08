import type { Page } from '../App'
import PreFooter from '../components/PreFooter'
import './About.css'

interface Props {
  go: (p: Page) => void
  goContactDesktop: () => void
}

const STATS = [
  { value: 'Reno, NV', label: 'Based In' },
  { value: 'Personal', label: 'Every Strategy' },
  { value: 'Open', label: 'Taking New Clients' },
]

const VALUES = [
  {
    num: '01',
    title: 'Strategy First',
    body: "Every post, every campaign, every decision is rooted in data and intention. I don't believe in posting for the sake of posting — your content should always have a purpose and move your brand forward.",
  },
  {
    num: '02',
    title: 'Authenticity Over Aesthetics',
    body: 'Trends come and go, but a genuine brand voice is timeless. I help you find and own what makes you different, then communicate it clearly and consistently across every platform.',
  },
  {
    num: '03',
    title: 'Real Partnership',
    body: "You're not just a client — you're a collaborator. I take the time to understand your goals, your audience, and your vision so that the work we create together actually feels like you.",
  },
]

export default function About({ go, goContactDesktop }: Props) {
  return (
    <>
      {/* ── Mobile / tablet about (<1024px) ── */}
      <div className="about">
        {/* Portrait */}
        <div className="about-portrait-wrap fade-up" style={{ animationDelay: '0s' }}>
          <svg
            className="about-portrait"
            viewBox="0 0 393 300"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <rect width="393" height="300" fill="#252220" />
            <pattern id="portrait-stripe" patternUnits="userSpaceOnUse" width="24" height="24" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="24" stroke="#2e2b28" strokeWidth="12" />
            </pattern>
            <rect width="393" height="300" fill="url(#portrait-stripe)" opacity="0.6" />
            {/* Simple line-art figure placeholder */}
            <ellipse cx="196" cy="105" rx="38" ry="46" fill="none" stroke="#454038" strokeWidth="1.5" />
            <path d="M120 260 Q196 200 272 260" fill="none" stroke="#454038" strokeWidth="1.5" />
            <line x1="196" y1="151" x2="196" y2="210" stroke="#454038" strokeWidth="1.5" />
            <line x1="196" y1="175" x2="155" y2="198" stroke="#454038" strokeWidth="1.5" />
            <line x1="196" y1="175" x2="237" y2="198" stroke="#454038" strokeWidth="1.5" />
          </svg>
        </div>

        <section className="about-content fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="about-intro">
            <h1 className="about-name">BIANKA PATEL</h1>
            <p className="about-subtitle">Social Media Strategist &amp; Brand Consultant</p>
          </div>

          <div className="about-bio">
            <p>
              Hi, I'm Bianka — a Reno-based social media strategist and brand consultant
              with a passion for helping small businesses find their voice online. I believe
              every brand has a story worth telling, and I'm here to help you tell it with
              intention and consistency.
            </p>
            <p>
              Whether you're starting from scratch or looking to level up your existing
              presence, I offer personalized strategies that meet you where you are and
              grow with you. Based in the Biggest Little City, I work with clients locally
              and across the country.
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
            <div className="dabt-portrait" />
            <div className="dabt-portrait-fade" />
          </div>

          <div className="dabt-bio dabt-anim" style={{ animationDelay: '0.1s' }}>
            <p className="dabt-eyebrow">About Me</p>
            <h1 className="dabt-name">Bianka Patel</h1>
            <p className="dabt-role">Social Media Strategist &amp; Brand Consultant</p>
            <div className="dabt-divider" />
            <p className="dabt-p">
              Based in Reno, NV, I help small businesses and personal brands show up online
              with confidence. I started Biggest Little Media because I believe every brand —
              no matter its size — deserves a powerful, authentic presence.
            </p>
            <p className="dabt-p">
              With a background in content strategy and a passion for storytelling, I bring a
              personalized, hands-on approach to every client I work with. No cookie-cutter
              templates — just real strategy built around <em>your</em> brand.
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

        <section className="dabt-stats dabt-anim" style={{ animationDelay: '0.1s' }}>
          {STATS.map(stat => (
            <div className="dabt-stat" key={stat.label}>
              <span className="dabt-stat-value">{stat.value}</span>
              <span className="dabt-stat-label">{stat.label}</span>
            </div>
          ))}
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
