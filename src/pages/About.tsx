import type { Page } from '../App'
import './About.css'

interface Props {
  go: (p: Page) => void
}

export default function About({ go }: Props) {
  return (
    <div className="about">
      {/* Portrait */}
      <div className="about-portrait-wrap">
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

      <section className="about-content">
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
    </div>
  )
}
