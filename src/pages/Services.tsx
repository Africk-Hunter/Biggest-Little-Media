import { useState } from 'react'
import type { Page } from '../App'
import PreFooter from '../components/PreFooter'
import './Services.css'

const VISIBLE_COUNT = 3
const BULLET_VISIBLE_COUNT = 3

interface Props {
  go: (p: Page) => void
  goContactDesktop: () => void
}

interface ServicePackage {
  name: string
  price: string
  desc: string
  bullets: string[]
}

interface ServiceCategory {
  key: string
  title: string
  packages: ServicePackage[]
}

const DISCOVERY_CALL: ServicePackage = {
  name: 'Discovery Call',
  price: 'Free',
  desc: "A no-pressure intro call to talk through your goals and see if we're the right fit to work together.",
  bullets: [],
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    key: 'strategy',
    title: 'Strategy & Consulting',
    packages: [
      {
        name: 'Social Media Audit',
        price: '$250 / audit',
        desc: 'A deep dive into your current presence, from profile setup to how you stack up against competitors.',
        bullets: [
          'Profile review',
          'Branding consistency',
          'Content analysis',
          'Engagement review',
          'Competitor comparison',
          'Growth opportunities',
          'Action plan',
        ],
      },
      {
        name: 'Marketing Consultation',
        price: '$150 / hour',
        desc: 'Hourly, one-on-one time to work through marketing questions as they come up, no long-term commitment.',
        bullets: ['Marketing advice', 'Campaign brainstorming', 'Business growth recommendations'],
      },
      {
        name: 'Brand Strategy Consultation',
        price: '$500 / session',
        desc: 'A focused session to define how your brand looks, sounds, and connects with the people you want to reach.',
        bullets: ['Brand positioning', 'Target audience', 'Brand voice', 'Messaging', 'Customer experience', 'Brand audit'],
      },
      {
        name: 'Marketing Strategy',
        price: '$700 / project',
        desc: 'A complete marketing plan built around your goals, your audience, and a budget that makes sense.',
        bullets: [
          'Marketing research',
          'Target audience',
          'Goals',
          'Marketing channels',
          'Campaign ideas',
          'Budget recommendations',
          'Action plan',
        ],
      },
      {
        name: 'Content Strategy',
        price: '$500 / project',
        desc: 'A content roadmap that keeps your posting consistent, on-brand, and easy to follow month to month.',
        bullets: ['Content pillars', 'Posting strategy', 'Platform recommendations', 'Content ideas', 'Monthly calendar', 'Brand voice'],
      },
    ],
  },
  {
    key: 'content',
    title: 'Content Creation',
    packages: [
      {
        name: 'Mini Content Session',
        price: '$500 / month',
        desc: 'A monthly shoot sized for brands that need a steady stream of fresh content without a full production day.',
        bullets: ['4-hour session', '20–30 edited photos', '3–5 videos'],
      },
      {
        name: 'Content Day',
        price: '$1,000',
        desc: 'A full day dedicated to capturing a bigger batch of photo and video content in one sitting.',
        bullets: ['8-hour session', '30+ photos', '5+ videos'],
      },
      {
        name: 'Editing & Event Coverage',
        price: '',
        desc: 'Standalone editing and on-site event coverage for whenever you need extra hands without booking a full session.',
        bullets: ['Video editing: $75 / video', 'Photo editing: $20 / photo', 'Event coverage: $200 / hour'],
      },
    ],
  },
  {
    key: 'website',
    title: 'Website',
    packages: [
      {
        name: 'Website Strategy',
        price: '$500 / job',
        desc: 'A plan for what your website needs to say and do before a single page gets built or rewritten.',
        bullets: ['Website goals', 'Customer journey', 'Page recommendations', 'Messaging', 'Conversion strategy'],
      },
      {
        name: 'Website Audit',
        price: '$250 / audit or month',
        desc: 'A thorough review of how your site looks, reads, and performs, plus what to fix first.',
        bullets: [
          'Website performance',
          'User experience',
          'Branding consistency',
          'Visual consistency',
          'Messaging & copy review',
          'Conversion optimization',
          'SEO basics',
          'Competitor comparison',
          'Recommendations report',
        ],
      },
      {
        name: 'Website Optimization',
        price: '$750 / month',
        desc: 'Ongoing, hands-on improvements to keep your site converting and current, month over month.',
        bullets: [
          'Website updates',
          'Conversion improvements',
          'Analytics review',
          'Rewrite website copy',
          'Improve structure',
          'Update visuals',
          'Connect website + social media',
        ],
      },
    ],
  },
]

