import { useCallback, useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'
import Home from './pages/Home'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Contact from './pages/Contact'
import './App.css'

export type Page = 'home' | 'services' | 'portfolio' | 'about' | 'contact'

const PAGE_ORDER: Page[] = ['home', 'about', 'portfolio', 'services', 'contact']
const SLIDE_DURATION = 420

function renderPage(p: Page, go: (p: Page) => void, goContactDesktop: () => void) {
  switch (p) {
    case 'home': return <Home go={go} goContactDesktop={goContactDesktop} />
    case 'services': return <Services go={go} />
    case 'portfolio': return <Portfolio go={go} goContactDesktop={goContactDesktop} />
    case 'about': return <About go={go} goContactDesktop={goContactDesktop} />
    case 'contact': return <Contact />
  }
}

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [prevPage, setPrevPage] = useState<Page | null>(null)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactScrollPending, setContactScrollPending] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  const slideTimeout = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(slideTimeout.current), [])

  // Kicks off the slide bookkeeping. `directionKey` is looked up in PAGE_ORDER
  // to decide which way the pages should slide — it's usually the page being
  // navigated to, but goContactDesktop passes 'contact' even though it lands
  // on 'home', so it slides in from the right like the rightmost nav item.
  const beginSlide = useCallback((directionKey: Page) => {
    const dir = PAGE_ORDER.indexOf(directionKey) > PAGE_ORDER.indexOf(page) ? 1 : -1
    setDirection(dir)
    setPrevPage(page)
    window.clearTimeout(slideTimeout.current)
    slideTimeout.current = window.setTimeout(() => setPrevPage(null), SLIDE_DURATION)
  }, [page])

  const go = useCallback((p: Page) => {
    if (p !== page) beginSlide(p)
    setPage(p)
    setMenuOpen(false)
    requestAnimationFrame(() => {
      if (mainRef.current) mainRef.current.scrollTop = 0
      window.scrollTo(0, 0)
    })
  }, [page, beginSlide])

  // Desktop layout embeds the contact form on the home page instead of
  // routing to a dedicated page, so its "Contact" affordance scrolls there.
  const goContactDesktop = useCallback(() => {
    if (page !== 'home') beginSlide('contact')
    setPage('home')
    setContactScrollPending(true)
  }, [page, beginSlide])

  useEffect(() => {
    if (page !== 'home' || !contactScrollPending || prevPage) return
    const id = requestAnimationFrame(() => {
      document.getElementById('dsk-contact-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setContactScrollPending(false)
    })
    return () => cancelAnimationFrame(id)
  }, [page, contactScrollPending, prevPage])

  const toggleMenu = useCallback(() => setMenuOpen(o => !o), [])

  return (
    <div className="site-wrapper desktop-site" data-page={page}>
      <Nav page={page} go={go} goContactDesktop={goContactDesktop} menuOpen={menuOpen} toggleMenu={toggleMenu} />

      <main ref={mainRef} className="main-content">
        <div className="page-slide-track">
          {prevPage && (
            <div
              key={prevPage}
              className={`page-slide-panel page-slide-out ${direction === 1 ? 'to-left' : 'to-right'}`}
            >
              {renderPage(prevPage, go, goContactDesktop)}
            </div>
          )}
          <div
            key={page}
            className={`page-slide-panel page-slide-in ${direction === 1 ? 'from-right' : 'from-left'}`}
          >
            {renderPage(page, go, goContactDesktop)}
          </div>
        </div>
      </main>
    </div>
  )
}
