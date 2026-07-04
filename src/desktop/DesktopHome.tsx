import { useState } from 'react'
import type { DesktopPage } from './DesktopApp'
import DesktopCarousel from './DesktopCarousel'
import './DesktopHome.css'

interface Props {
  go: (p: DesktopPage) => void
  goContact: () => void
}

export default function DesktopHome({ go, goContact }: Props) {
  const [formSent, setFormSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSent(true)
  }

  return (
    <div className="dhome">
      {/* Hero */}
      <section className="dhome-hero">
        <h1 className="dhome-headline dhome-anim" style={{ animationDelay: '0s' }}>
          Biggest <span className="dhome-script">little</span> Media
        </h1>
        <div className="dhome-hero-body">
          <p className="dhome-tagline dhome-anim" style={{ animationDelay: '0.14s' }}>
            Reno-vate your brand with a personalized online presence.
          </p>
          <div className="dhome-ctas dhome-anim" style={{ animationDelay: '0.26s' }}>
            <button className="dhome-btn-primary" onClick={goContact}>
              Contact Me →
            </button>
            <button className="dhome-btn-ghost" onClick={() => go('portfolio')}>
              View Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Carousel */}
      <section className="dhome-carousel-section">
        <p className="dhome-carousel-label">Featured Work</p>
        <DesktopCarousel speedSeconds={30} />
      </section>

      {/* Contact */}
      <section id="dsk-contact-section" className="dhome-contact">
        <div className="dhome-contact-inner">
          <h2 className="dhome-contact-heading">Get In Touch</h2>
          <p className="dhome-contact-sub">Reach out and let's build something together.</p>

          <div className="dhome-contact-cards">
            <a href="mailto:example@gmail.com" className="dhome-contact-card">
              <div className="dhome-contact-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ede8d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="15" rx="2"></rect>
                  <polyline points="2,5 12,13 22,5"></polyline>
                </svg>
              </div>
              <div className="dhome-contact-text">
                <p className="dhome-contact-label">Email</p>
                <p className="dhome-contact-value">example@gmail.com</p>
              </div>
            </a>
            <a href="#" className="dhome-contact-card">
              <div className="dhome-contact-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ede8d8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6"></path>
                </svg>
              </div>
              <div className="dhome-contact-text">
                <p className="dhome-contact-label">Social Media</p>
                <p className="dhome-contact-value">@ExampleHandle</p>
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
              <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
              <textarea name="notes" placeholder="Other Notes" rows={5} value={form.notes} onChange={handleChange} />
              <button type="submit" className="dhome-send">Send</button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
