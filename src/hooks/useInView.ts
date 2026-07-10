import { useEffect, useRef, useState } from 'react'

// Tracks whether an element is on-screen. Used to defer fetching/decoding
// video until a card actually scrolls into view — an element hidden by an
// ancestor's `display: none` never intersects, so this also skips mounting
// video for a carousel variant that's currently hidden (e.g. mobile markup
// while on desktop).
export function useInView<T extends HTMLElement>(rootMargin = '200px') {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, inView }
}
