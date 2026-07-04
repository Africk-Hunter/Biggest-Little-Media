import './TikTokCarousel.css'

const CARDS = [
  { bg: '#c8c0b8', likes: '3.2k', prog: 35 },
  { bg: '#b0a8a2', likes: '1.8k', prog: 58 },
  { bg: '#d0c8be', likes: '5.1k', prog: 22 },
  { bg: '#c0b8b0', likes: '2.7k', prog: 47 },
  { bg: '#b8b0a8', likes: '4.3k', prog: 70 },
  { bg: '#cac2ba', likes: '1.1k', prog: 51 },
]

// Duplicate for seamless loop
const ALL_CARDS = [...CARDS, ...CARDS]

export default function TikTokCarousel() {
  return (
    <div className="tiktok-carousel-wrap">
      <div className="tiktok-track">
        {ALL_CARDS.map((card, i) => (
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
