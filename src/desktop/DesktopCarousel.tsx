import './DesktopCarousel.css'

const CARDS = Array.from({ length: 7 }, (_, i) => i)
// 14 cards = 7 originals + 7 duplicates for a seamless infinite loop.
const ALL_CARDS = [...CARDS, ...CARDS]

interface Props {
  speedSeconds?: number
}

export default function DesktopCarousel({ speedSeconds = 30 }: Props) {
  return (
    <div className="dcar-wrap">
      <div className="dcar-track" style={{ animationDuration: `${speedSeconds}s` }}>
        {ALL_CARDS.map((_, i) => (
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
