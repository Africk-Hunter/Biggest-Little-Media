import { useLayoutEffect } from 'react'

// Elements that animate as one unit (never split into their children).
const ATOMIC = '[data-sr-unit], a,button, li, article, form, figure, picture, img, video, svg, input, textarea, h1, h2, h3, h4, h5, h6, p, [class*="card"], [class*="carousel"], [class*="grid"] > *'
// Never animated (they carry their own motion or are hidden helpers).
const SKIP = 'script, style, [hidden], [data-sr-off],[aria-hidden="true"][class*="sr-skip"], .sr-skip'
const STAGGER_MS = 90
const MAX_DELAY_MS = 900
const DURATION_MS = 700
// True when an element draws something of its own (fill, border, shadow or a
// pseudo-element), so it would otherwise sit there while its contents fade in.
function paintsItself(el: HTMLElement): boolean {
  const cs = getComputedStyle(el)
  const bg = cs.backgroundColor
  if (bg !== 'transparent' && !/rgba?\(.*,\s*0\)$/.test(bg)) return true
  if (cs.backgroundImage !== 'none' || cs.boxShadow !== 'none') return true
  for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
    if (parseFloat(cs[`border${side}Width`]) > 0 && cs[`border${side}Style`] !== 'none') return true
  }
  for (const pseudo of ['::before', '::after']) {
    const c = getComputedStyle(el, pseudo).content
    if (c && c !== 'none' && c !== 'normal') return true
  }
  return false
}

const hasOwnText = (el: Element) =>
  Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim())

// `units` are revealed as one piece; `boxes` are painted wrappers that fade in
// alongside (but independently of) the children inside them.
function collectTargets(root: Element): { units: HTMLElement[]; boxes: HTMLElement[] } {
  const units: HTMLElement[] = []
  const boxes: HTMLElement[] = []
  const walk = (el: Element) => {
    for (const child of Array.from(el.children)) {
      if (!(child instanceof HTMLElement) || child.matches(SKIP)) continue
      if (getComputedStyle(child).display === 'none') continue
      if (child.matches(ATOMIC)) units.push(child)
      else if (child.children.length === 0) {
        if (child.textContent?.trim()) units.push(child)
      } else if (hasOwnText(child)) {
        units.push(child) // loose text next to child elements: move as one
      } else {
        if (paintsItself(child)) boxes.push(child)
        walk(child)
      }
    }
  }
  walk(root)
  return { units, boxes }
}

// Fades each leaf element of the current page in one at a time as it scrolls
// into view. Elements revealed in the same observer batch are staggered.
export function useScrollReveal(rootSelector: string, key: string) {
  // Layout effect: elements must be hidden before the first paint, otherwise
  // everything already in view flashes visible and then pops out and back in.
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const roots = Array.from(document.querySelectorAll(rootSelector))
    const root = roots[0]
    if (!root) return
    const isPage = root.classList.contains('page-slide-panel')

    const timers = new Set<number>()
    // When arriving via a page transition, the first reveals slide in
    // horizontally (from the direction of travel) instead of rising.
    let slideClass: string | null = null
    const startedAt = performance.now()
    const reveal = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      // The outgoing page panel is mounted just after this page, so check lazily.
      if (!slideClass && isPage && root.parentElement?.querySelector('.page-slide-out')) {
        slideClass = root.classList.contains('from-left') ? 'sr-from-left' : 'sr-from-right'
      }
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
    }
    const rootMargin = '0px 0px -6% 0px'
    const observer = new IntersectionObserver(e => reveal(e, observer), { threshold: 0.12, rootMargin })
    // Painted wrappers can be much taller than what's on screen, so they
    // reveal as soon as any part is in view.
    const boxObserver = new IntersectionObserver(e => reveal(e, boxObserver), { threshold: 0, rootMargin })

    const units: HTMLElement[] = []
    const boxes: HTMLElement[] = []
    for (const r of roots) {
      if (getComputedStyle(r).display === 'none') continue
      const t = collectTargets(r)
      units.push(...t.units)
      boxes.push(...t.boxes)
    }
    for (const el of units) {
      el.classList.add('sr')
      observer.observe(el)
    }
    for (const el of boxes) {
      el.classList.add('sr')
      boxObserver.observe(el)
    }

    return () => {
      observer.disconnect()
      boxObserver.disconnect()
      timers.forEach(t => window.clearTimeout(t))
      roots.flatMap(r => Array.from(r.querySelectorAll('.sr'))).forEach(el => {
        el.classList.remove('sr', 'sr-in', 'sr-from-left', 'sr-from-right')
        ;(el as HTMLElement).style.removeProperty('--sr-delay')
      })
    }
  }, [rootSelector, key])
}
