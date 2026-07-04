import './DesktopServices.css'

const SERVICES = [
  {
    num: '01',
    title: 'Social Media Management',
    desc: 'Full-service management of your social channels so you can focus on running your business.',
    items: [
      'Strategic content scheduling across all platforms',
      'Active community engagement and response management',
      'Monthly content calendars tailored to your brand voice',
      'In-depth performance tracking and monthly reports',
    ],
  },
  {
    num: '02',
    title: 'Marketing Strategies',
    desc: 'Data-backed strategies built around your audience — not guesswork.',
    items: [
      'Comprehensive brand and market analysis',
      'Deep-dive competitor research',
      'Target audience identification and segmentation',
      'Custom growth strategy and content roadmap',
    ],
  },
  {
    num: '03',
    title: 'Business & Brand Consulting',
    desc: 'One-on-one sessions to sharpen your positioning and unlock your next stage of growth.',
    items: [
      'Personalized consulting sessions at your pace',
      'Brand voice, identity, and positioning review',
      'Actionable growth recommendations for your market',
      'Full evaluation of your current online presence',
    ],
  },
  {
    num: '04',
    title: 'Social Media Audits',
    desc: 'A clear-eyed look at where you stand today — and a precise roadmap for what to do next.',
    items: [
      'Full profile and bio audit across all platforms',
      'Content quality, consistency, and tone review',
      'Detailed, prioritized improvement recommendations',
      'Customized action plan you can implement right away',
    ],
  },
]

export default function DesktopServices() {
  return (
    <div className="dsvc">
      <section className="dsvc-hero">
        <div className="dsvc-hero-bg" />
        <div className="dsvc-hero-scrim" />
        <div className="dsvc-hero-text">
          <h1 className="dsvc-heading">Services</h1>
          <p className="dsvc-tagline">Customized to your brand's needs.</p>
        </div>
      </section>

      <section className="dsvc-grid">
        {SERVICES.map(s => (
          <div className="dsvc-card" key={s.num}>
            <span className="dsvc-card-num">{s.num}.</span>
            <h3 className="dsvc-card-title">{s.title}</h3>
            <p className="dsvc-card-desc">{s.desc}</p>
            <ul className="dsvc-card-items">
              {s.items.map(item => (
                <li key={item}>
                  <span className="dsvc-dot" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  )
}
