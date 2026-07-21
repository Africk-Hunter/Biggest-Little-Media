import { useState } from 'react'
import { createPortal } from 'react-dom'
import emailjs from '@emailjs/browser'
import type { Page } from '../App'
import Carousel from '../components/Carousel'
import DevHeroArtTuner, { HERO_ART_DEFAULTS, heroArtCssVars, type HeroArtValues } from '../components/DevHeroArtTuner'
import { formatPhoneNumber } from '../utils/phone'
import { autoResizeTextarea } from '../utils/autoResize'
import './Home.css'

// Flip to true to bring back the hero art position/size tuner (bottom-left, dev only).
const SHOW_HERO_ART_TUNER = false

interface Props {
  go: (p: Page) => void
  goContactDesktop: () => void
}

export default function Home({ go, goContactDesktop }: Props) {
  const [formSent, setFormSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [heroArtValues, setHeroArtValues] = useState<HeroArtValues>(HERO_ART_DEFAULTS)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: name === 'phone' ? formatPhoneNumber(value) : value }))
    if (e.target instanceof HTMLTextAreaElement) autoResizeTextarea(e.target)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError(false)
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      )
      setFormSent(true)
    } catch (err) {
      console.error('EmailJS send failed:', err)
      setError(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {SHOW_HERO_ART_TUNER &&
        import.meta.env.DEV &&
        createPortal(
          <DevHeroArtTuner values={heroArtValues} setValues={setHeroArtValues} />,
          document.body
        )}

      {/* ── Mobile / tablet home (<1024px) ── */}
      <div className="home">
        {/* Hero */}
        <section className="home-hero">
          <div className="home-hero-text fade-up" style={{ animationDelay: '0s' }}>
            <h1 className="home-hero-headline">
              <span className="hero-biggest">BIGGEST</span>
              <span className="hero-little">little</span>
              <span className="hero-media">MEDIA</span>
            </h1>
            <p className="home-hero-tagline">
              Reno-vate your brand with a personalized online presence.
            </p>
            <div className="home-hero-ctas">
              <button className="btn-outline" onClick={() => go('contact')}>
                Contact Me ↑
              </button>
              <button className="btn-text-link" onClick={() => go('portfolio')}>
                View Portfolio
              </button>
            </div>
          </div>
        </section>

        {/* TikTok carousel */}
        <section className="home-carousel-section fade-up" style={{ animationDelay: '0.1s' }}>
          <p className="home-carousel-label">Featured Work</p>
          <Carousel variant="mobile" />
        </section>

        {/* Contact (also reachable via the dedicated Contact page) */}
        <section id="mob-contact-section" className="home-contact fade-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="home-contact-heading">Get In Touch</h2>
          <p className="home-contact-sub">Reach out and let's build something together.</p>

          <div className="home-contact-cards">
            <a href="mailto:biggestlittlemedia@gmail.com" className="home-contact-card">
              <div className="home-contact-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ede8d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="15" rx="2"></rect>
                  <polyline points="2,5 12,13 22,5"></polyline>
                </svg>
              </div>
              <div className="home-contact-text">
                <p className="home-contact-label">Email</p>
                <p className="home-contact-value">BiggestLittleMedia@gmail.com</p>
              </div>
            </a>
            <a
              href="https://www.instagram.com/biggestlittlemedia"
              target="_blank"
              rel="noopener noreferrer"
              className="home-contact-card"
            >
              <div className="home-contact-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ede8d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6"></path>
                </svg>
              </div>
              <div className="home-contact-text">
                <p className="home-contact-label">Social Media</p>
                <p className="home-contact-value">@BiggestLittleMedia</p>
              </div>
            </a>
          </div>

          {formSent ? (
            <div className="home-contact-success">
              <p className="home-contact-success-headline">Message Sent!</p>
              <p className="home-contact-success-sub">We'll be in touch soon.</p>
            </div>
          ) : (
            <form className="home-contact-form" onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
              <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} maxLength={14} />
              <textarea name="notes" placeholder="Other Notes" rows={4} value={form.notes} onChange={handleChange} />
              {error && <p className="home-contact-error">Something went wrong. Please try again or email us directly.</p>}
              <button type="submit" className="home-contact-send" disabled={sending}>{sending ? 'Sending...' : 'Send'}</button>
            </form>
          )}
        </section>
      </div>

      {/* ── Desktop home (>=1024px) ── */}
      <div className="dhome">
        {/* Hero */}
        <section className="dhome-hero" style={heroArtCssVars(heroArtValues)}>
          <div className="dhome-hero-art dhome-anim" style={{ animationDelay: '0.2s' }}>
            <img src="/Couch_no_bg.png" alt="" className="dhome-hero-art-img" />
          </div>
          <h1 className="dhome-headline dhome-anim" style={{ animationDelay: '0s' }}>
            Biggest <span className="dhome-script">little</span> Media
          </h1>
          <div className="dhome-hero-body">
            <p className="dhome-tagline dhome-anim" style={{ animationDelay: '0.14s' }}>
              Reno-vate your brand with a personalized online presence.
            </p>
            <div className="dhome-ctas dhome-anim" style={{ animationDelay: '0.26s' }}>
              <button className="dhome-btn-primary" onClick={goContactDesktop}>
                Contact Me →
              </button>
              <button className="dhome-btn-ghost" onClick={() => go('portfolio')}>
                View Portfolio
              </button>
            </div>
          </div>
        </section>

        {/* Carousel */}
        <section
          className="dhome-carousel-section dhome-anim dhome-carousel-section-link"
          style={{ animationDelay: '0.1s' }}
          onClick={() => go('portfolio')}
          role="link"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') go('portfolio')
          }}
        >
          <p className="dhome-carousel-label">Featured Work</p>
          <Carousel variant="desktop" speedSeconds={30} />
        </section>

        {/* Contact */}
        <section id="dsk-contact-section" className="dhome-contact">
          <div className="dhome-contact-inner dhome-anim" style={{ animationDelay: '0.1s' }}>
            <h2 className="dhome-contact-heading">Get In Touch</h2>
            <p className="dhome-contact-sub">Reach out and let's build something together.</p>

            <div className="dhome-contact-cards">
              <a href="mailto:biggestlittlemedia@gmail.com" className="dhome-contact-card">
                <div className="dhome-contact-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ede8d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="15" rx="2"></rect>
                    <polyline points="2,5 12,13 22,5"></polyline>
                  </svg>
                </div>
                <div className="dhome-contact-text">
                  <p className="dhome-contact-label">Email</p>
                  <p className="dhome-contact-value">BiggestLittleMedia@gmail.com</p>
                </div>
              </a>
              <a
                href="https://www.instagram.com/biggestlittlemedia"
                target="_blank"
                rel="noopener noreferrer"
                className="dhome-contact-card"
              >
                <div className="dhome-contact-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ede8d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"></circle>
                    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6"></path>
                  </svg>
                </div>
                <div className="dhome-contact-text">
                  <p className="dhome-contact-label">Social Media</p>
                  <p className="dhome-contact-value">@BiggestLittleMedia</p>
                </div>
              </a>
            </div>

            {formSent ? (
              <div className="dhome-success">
                <p className="dhome-success-headline">Message Sent!</p>
                <p className="dhome-success-sub">We'll be in touch soon.</p>
              </div>
            ) : (
              <form className="dhome-form" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
                <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} maxLength={14} />
                <textarea name="notes" placeholder="Other Notes" rows={5} value={form.notes} onChange={handleChange} />
                {error && <p className="dhome-contact-error">Something went wrong. Please try again or email us directly.</p>}
                <button type="submit" className="dhome-send" disabled={sending}>{sending ? 'Sending...' : 'Send'}</button>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
