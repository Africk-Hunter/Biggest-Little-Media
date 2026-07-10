import { useEffect, useRef, useState } from 'react'
import { useVideos } from '../hooks/useVideos'
import { useInView } from '../hooks/useInView'
import { optimizedPosterUrl, optimizedVideoUrl } from '../lib/cloudinary'
import type { Video } from '../lib/videos'
import './Carousel.css'

// Card display sizes (doubled for retina) used to request right-sized
// renditions from Cloudinary instead of the full source file.
const DESKTOP_CARD_WIDTH = 440
const MOBILE_CARD_WIDTH = 280

const MOBILE_PLACEHOLDERS = [
  { bg: '#c8c0b8', likes: '3.2k', prog: 35 },
  { bg: '#b0a8a2', likes: '1.8k', prog: 58 },
  { bg: '#d0c8be', likes: '5.1k', prog: 22 },
  { bg: '#c0b8b0', likes: '2.7k', prog: 47 },
  { bg: '#b8b0a8', likes: '4.3k', prog: 70 },
  { bg: '#cac2ba', likes: '1.1k', prog: 51 },
]

const DESKTOP_PLACEHOLDER_COUNT = 7

// Each half of the marquee (before it's doubled for the seamless -50% loop)
// must itself be wider than the widest viewport we render at, or the loop
// shows a gap of empty track before snapping back to the start. These floors
// are sized for card-width + gap at each breakpoint (desktop ~3840px 4K,
// mobile <1024px per the CSS breakpoint).
const DESKTOP_MIN_COPY_ITEMS = 18
const MOBILE_MIN_COPY_ITEMS = 8

function repeatToFill<T>(list: T[], minCount: number): T[] {
  if (list.length === 0) return list
  const copies = Math.ceil(minCount / list.length)
  return Array.from({ length: copies }, () => list).flat()
}

interface Props {
  variant: 'mobile' | 'desktop'
  speedSeconds?: number
}

// The marquee tracks below are always rendered as two identical back-to-back
// copies of an item list, then animated by exactly -50% (see the `ticker` /
// `dskScrollCarousel` keyframes). That's only seamless if each copy is wider
// than the viewport, so `repeatToFill` pads sparse video lists first.
export default function Carousel({ variant, speedSeconds = 30 }: Props) {
  const videos = useVideos('home-carousel')
  const hasVideos = videos !== null && videos.length > 0

  if (variant === 'desktop') {
    const base = hasVideos
      ? repeatToFill(videos!, DESKTOP_MIN_COPY_ITEMS)
      : repeatToFill(Array.from({ length: DESKTOP_PLACEHOLDER_COUNT }), DESKTOP_MIN_COPY_ITEMS)
    const items = [...base, ...base]
    return (
      <div className="dcar-wrap">
        <div className="dcar-track" style={{ animationDuration: `${speedSeconds}s` }}>
          {items.map((item, i) =>
            hasVideos ? (
              <DesktopVideoCard key={(item as Video).id + i} video={item as Video} />
            ) : (
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
            ),
          )}
        </div>
      </div>
    )
  }

  const mobileBase = hasVideos ? repeatToFill(videos!, MOBILE_MIN_COPY_ITEMS) : repeatToFill(MOBILE_PLACEHOLDERS, MOBILE_MIN_COPY_ITEMS)
  const items = [...mobileBase, ...mobileBase]
  return (
    <div className="tiktok-carousel-wrap">
      <div className="tiktok-track">
        {items.map((item, i) =>
          hasVideos ? (
            <MobileVideoCard key={(item as Video).id + i} video={item as Video} />
          ) : (
            <div key={i} className="tiktok-card" style={{ backgroundColor: (item as typeof MOBILE_PLACEHOLDERS[number]).bg }}>
              <div className="tiktok-card-bar">
                <div className="tiktok-card-bar-fill" style={{ width: `${(item as typeof MOBILE_PLACEHOLDERS[number]).prog}%` }} />
              </div>
              <div className="tiktok-card-meta">
                <span className="tiktok-card-likes">♥ {(item as typeof MOBILE_PLACEHOLDERS[number]).likes}</span>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}

function DesktopVideoCard({ video }: { video: Video }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const { loaded, videoRef } = useLazyVideoPlayback(inView)

  return (
    <div className="dcar-card dcar-card-video" ref={ref}>
      {loaded ? (
        <video
          ref={videoRef}
          src={optimizedVideoUrl(video.videoUrl, DESKTOP_CARD_WIDTH)}
          poster={video.posterUrl}
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img className="dcar-poster" src={optimizedPosterUrl(video.posterUrl, DESKTOP_CARD_WIDTH)} alt="" />
      )}
      <div className="dcar-scrim" />
      <span className="dcar-label dcar-label-video">{video.platform}</span>
    </div>
  )
}

function MobileVideoCard({ video }: { video: Video }) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const { loaded, videoRef } = useLazyVideoPlayback(inView)

  return (
    <div className="tiktok-card tiktok-card-video" ref={ref}>
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
        <img className="tiktok-poster" src={optimizedPosterUrl(video.posterUrl, MOBILE_CARD_WIDTH)} alt="" />
      )}
    </div>
  )
}

// Once a card has scrolled into view, keeps its <video> mounted (avoids
// remount jank as the marquee loops it back into frame) and drives
// play/pause off visibility so the browser isn't decoding dozens of
// duplicated marquee copies at once. `loaded` is included as its own play
// effect dependency (not just `inView`) because the <video> element only
// mounts a render *after* `inView` first flips true — without it the play
// effect fires before the ref exists and never re-fires once it does.
function useLazyVideoPlayback(inView: boolean) {
  const [loaded, setLoaded] = useState(inView)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (inView) setLoaded(true)
  }, [inView])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (inView) el.play().catch(() => {})
    else el.pause()
  }, [inView, loaded])

  return { loaded, videoRef }
}
