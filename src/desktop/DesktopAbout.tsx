import './DesktopAbout.css'

interface Props {
  goContact: () => void
  goServices: () => void
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

export default function DesktopAbout({ goContact, goServices }: Props) {
  return (
    <div className="dabt">
      <section className="dabt-hero">
        <div className="dabt-portrait-wrap">
          <div className="dabt-portrait" />
          <div className="dabt-portrait-fade" />
        </div>

        <div className="dabt-bio">
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
            <button className="dabt-btn-primary" onClick={goContact}>
              Work With Me
            </button>
            <button className="dabt-btn-ghost" onClick={goServices}>
              See My Services
            </button>
          </div>
        </div>
      </section>

      <section className="dabt-stats">
        {STATS.map(stat => (
          <div className="dabt-stat" key={stat.label}>
            <span className="dabt-stat-value">{stat.value}</span>
            <span className="dabt-stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="dabt-values">
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

      <section className="dabt-footer">
        <div>
          <h2 className="dabt-footer-heading">Ready to grow your brand?</h2>
          <p className="dabt-footer-sub">Let's build something together.</p>
        </div>
        <button className="dabt-footer-btn" onClick={goContact}>
          Book a Call →
        </button>
      </section>
    </div>
  )
}
