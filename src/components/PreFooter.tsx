import './PreFooter.css'

interface Props {
  variant: 'mobile' | 'desktop'
  onCta: () => void
}

export default function PreFooter({ variant, onCta }: Props) {
  if (variant === 'desktop') {
    return (
      <section className="dprefooter dprefooter-anim">
        <div>
          <h2 className="dprefooter-heading">Let's build something great.</h2>
          <p className="dprefooter-sub">Your brand's story starts here.</p>
        </div>
        <button className="dprefooter-btn" onClick={onCta}>
          Get in Touch →
        </button>
      </section>
    )
  }

  return (
    <section className="prefooter fade-up">
      <h2 className="prefooter-heading">Let's build something great.</h2>
      <p className="prefooter-sub">Your brand's story starts here.</p>
      <button className="prefooter-btn" onClick={onCta}>
        Get in Touch →
      </button>
    </section>
  )
}
