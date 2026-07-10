import type { CSSProperties } from 'react'
import { useVideos } from '../hooks/useVideos'
import type { Video } from '../lib/videos'
import '../pages/Portfolio.css'

interface Props {
  variant: 'mobile' | 'desktop'
  className?: string
  style?: CSSProperties
}

const PLACEHOLDER_COUNT = [1, 2, 3]

function ComingSoonCard({ n }: { n: number }) {
  return (
    <div className="portfolio-item">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#252220" />
        <pattern id={`stripe-${n}`} patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="20" stroke="#2e2b28" strokeWidth="10" />
        </pattern>
        <rect width="400" height="300" fill={`url(#stripe-${n})`} opacity="0.5" />
        <text x="200" y="155" textAnchor="middle" fill="#454038" fontFamily="sans-serif" fontSize="13" letterSpacing="2">
          COMING SOON
        </text>
      </svg>
    </div>
  )
}

function MobileVideoCard({ video }: { video: Video }) {
  const content = (
    <div className="portfolio-item portfolio-item-video-wrap">
      <video src={video.videoUrl} poster={video.posterUrl} muted autoPlay loop playsInline />
    </div>
  )
  return video.sourceUrl ? (
    <a href={video.sourceUrl} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  )
}

function DesktopVideoCard({ video }: { video: Video }) {
  const content = (
    <div className="dport-card">
      <video className="dport-thumb dport-thumb-video" src={video.videoUrl} poster={video.posterUrl} muted autoPlay loop playsInline />
      <div className="dport-scrim" />
      <div className="dport-label">
        <span className="dport-platform">{video.platform}</span>
        <h3 className="dport-title">{video.title}</h3>
      </div>
    </div>
  )
  return video.sourceUrl ? (
    <a href={video.sourceUrl} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  )
}

// Renders the Portfolio page's video grid for either layout. Backed by
// live Firestore data for the 'portfolio-grid' placement; falls back to the
// original "coming soon" placeholders until BLM assigns real clips here.
export default function PortfolioGrid({ variant, className = '', style }: Props) {
  const videos = useVideos('portfolio-grid')
  const hasVideos = videos !== null && videos.length > 0

  if (variant === 'mobile') {
    return (
      <section className={`portfolio-grid ${className}`.trim()} style={style}>
        {hasVideos
          ? videos!.map(v => <MobileVideoCard key={v.id} video={v} />)
          : PLACEHOLDER_COUNT.map(n => <ComingSoonCard key={n} n={n} />)}
      </section>
    )
  }

  return (
    <section className={`dport-grid ${className}`.trim()} style={style}>
      {hasVideos
        ? videos!.map(v => <DesktopVideoCard key={v.id} video={v} />)
        : DESKTOP_PLACEHOLDER_CLIPS.map((clip, i) => (
            <div className="dport-card" key={i}>
              <div className="dport-thumb" />
              <div className="dport-play">
                <div className="dport-play-ring">
                  <div className="dport-play-tri" />
                </div>
              </div>
              <div className="dport-scrim" />
              <div className="dport-label">
                <span className="dport-platform">{clip.platform}</span>
                <h3 className="dport-title">{clip.title}</h3>
              </div>
            </div>
          ))}
    </section>
  )
}

const DESKTOP_PLACEHOLDER_CLIPS = [
  { platform: 'Instagram Reels', title: 'Short-Form Content' },
  { platform: 'TikTok', title: 'Short-Form Content' },
  { platform: 'Instagram Reels', title: 'Short-Form Content' },
]
