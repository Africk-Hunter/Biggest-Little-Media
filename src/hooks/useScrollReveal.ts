import { useEffect } from 'react'

// Elements that animate as one unit (never split into their children).
const ATOMIC = '[data-sr-unit], a,button, li, article, form, figure, picture, img, video, svg, input, textarea, h1, h2, h3, h4, h5, h6, p, [class*="card"], [class*="carousel"], [class*="grid"] > *'
// Never animated (they carry their own motion or are hidden helpers).
const SKIP = 'script, style, [hidden], [data-sr-off],[aria-hidden="true"][class*="sr-skip"], .sr-skip'
const STAGGER_MS = 90
const MAX_DELAY_MS = 900
const DURATION_MS = 700
function collectTargets(root: Element): HTMLElement[] {
  const out: HTMLElement[] = []
  const walk = (el: Element) => {
    for (const child of Array.from(el.children)) {
      if (!(child instanceof HTMLElement) || child.matches(SKIP)) continue
      if (getComputedStyle(child).display === 'none') continue
      if (child.matches(ATOMIC)) out.push(child)
      else if (child.children.length === 0) {
        if (child.textContent?.trim()) out.push(child)
      } else walk(child)
    }
  }
  walk(root)
  return out
}

// Fades each leaf element of the current page in one at a time as it scrolls
// into view. Elements revealed in the same observer batch are staggered.
export function useScrollReveal(rootSelector: string, key: string) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.querySelector(rootSelector)
    if (!root) return

    const timers = new Set<number>()
    // When arriving via a page transition, the first reveals slide in
    // horizontally (from the direction of travel) instead of rising.
    let slideClass: string | null = null
    const startedAt = performance.now()
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => {
          const ra = a.boundingClientRect
          const rb = b.boundingClientRect
          return ra.top - rb.top || ra.left - rb.left
        })
      visible.forEach((entry, i) => {
        const el = entry.target as HTMLElement
        observer.unobserve(el)
        const delay = Math.min(i * STAGGER_MS, MAX_DELAY_MS)
        el.style.setProperty('--sr-delay', `${delay}ms`)
        // Next frame so the hidden state is painted before transitioning.
        if (slideClass && performance.now() - startedAt < 900) {
          el.classList.add(slideClass)
          void el.offsetWidth // commit the start position before transitioning
        }
        requestAnimationFrame(() => el.classList.add('sr-in'))
        // Hand control back (hover transforms etc.) once the reveal is done.
        const t = window.setTimeout(() => {
          el.classList.remove('sr', 'sr-in', 'sr-from-left', 'sr-from-right')
          el.style.removeProperty('--sr-delay')
          timers.delete(t)
        }, delay + DURATION_MS + 100)
        timers.add(t)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })

    // Wait a frame so the page's own markup (and slide-in) has settled.
    const raf = requestAnimationFrame(() => {
      if (root.parentElement?.querySelector('.page-slide-out')) {
        slideClass = root.classList.contains('from-left') ? 'sr-from-left' : 'sr-from-right'
      }
      for (const el of collectTargets(root)) {
        el.classList.add('sr')
        observer.observe(el)
      }
    })

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      timers.forEach(t => window.clearTimeout(t))
      root.querySelectorAll('.sr').forEach(el => {
        el.classList.remove('sr', 'sr-in', 'sr-from-left', 'sr-from-right')
        ;(el as HTMLElement).style.removeProperty('--sr-delay')
      })
    }
  }, [rootSelector, key])
}
