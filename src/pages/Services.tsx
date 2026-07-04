import type { Page } from '../App'
import './Services.css'

interface Props {
  go: (p: Page) => void
}

const SERVICES = [
  {
    num: '01',
    title: 'Social Media Management',
    desc: 'Strategic social presence built around your brand voice and community.',
    bullets: [
      'Content scheduling & calendar planning',
      'Active community engagement',
      'Consistent brand storytelling',
      'Performance tracking & reporting',
    ],
  },
  {
    num: '02',
    title: 'Marketing Strategies',
    desc: 'Data-informed plans that help your brand reach the right audience.',
    bullets: [
      'Brand & market analysis',
      'Competitor landscape review',
      'Target audience identification',
      'Growth roadmap & KPI setting',
    ],
  },
  {
    num: '03',
    title: 'Business & Brand Consulting',
    desc: 'One-on-one sessions to sharpen your positioning and voice.',
    bullets: [
      '1:1 consulting sessions',
      'Brand voice & messaging review',
      'Growth recommendations',
      'Online presence evaluation',
    ],
  },
  {
    num: '04',
    title: 'Social Media Audits',
    desc: 'A clear-eyed look at what\'s working and what needs to change.',
    bullets: [
      'Full profile audit',
      'Content quality review',
      'Prioritized recommendations',
      'Actionable improvement plan',
    ],
  },
]

export default function Services({ go }: Props) {
  return (
    <div className="services">
      <section className="services-header">
        <h1 className="services-heading">Services</h1>
      </section>

      <section className="services-grid">
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

      <section className="services-cta">
        <p className="services-cta-text">
          Ready to grow your brand?
        </p>
        <button className="btn-outline-dark" onClick={() => go('contact')}>
          Get in Touch
        </button>
      </section>
    </div>
  )
}
