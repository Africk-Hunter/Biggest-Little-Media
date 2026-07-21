import { useState } from 'react'
import emailjs from '@emailjs/browser'
import './Contact.css'

export default function Contact() {
  const [formSent, setFormSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
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
    <div className="contact">
      <section className="contact-header fade-up" style={{ animationDelay: '0s' }}>
        <h1 className="contact-heading">GET IN TOUCH</h1>
      </section>

      <section className="contact-body fade-up" style={{ animationDelay: '0.1s' }}>
        {/* Info cards */}
        <div className="contact-info-row">
          <div className="contact-info-card">
            <span className="contact-info-label">Email</span>
            <a href="mailto:biggestlittlemedia@gmail.com" className="contact-info-value">
              BiggestLittleMedia@gmail.com
            </a>
          </div>
          <div className="contact-info-card">
            <span className="contact-info-label">Social Media</span>
            <a
              href="https://www.instagram.com/biggestlittlemedia"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-info-value"
            >
              @BiggestLittleMedia
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="contact-form-wrap">
          {formSent ? (
            <div className="contact-success">
              <p className="contact-success-headline">Message Sent!</p>
              <p className="contact-success-sub">We'll be in touch soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <textarea
                  name="notes"
                  placeholder="Other Notes"
                  rows={4}
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>
              {error && (
                <p className="contact-error">
                  Something went wrong sending your message. Please try again or email us directly.
                </p>
              )}
              <button type="submit" className="contact-submit" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
