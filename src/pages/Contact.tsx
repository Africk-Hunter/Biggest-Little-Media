import { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [formSent, setFormSent] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSent(true)
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
              biggestlittlemedia@gmail.com
            </a>
          </div>
          <div className="contact-info-card">
            <span className="contact-info-label">Social Media</span>
            <a href="#" className="contact-info-value">@biggestlittlemedia</a>
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
              <button type="submit" className="contact-submit">
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
