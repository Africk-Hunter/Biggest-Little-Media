import { useVideos } from '../hooks/useVideos'
import { useInView } from '../hooks/useInView'
import { useLazyVideoPlayback } from '../hooks/useLazyVideoPlayback'
import { MEDIA_WIDTH_DESKTOP, MEDIA_WIDTH_MOBILE, optimizedPosterUrl, optimizedVideoUrl } from '../lib/cloudinary'
import type { Video } from '../lib/videos'
import './Carousel.css'

const DESKTOP_CARD_WIDTH = MEDIA_WIDTH_DESKTOP
const MOBILE_CARD_WIDTH = MEDIA_WIDTH_MOBILE

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

// A video repeated many times over within one copy of the track only needs
// to actually stream once per copy — every other occurrence in that copy is
// a frozen poster frame, indistinguishable at marquee speed. Marks the first
// occurrence of each video id (within `base`, i.e. per track copy) as the
// live instance, then repeats that same pattern for the second, identical
// copy — deduping across both copies instead would leave the entire second
// copy frozen, since every id it contains already appeared once in the first.
function markPrimary(base: Video[]): boolean[] {
  const seen = new Set<string>()
  const primaryInBase = base.map(v => {
    const isPrimary = !seen.has(v.id)
    seen.add(v.id)
    return isPrimary
  })
  return [...primaryInBase, ...primaryInBase]
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
    if (!hasVideos) {
      const items = repeatToFill(Array.from({ length: DESKTOP_PLACEHOLDER_COUNT }), DESKTOP_MIN_COPY_ITEMS)
      const doubled = [...items, ...items]
      return (
        <div className="dcar-wrap">
          <div className="dcar-track" style={{ animationDuration: `${speedSeconds}s` }}>
            {doubled.map((_, i) => (
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

    const base = repeatToFill(videos!, DESKTOP_MIN_COPY_ITEMS)
    const items = [...base, ...base]
    const primary = markPrimary(base)
    return (
      <div className="dcar-wrap">
        <div className="dcar-track" style={{ animationDuration: `${speedSeconds}s` }}>
          {items.map((video, i) =>
            primary[i] ? (
              <DesktopVideoCard key={video.id + i} video={video} />
            ) : (
              <DesktopPosterCard key={video.id + i} video={video} />
            ),
          )}
        </div>
      </div>
    )
  }

  if (!hasVideos) {
    const items = repeatToFill(MOBILE_PLACEHOLDERS, MOBILE_MIN_COPY_ITEMS)
    const doubled = [...items, ...items]
    return (
      <div className="tiktok-carousel-wrap">
        <div className="tiktok-track">
          {doubled.map((placeholder, i) => (
            <div key={i} className="tiktok-card" style={{ backgroundColor: placeholder.bg }}>
              <div className="tiktok-card-bar">
                <div className="tiktok-card-bar-fill" style={{ width: `${placeholder.prog}%` }} />
              </div>
              <div className="tiktok-card-meta">
                <span className="tiktok-card-likes">♥ {placeholder.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const mobileBase = repeatToFill(videos!, MOBILE_MIN_COPY_ITEMS)
  const items = [...mobileBase, ...mobileBase]
  const primary = markPrimary(mobileBase)
  return (
    <div className="tiktok-carousel-wrap">
      <div className="tiktok-track">
        {items.map((video, i) =>
          primary[i] ? (
            <MobileVideoCard key={video.id + i} video={video} />
          ) : (
            <MobilePosterCard key={video.id + i} video={video} />
          ),
        )}
      </div>
    </div>
  )
}

function DesktopPosterCard({ video }: { video: Video }) {
  return (
    <div className="dcar-card dcar-card-video">
      <img className="dcar-poster" src={optimizedPosterUrl(video.posterUrl, DESKTOP_CARD_WIDTH)} alt="" loading="lazy" />
      <div className="dcar-scrim" />
      <span className="dcar-label dcar-label-video">{video.platform}</span>
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

function MobilePosterCard({ video }: { video: Video }) {
  return (
    <div className="tiktok-card tiktok-card-video">
      <img className="tiktok-poster" src={optimizedPosterUrl(video.posterUrl, MOBILE_CARD_WIDTH)} alt="" loading="lazy" />
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
