import { useEffect, useRef, useState } from 'react'

// Once a card has scrolled into view, keeps its <video> mounted (avoids
// remount jank as e.g. a marquee loops it back into frame) and drives
// play/pause off visibility so the browser isn't decoding offscreen video.
// `loaded` is included as its own play effect dependency (not just `inView`)
// because the <video> element only mounts a render *after* `inView` first
// flips true — without it the play effect fires before the ref exists and
// never re-fires once it does.
export function useLazyVideoPlayback(inView: boolean) {
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
