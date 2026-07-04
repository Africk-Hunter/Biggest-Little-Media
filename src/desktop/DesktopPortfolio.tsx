import './DesktopPortfolio.css'

interface Props {
  goContact: () => void
}

const CLIPS = [
  { platform: 'Instagram Reels', title: 'Short-Form Content' },
  { platform: 'TikTok', title: 'Short-Form Content' },
  { platform: 'Instagram Reels', title: 'Short-Form Content' },
]

export default function DesktopPortfolio({ goContact }: Props) {
  return (
    <div className="dport">
      <section className="dport-header">
        <div>
          <p className="dport-eyebrow">Featured Works</p>
          <h1 className="dport-heading">Portfolio</h1>
        </div>
        <p className="dport-desc">
          Short-form video content, social strategy, and creative direction. More client work
          on the way — this is just the beginning.
        </p>
      </section>

      <section className="dport-grid">
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

      <section className="dport-bottom">
        <div className="dport-progress">
          <p className="dport-progress-label">In Progress</p>
          <h3 className="dport-progress-text">Client work dropping soon.</h3>
        </div>

        <div className="dport-cta">
          <p className="dport-cta-label">Availability</p>
          <div>
            <p className="dport-cta-text">Now accepting new clients.</p>
            <button className="dport-cta-btn" onClick={goContact}>
              Get in Touch →
            </button>
          </div>
        </div>
      </section>

      <section className="dport-footer">
        <div>
          <h2 className="dport-footer-heading">Let's make something great.</h2>
          <p className="dport-footer-sub">Your brand's story starts here.</p>
        </div>
        <button className="dport-footer-btn" onClick={goContact}>
          Book a Call →
        </button>
      </section>
    </div>
  )
}