export default function Services({ go, goContactDesktop }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const toggle = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const toggleCard = (key: string) => setExpandedCards(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <>
      {/* ── Mobile / tablet services (<1024px) ── */}
      <div className="services">
        <section className="services-header fade-up" style={{ animationDelay: '0s' }}>
          <h1 className="services-heading">Services</h1>
        </section>

        <section className="discovery-cta fade-up" style={{ animationDelay: '0.05s' }}>
          <span className="discovery-cta-badge">Free</span>
          <h2 className="discovery-cta-title">{DISCOVERY_CALL.name}</h2>
          <p className="discovery-cta-desc">{DISCOVERY_CALL.desc}</p>
          <button className="discovery-cta-btn" onClick={() => go('contact')}>
            Book a Call
          </button>
        </section>

        {SERVICE_CATEGORIES.map((cat, i) => {
          const isExpanded = !!expanded[cat.key]
          const visiblePackages = isExpanded ? cat.packages : cat.packages.slice(0, VISIBLE_COUNT)
          const hiddenCount = cat.packages.length - VISIBLE_COUNT
          return (
            <section key={cat.key} className="services-category fade-up" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
              <h2 className="services-category-title">{cat.title}</h2>
              <div className="services-grid">
                {visiblePackages.map(pkg => {
                  const cardKey = `${cat.key}-${pkg.name}`
                  const cardExpanded = !!expandedCards[cardKey]
                  const bullets = cardExpanded ? pkg.bullets : pkg.bullets.slice(0, BULLET_VISIBLE_COUNT)
                  const hiddenBullets = pkg.bullets.length - BULLET_VISIBLE_COUNT
                  return (
                    <div key={pkg.name} className="service-card">
                      <div className="service-card-top">
                        <h3 className="service-card-title">{pkg.name}</h3>
                        {pkg.price && <span className="service-card-price">{pkg.price}</span>}
                      </div>
                      <p className="service-card-desc">{pkg.desc}</p>
                      {bullets.length > 0 && (
                        <ul className="service-card-bullets">
                          {bullets.map(b => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      )}
                      {hiddenBullets > 0 && (
                        <button className="service-card-toggle" onClick={() => toggleCard(cardKey)}>
                          {cardExpanded ? 'Show less' : `+${hiddenBullets} more`}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
              {hiddenCount > 0 && (
                <button className="services-more-btn" onClick={() => toggle(cat.key)}>
                  {isExpanded ? 'Show less' : `Show ${hiddenCount} more`}
                </button>
              )}
            </section>
          )
        })}

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

        <div className="dsvc-body">
          <section className="dsvc-cta">
            <div className="dsvc-cta-text">
              <span className="dsvc-cta-badge">Free</span>
              <h2 className="dsvc-cta-title">{DISCOVERY_CALL.name}</h2>
              <p className="dsvc-cta-desc">{DISCOVERY_CALL.desc}</p>
            </div>
            <button className="dsvc-cta-btn" onClick={goContactDesktop}>
              Book a Call
            </button>
          </section>

          <div className="dsvc-columns">
            {SERVICE_CATEGORIES.map(cat => {
              const isExpanded = !!expanded[cat.key]
              const visiblePackages = isExpanded ? cat.packages : cat.packages.slice(0, VISIBLE_COUNT)
              const hiddenCount = cat.packages.length - VISIBLE_COUNT
              return (
                <div key={cat.key} className="dsvc-column">
                  <h2 className="dsvc-category-title">{cat.title}</h2>
                  {visiblePackages.map(pkg => {
                    const cardKey = `${cat.key}-${pkg.name}`
                    const cardExpanded = !!expandedCards[cardKey]
                    const items = cardExpanded ? pkg.bullets : pkg.bullets.slice(0, BULLET_VISIBLE_COUNT)
                    const hiddenItems = pkg.bullets.length - BULLET_VISIBLE_COUNT
                    return (
                      <div className="dsvc-card" key={pkg.name}>
                        <div className="dsvc-card-header">
                          <div className="dsvc-card-top">
                            <h3 className="dsvc-card-title">{pkg.name}</h3>
                            {pkg.price && <span className="dsvc-card-price">{pkg.price}</span>}
                          </div>
                          <p className="dsvc-card-desc">{pkg.desc}</p>
                        </div>
                        {items.length > 0 && (
                          <ul className="dsvc-card-items">
                            {items.map(item => (
                              <li key={item}>
                                <span className="dsvc-dot" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                        {hiddenItems > 0 && (
                          <button className="dsvc-card-toggle" onClick={() => toggleCard(cardKey)}>
                            {cardExpanded ? 'Show less' : `+${hiddenItems} more`}
                          </button>
                        )}
                      </div>
                    )
                  })}
                  {hiddenCount > 0 && (
                    <button className="dsvc-more-btn" onClick={() => toggle(cat.key)}>
                      {isExpanded ? 'Show less' : `Show ${hiddenCount} more`}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <PreFooter variant="desktop" onCta={goContactDesktop} />
      </div>
    </>
  )
}
