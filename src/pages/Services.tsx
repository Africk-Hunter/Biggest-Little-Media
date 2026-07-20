import type { Page } from '../App'
import PreFooter from '../components/PreFooter'
import './Services.css'

interface Props {
  go: (p: Page) => void
  goContactDesktop: () => void
}

const SERVICES = [
  {
    num: '01',
    title: 'Social Media Management',
    desc: 'Full-service management of your social channels so you can focus on running your business.',
    bullets: [
      'Strategic content scheduling across all platforms',
      'Active community engagement and response management',
      'Monthly content calendars tailored to your brand voice',
      'In-depth performance tracking and monthly reports',
    ],
  },
  {
    num: '02',
    title: 'Marketing Strategies',
    desc: 'Data-backed strategies built around your audience.',
    bullets: [
      'Comprehensive brand and market analysis',
      'Deep-dive competitor research',
      'Target audience identification and engagement',
      'Custom growth strategy and content roadmap',
    ],
  },
  {
    num: '03',
    title: 'Business & Brand Consulting',
    desc: 'One-on-one sessions to sharpen your positioning and unlock your next stage of growth.',
    bullets: [
      'Personalized consulting sessions at your pace',
      'Brand voice, identity, and positioning review',
      'Actionable growth recommendations for your market',
      'Full evaluation of your current online presence',
    ],
  },
  {
    num: '04',
    title: 'Social Media Audits',
    desc: 'A look at where you stand today and a precise roadmap for what to do next.',
    bullets: [
      'Full profile and bio audit across all platforms',
      'Content quality, consistency, and tone review',
      'Detailed, prioritized improvement recommendations',
      'Customized action plan you can implement right away',
    ],
  },
]

const DESKTOP_SERVICES = [
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
    desc: 'Data-backed strategies built around your audience and your goals, not guesswork, not generic templates.',
    items: [
      'Comprehensive analysis of your brand, market, and competitors',
      'Deep-dive competitor research to uncover real opportunities',
      'Target audience identification and detailed segmentation',
      'Custom growth strategy and content roadmap built around your goals',
    ],
  },
  {
    num: '03',
    title: 'Business & Brand Consulting',
    desc: 'One-on-one sessions to sharpen your positioning and unlock your next stage of growth.',
    items: [
      'Personalized one-on-one consulting sessions at your own pace',
      'Brand voice, identity, and messaging positioning review',
      'Actionable growth recommendations tailored to your market',
      'Full evaluation of your current online presence and reach',
    ],
  },
  {
    num: '04',
    title: 'Social Media Audits',
    desc: 'A clear-eyed look at where you stand today, and a precise roadmap for what to do next.',
    items: [
      'Full profile and bio audit across every active platform',
      'Content quality, consistency, and brand tone review',
      'Detailed, prioritized recommendations for improvement',
      'Customized action plan you can implement right away',
    ],
  },
]

export default function Services({ go, goContactDesktop }: Props) {
  return (
    <>
      {/* ── Mobile / tablet services (<1024px) ── */}
      <div className="services">
        <section className="services-header fade-up" style={{ animationDelay: '0s' }}>
          <h1 className="services-heading">Services</h1>
        </section>

        <section className="services-grid fade-up" style={{ animationDelay: '0.1s' }}>
          {SERVICES.map(s => (
            <div key={s.num} className="service-card">
              <span className="service-card-num">{s.num}</span>
              <h3 className="service-card-title">{s.title}</h3>
              <p className="service-card-desc">{s.desc}</p>
              <ul className="service-card-bullets">
                {s.bullets.map(b => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <PreFooter variant="mobile" onCta={() => go('contact')} />
      </div>

      {/* ── Desktop services (>=1024px) ── */}
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
          {DESKTOP_SERVICES.map(s => (
            <div className="dsvc-card" key={s.num}>
              <div className="dsvc-card-header">
                <span className="dsvc-card-num">{s.num}.</span>
                <h3 className="dsvc-card-title">{s.title}</h3>
                <p className="dsvc-card-desc">{s.desc}</p>
              </div>
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

        <PreFooter variant="desktop" onCta={goContactDesktop} />
      </div>
    </>
  )
}
