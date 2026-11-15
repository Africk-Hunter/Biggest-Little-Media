import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Page } from '../App'
import PreFooter from '../components/PreFooter'
import './Services.css'

const TAGLINE = "Customized to your brand's needs."
/** Mobile: checklists this short are shown in full; longer ones sit behind a "What's included" toggle. */
const INLINE_BULLET_MAX = 3

interface Props {
  go: (p: Page) => void
  goContactDesktop: () => void
}

interface ServicePackage {
  name: string
  desc: string
  bullets: string[]
  /** Consecutive packages sharing a stage sit under one labelled heading. */
  stage?: string
  /** Small label above the card title. */
  eyebrow?: string
  /** Headline numbers shown as stats instead of a checklist. */
  specs?: { value: string; label: string }[]
}

interface ServiceCategory {
  key: string
  title: string
  /** Mobile only: label for the sticky jump chips. */
  short: string
  /** One-line intro under the chapter heading. */
  intro: string
  packages: ServicePackage[]
}

const DISCOVERY_CALL: ServicePackage = {
  name: 'Discovery Call',
  desc: "A no-pressure intro call to talk through your goals and see if we're the right fit to work together. Pricing varies and is discussed on the call based on your needs.",
  bullets: [],
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    key: 'strategy',
    title: 'Strategy & Consulting',
    short: 'Strategy',
    intro: 'Audits, plans and one-on-one advice for where your brand goes next.',
    packages: [
      {
        name: 'Social Media Audit',
        stage: 'Find your footing',
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
        stage: 'Find your footing',
        desc: 'Hourly, one-on-one time to work through marketing questions as they come up, no long-term commitment.',
        bullets: ['Marketing advice', 'Campaign brainstorming', 'Business growth recommendations'],
      },
      {
        name: 'Brand Strategy Consultation',
        stage: 'Build the plan',
        desc: 'A focused session to define how your brand looks, sounds, and connects with the people you want to reach.',
        bullets: ['Brand positioning', 'Target audience', 'Brand voice', 'Messaging', 'Customer experience', 'Brand audit'],
      },
      {
        name: 'Marketing Strategy',
        stage: 'Build the plan',
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
        stage: 'Build the plan',
        desc: 'A content roadmap that keeps your posting consistent, on-brand, and easy to follow month to month.',
        bullets: ['Content pillars', 'Posting strategy', 'Platform recommendations', 'Content ideas', 'Monthly calendar', 'Brand voice'],
      },
    ],
  },
  {
    key: 'content',
    title: 'Content Creation',
    short: 'Content',
    intro: 'Photo and video, shot and edited for your channels.',
    packages: [
      {
        name: 'Mini Content Session',
        desc: 'A monthly shoot sized for brands that need a steady stream of fresh content without a full production day.',
        bullets: ['4-hour session', '20–30 edited photos', '3–5 videos'],
        specs: [
          { value: '4 hr', label: 'session' },
          { value: '20–30', label: 'edited photos' },
          { value: '3–5', label: 'videos' },
        ],
      },
      {
        name: 'Content Day',
        desc: 'A full day dedicated to capturing a bigger batch of photo and video content in one sitting.',
        bullets: ['8-hour session', '30+ photos', '5+ videos'],
        specs: [
          { value: '8 hr', label: 'session' },
          { value: '30+', label: 'photos' },
          { value: '5+', label: 'videos' },
        ],
      },
      {
        name: 'Editing & Event Coverage',
        desc: 'Standalone editing and on-site event coverage for whenever you need extra hands without booking a full session.',
        bullets: ['Video editing', 'Photo editing', 'Event coverage'],
      },
    ],
  },
  {
    key: 'website',
    title: 'Website',
    short: 'Website',
    intro: 'Make sure your site says the right things and turns visitors into clients.',
    packages: [
      {
        name: 'Website Strategy',
        eyebrow: 'Step 1 · Plan it',
        desc: 'A plan for what your website needs to say and do before a single page gets built or rewritten.',
        bullets: ['Website goals', 'Customer journey', 'Page recommendations', 'Messaging', 'Conversion strategy'],
      },
      {
        name: 'Website Audit',
        eyebrow: 'Step 2 · Check it',
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
        eyebrow: 'Step 3 · Keep it working',
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

/** Splits a category's packages into consecutive runs that share a stage label. */
function groupByStage(packages: ServicePackage[]) {
  const groups: { stage?: string; packages: ServicePackage[] }[] = []
  for (const pkg of packages) {
    const last = groups[groups.length - 1]
    if (last && last.stage === pkg.stage) last.packages.push(pkg)
    else groups.push({ stage: pkg.stage, packages: [pkg] })
  }
  return groups
}

/** Mobile service card: title, description, then stats, a short checklist, or a "What's included" toggle. */
function MobileCard({
  pkg,
  id,
  heading: Heading,
  open,
  onToggle,
}: {
  pkg: ServicePackage
  id: string
  heading: 'h3' | 'h4'
  open: boolean
  onToggle: () => void
}) {
  const checks = (
    <ul className="svc-checks">
      {pkg.bullets.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )

  let contents
  if (pkg.specs) {
    contents = (
      <dl className="svc-specs">
        {pkg.specs.map(s => (
          <div className="svc-spec" key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
    )
  } else if (pkg.bullets.length <= INLINE_BULLET_MAX) {
    contents = checks
  } else {
    contents = (
      <>
        <button className="svc-includes-toggle" aria-expanded={open} aria-controls={id} onClick={onToggle}>
          What's included
          <span className="svc-includes-count">{pkg.bullets.length}</span>
          <span className="svc-chevron" aria-hidden="true" />
        </button>
        <div className="svc-includes" id={id} data-open={open}>
          <div className="svc-includes-inner">{checks}</div>
        </div>
      </>
    )
  }

  return (
    <article className={`svc-card${pkg.stage ? ' svc-card--dark' : ''}`}>
      <Heading className="svc-card-title">
        {pkg.eyebrow && <span className="svc-card-eyebrow">{pkg.eyebrow}</span>}
        {pkg.name}
      </Heading>
      <p className="svc-card-desc">{pkg.desc}</p>
      {contents}
    </article>
  )
}

export default function Services({ go, goContactDesktop }: Props) {
  const [openIncludes, setOpenIncludes] = useState<Record<string, boolean>>({})
  const toggleIncludes = (id: string) => setOpenIncludes(prev => ({ ...prev, [id]: !prev[id] }))

  const [activeKey, setActiveKey] = useState(SERVICE_CATEGORIES[0].key)
  const [showBar, setShowBar] = useState(false)
  const callRef = useRef<HTMLElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // Scroll-spy: highlight the last chapter whose top has passed 30% of the
  // viewport (the first one when above them all). Covers both the mobile (svc-)
  // and desktop (dsvc-) layouts; the hidden one has no offsetParent and is skipped.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight * 0.3
      let key = SERVICE_CATEGORIES[0].key
      for (const c of SERVICE_CATEGORIES) {
        const el =
          [document.getElementById(`svc-${c.key}`), document.getElementById(`dsvc-${c.key}`)].find(
            e => e && e.offsetParent !== null,
          ) ?? null
        if (el && el.getBoundingClientRect().top <= line) key = c.key
      }
      setActiveKey(key)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Mobile booking bar: shown once the Discovery Call card has scrolled away,
  // hidden again when the pre-footer (which has its own button) comes into view.
  useEffect(() => {
    const call = callRef.current
    const end = endRef.current
    if (!call || !end || !('IntersectionObserver' in window)) return
    let pastCall = false
    let atEnd = false
    const observer = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.target === call) pastCall = !e.isIntersecting && e.boundingClientRect.top < 0
        else atEnd = e.isIntersecting || e.boundingClientRect.top < 0
      }
      setShowBar(pastCall && !atEnd)
    })
    observer.observe(call)
    observer.observe(end)
    return () => observer.disconnect()
  }, [])

  const jumpTo = (key: string, prefix: 'svc' | 'dsvc') => {
    const el = document.getElementById(`${prefix}-${key}`)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    setActiveKey(key)
  }

  return (
    <>
      {/* ── Mobile / tablet services (<1024px) ── */}
      <div className="services">
        <header className="svc-hero">
          <h1 className="svc-heading">Services</h1>
          <p className="svc-tagline">{TAGLINE}</p>
        </header>

        <section className="svc-call" ref={callRef} aria-labelledby="svc-call-title">
          <span className="svc-call-eyebrow">
            <span className="svc-badge">Free</span>
            Start here
          </span>
          <h2 className="svc-call-title" id="svc-call-title">
            {DISCOVERY_CALL.name}
          </h2>
          <p className="svc-call-desc">{DISCOVERY_CALL.desc}</p>
          <button className="svc-call-btn" data-sr-off onClick={() => go('contact')}>
            Book your free call <span aria-hidden="true">→</span>
          </button>
        </section>

        <nav className="svc-jump" aria-label="Service categories" data-sr-off>
          <ul>
            {SERVICE_CATEGORIES.map((cat, i) => (
              <li key={cat.key}>
                <button
                  className={`svc-jump-chip${activeKey === cat.key ? ' is-active' : ''}`}
                  aria-current={activeKey === cat.key ? 'true' : undefined}
                  onClick={() => jumpTo(cat.key, 'svc')}
                >
                  <span className="svc-jump-num" aria-hidden="true">0{i + 1}</span>
                  {cat.short}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {SERVICE_CATEGORIES.map((cat, i) => (
          <section key={cat.key} id={`svc-${cat.key}`} className="svc-chapter" aria-labelledby={`svc-${cat.key}-title`}>
            <header className="svc-chapter-head">
              <span className="svc-chapter-num" aria-hidden="true">0{i + 1}</span>
              <div>
                <h2 className="svc-chapter-title" id={`svc-${cat.key}-title`}>
                  {cat.title}
                </h2>
                <p className="svc-chapter-intro">{cat.intro}</p>
              </div>
            </header>

            {groupByStage(cat.packages).map(group => {
              const isSteps = group.packages.every(p => p.eyebrow)
              return (
                <div className="svc-group" key={group.stage ?? 'all'}>
                  {group.stage && <h3 className="svc-stage">{group.stage}</h3>}
                  <div className={`svc-cards${isSteps ? ' svc-cards--steps' : ''}`}>
                    {group.packages.map((pkg, n) => {
                      const id = `svc-inc-${cat.key}-${n}-${group.stage ?? 'all'}`.replace(/\s+/g, '-').toLowerCase()
                      return (
                        <MobileCard
                          key={pkg.name}
                          pkg={pkg}
                          id={id}
                          heading={group.stage ? 'h4' : 'h3'}
                          open={!!openIncludes[id]}
                          onToggle={() => toggleIncludes(id)}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </section>
        ))}

        <div ref={endRef} className="svc-end" aria-hidden="true" />
        <PreFooter variant="mobile" onCta={() => go('contact')} />

        <div className={`svc-bar${showBar ? ' is-visible' : ''}`} data-sr-off>
          <span className="svc-bar-text">
            <span className="svc-badge">Free</span>
            <span className="svc-bar-label">Discovery Call</span>
          </span>
          <button className="svc-bar-btn" onClick={() => go('contact')} tabIndex={showBar ? undefined : -1}>
            Book a call
          </button>
        </div>
      </div>

      {/* ── Desktop services (>=1024px) ── */}
      <div className="dsvc">
        <section className="dsvc-hero">
          <div className="dsvc-hero-text">
            <h1 className="dsvc-heading">Services</h1>
            <p className="dsvc-tagline">{TAGLINE}</p>
          </div>

          <aside className="dsvc-call" data-sr-unit aria-labelledby="dsvc-call-title">
            <span className="dsvc-call-eyebrow">
              <span className="dsvc-cta-badge">Free</span>
              Start here
            </span>
            <h2 className="dsvc-call-title" id="dsvc-call-title">
              {DISCOVERY_CALL.name}
            </h2>
            <p className="dsvc-call-desc">{DISCOVERY_CALL.desc}</p>
            <button className="dsvc-call-btn" onClick={goContactDesktop}>
              Book your free call <span aria-hidden="true">→</span>
            </button>
          </aside>
        </section>

        <div className="dsvc-body">
          <aside className="dsvc-rail">
            <nav className="dsvc-rail-nav" aria-label="Service categories">
              <span className="dsvc-rail-label">Jump to</span>
              <ul>
                {SERVICE_CATEGORIES.map((cat, i) => (
                  <li key={cat.key}>
                    <button
                      className={`dsvc-rail-link${activeKey === cat.key ? ' is-active' : ''}`}
                      aria-current={activeKey === cat.key ? 'true' : undefined}
                      onClick={() => jumpTo(cat.key, 'dsvc')}
                    >
                      <span className="dsvc-rail-num">0{i + 1}</span>
                      <span className="dsvc-rail-name">{cat.title}</span>
                      <span className="dsvc-rail-count">{cat.packages.length}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="dsvc-rail-cta" data-sr-off>
              <span className="dsvc-cta-badge">Free</span>
              <h2 className="dsvc-cta-title">{DISCOVERY_CALL.name}</h2>
              <p className="dsvc-cta-desc">Not sure where to start? Let's talk it through.</p>
              <button className="dsvc-cta-btn" onClick={goContactDesktop}>
                Book a Call
              </button>
            </div>
          </aside>

          <div className="dsvc-main">
            {SERVICE_CATEGORIES.map((cat, i) => (
              <section key={cat.key} id={`dsvc-${cat.key}`} className="dsvc-chapter">
                <header className="dsvc-chapter-head" data-sr-unit>
                  <span className="dsvc-chapter-num">0{i + 1}</span>
                  <div>
                    <h2 className="dsvc-chapter-title">{cat.title}</h2>
                    <p className="dsvc-chapter-intro">{cat.intro}</p>
                  </div>
                </header>

                {groupByStage(cat.packages).map((group, gi) => (
                  <div className="dsvc-group" key={group.stage ?? 'all'}>
                    {group.stage && <h3 className="dsvc-stage">{group.stage}</h3>}
                    <div className={`dsvc-tiles dsvc-tiles--n${group.packages.length}`}>
                      {group.packages.map(pkg => (
                        <article className={`dsvc-tile${pkg.stage ? ' dsvc-tile--dark' : ''}`} key={pkg.name} {...(i === 0 && gi === 0 ? { 'data-sr-off': '', 'data-hero': '' } : {})}>
                          <h4 className="dsvc-tile-title">
                            {pkg.eyebrow && <span className="dsvc-tile-eyebrow">{pkg.eyebrow}</span>}
                            {pkg.name}
                          </h4>
                          <p className="dsvc-tile-desc">{pkg.desc}</p>
                          {pkg.specs ? (
                            <dl className="dsvc-specs">
                              {pkg.specs.map(s => (
                                <div className="dsvc-spec" key={s.label}>
                                  <dt>{s.label}</dt>
                                  <dd>{s.value}</dd>
                                </div>
                              ))}
                            </dl>
                          ) : (
                            <div className="dsvc-includes">
                              <span className="dsvc-includes-label">Includes</span>
                              <ul className="dsvc-checks">
                                {pkg.bullets.map((item, n) => (
                                  <li key={item} style={{ '--n': n } as CSSProperties}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>

        <PreFooter variant="desktop" onCta={goContactDesktop} />
      </div>
    </>
  )
}
