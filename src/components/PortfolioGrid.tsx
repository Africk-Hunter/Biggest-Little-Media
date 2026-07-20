import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { useVideos } from '../hooks/useVideos'
import { useInView } from '../hooks/useInView'
import { useLazyVideoPlayback } from '../hooks/useLazyVideoPlayback'
import { MEDIA_WIDTH_DESKTOP, MEDIA_WIDTH_MOBILE, optimizedPosterUrl, optimizedVideoUrl } from '../lib/cloudinary'
import type { Video } from '../lib/videos'
import '../pages/Portfolio.css'

interface Props {
  variant: 'mobile' | 'desktop'
  className?: string
  style?: CSSProperties
}

const PLACEHOLDER_COUNT = [1, 2, 3]

// Reuses Carousel's widths rather than picking new ones — most videos are
// assigned to both placements, so this way Cloudinary only has to generate
// one derivative per size instead of a second one just for this grid.
const MOBILE_CARD_WIDTH = MEDIA_WIDTH_MOBILE
const DESKTOP_CARD_WIDTH = MEDIA_WIDTH_DESKTOP

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

function MobileVideoCard({ video, onOpen }: { video: Video; onOpen: (video: Video) => void }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const { loaded, videoRef } = useLazyVideoPlayback(inView)

  return (
    <div className="portfolio-item portfolio-item-video-wrap" ref={ref} onClick={() => onOpen(video)}>
      {loaded ? (
        <video
          ref={videoRef}
          src={optimizedVideoUrl(video.videoUrl, MOBILE_CARD_WIDTH)}
          poster={video.posterUrl}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img src={optimizedPosterUrl(video.posterUrl, MOBILE_CARD_WIDTH)} alt="" />
      )}
    </div>
  )
}

function DesktopVideoCard({ video, onOpen }: { video: Video; onOpen: (video: Video) => void }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const { loaded, videoRef } = useLazyVideoPlayback(inView)

  return (
    <div className="dport-card" ref={ref} onClick={() => onOpen(video)}>
      {loaded ? (
        <video
          ref={videoRef}
          className="dport-thumb dport-thumb-video"
          src={optimizedVideoUrl(video.videoUrl, DESKTOP_CARD_WIDTH)}
          poster={video.posterUrl}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img className="dport-thumb dport-thumb-video" src={optimizedPosterUrl(video.posterUrl, DESKTOP_CARD_WIDTH)} alt="" />
      )}
      <div className="dport-scrim" />
      <div className="dport-label">
        <span className="dport-platform">{video.platform}</span>
        <h3 className="dport-title">{video.title}</h3>
      </div>
    </div>
  )
}

function VideoLightbox({ video, onClose }: { video: Video; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    const pausedVideos: HTMLVideoElement[] = []
    document.querySelectorAll('video').forEach(v => {
      if (v !== videoRef.current && !v.paused) {
        v.pause()
        pausedVideos.push(v)
      }
    })

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      pausedVideos.forEach(v => v.play().catch(() => {}))
    }
  }, [onClose])

  return createPortal(
    <div className="video-lightbox" onClick={onClose}>
      <button className="video-lightbox-close" onClick={onClose} aria-label="Close">
        &times;
      </button>
      <div className="video-lightbox-content" onClick={e => e.stopPropagation()}>
        <video
          ref={videoRef}
          className="video-lightbox-player"
          src={optimizedVideoUrl(video.videoUrl, DESKTOP_CARD_WIDTH)}
          poster={video.posterUrl}
          controls
          autoPlay
          playsInline
          onLoadedMetadata={e => {
            e.currentTarget.volume = 0.05
          }}
        />
      </div>
    </div>,
    document.body,
  )
}

// Renders the Portfolio page's video grid for either layout. Backed by
// live Firestore data for the 'portfolio-grid' placement; falls back to the
// original "coming soon" placeholders until BLM assigns real clips here.
export default function PortfolioGrid({ variant, className = '', style }: Props) {
  const videos = useVideos('portfolio-grid')
  const hasVideos = videos !== null && videos.length > 0
  const [openVideo, setOpenVideo] = useState<Video | null>(null)

  if (variant === 'mobile') {
    return (
      <section className={`portfolio-grid ${className}`.trim()} style={style}>
        {hasVideos
          ? videos!.map(v => <MobileVideoCard key={v.id} video={v} onOpen={setOpenVideo} />)
          : PLACEHOLDER_COUNT.map(n => <ComingSoonCard key={n} n={n} />)}
        {openVideo && <VideoLightbox video={openVideo} onClose={() => setOpenVideo(null)} />}
      </section>
    )
  }

  return (
    <section className={`dport-grid ${className}`.trim()} style={style}>
      {hasVideos
        ? videos!.map(v => <DesktopVideoCard key={v.id} video={v} onOpen={setOpenVideo} />)
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
      {openVideo && <VideoLightbox video={openVideo} onClose={() => setOpenVideo(null)} />}
    </section>
  )
}

const DESKTOP_PLACEHOLDER_CLIPS = [
  { platform: 'Instagram Reels', title: 'Short-Form Content' },
  { platform: 'TikTok', title: 'Short-Form Content' },
  { platform: 'Instagram Reels', title: 'Short-Form Content' },
]
