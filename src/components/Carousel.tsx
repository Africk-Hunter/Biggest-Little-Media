import './Carousel.css'

const MOBILE_CARDS = [
  { bg: '#c8c0b8', likes: '3.2k', prog: 35 },
  { bg: '#b0a8a2', likes: '1.8k', prog: 58 },
  { bg: '#d0c8be', likes: '5.1k', prog: 22 },
  { bg: '#c0b8b0', likes: '2.7k', prog: 47 },
  { bg: '#b8b0a8', likes: '4.3k', prog: 70 },
  { bg: '#cac2ba', likes: '1.1k', prog: 51 },
]
const ALL_MOBILE_CARDS = [...MOBILE_CARDS, ...MOBILE_CARDS]

const DESKTOP_CARDS = Array.from({ length: 7 }, (_, i) => i)
// 14 cards = 7 originals + 7 duplicates for a seamless infinite loop.
const ALL_DESKTOP_CARDS = [...DESKTOP_CARDS, ...DESKTOP_CARDS]

interface Props {
  variant: 'mobile' | 'desktop'
  speedSeconds?: number
}

export default function Carousel({ variant, speedSeconds = 30 }: Props) {
  if (variant === 'desktop') {
    return (
      <div className="dcar-wrap">
        <div className="dcar-track" style={{ animationDuration: `${speedSeconds}s` }}>
          {ALL_DESKTOP_CARDS.map((_, i) => (
            <div className="dcar-card" key={i}>
              <div className="dcar-texture" />
              <div className="dcar-play">
                <div className="dcar-play-tri" />
              </div>
              <span className="dcar-label">Social Clip</span>
              <div className="dcar-footer">
                <div className="dcar-avatar" />
                <div className="dcar-lines">
                  <div className="dcar-line dcar-line-1" />
                  <div className="dcar-line dcar-line-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="tiktok-carousel-wrap">
      <div className="tiktok-track">
        {ALL_MOBILE_CARDS.map((card, i) => (
          <div key={i} className="tiktok-card" style={{ backgroundColor: card.bg }}>
            <div className="tiktok-card-bar">
              <div className="tiktok-card-bar-fill" style={{ width: `${card.prog}%` }} />
            </div>
            <div className="tiktok-card-meta">
              <span className="tiktok-card-likes">♥ {card.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
