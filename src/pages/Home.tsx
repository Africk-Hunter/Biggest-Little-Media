import type { Page } from '../App'
import TikTokCarousel from '../components/TikTokCarousel'
import './Home.css'

interface Props {
  go: (p: Page) => void
}

export default function Home({ go }: Props) {
  return (
    <div className="home">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-text">
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
      <section className="home-carousel-section">
        <p className="home-carousel-label">Social Content</p>
        <TikTokCarousel />
      </section>

      {/* Services teaser */}
      <section className="home-services-teaser">
        <div className="home-services-inner">
          <h2 className="section-heading">What I Do</h2>
          <p className="home-services-copy">
            From strategy to execution — I help small businesses in Reno and beyond
            build intentional, growth-focused social media presences.
          </p>
          <button className="btn-outline" onClick={() => go('services')}>
            View Services
          </button>
        </div>
      </section>
    </div>
  )
}
