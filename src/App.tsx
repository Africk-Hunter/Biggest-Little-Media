import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Seo from './components/Seo'
import Home from './pages/Home'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Contact from './pages/Contact'
import './App.css'

export type Page = 'home' | 'services' | 'portfolio' | 'about' | 'contact'

const PAGE_ORDER: Page[] = ['home', 'about', 'portfolio', 'services', 'contact']
const SLIDE_DURATION = 420

export const PATH_TO_PAGE: Record<string, Page> = {
  '/': 'home',
  '/about': 'about',
  '/portfolio': 'portfolio',
  '/services': 'services',
  '/contact': 'contact',
}

export const PAGE_TO_PATH: Record<Page, string> = {
  home: '/',
  about: '/about',
  portfolio: '/portfolio',
  services: '/services',
  contact: '/contact',
}

function pageFromPath(pathname: string): Page | null {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return PATH_TO_PAGE[normalized] ?? null
}

function renderPage(p: Page, go: (p: Page) => void, goContactDesktop: () => void) {
  switch (p) {
    case 'home': return <Home go={go} goContactDesktop={goContactDesktop} />
    case 'services': return <Services go={go} goContactDesktop={goContactDesktop} />
    case 'portfolio': return <Portfolio go={go} goContactDesktop={goContactDesktop} />
    case 'about': return <About go={go} goContactDesktop={goContactDesktop} />
    case 'contact': return <Contact />
  }
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const page = pageFromPath(location.pathname) ?? 'home'
  const [prevPage, setPrevPage] = useState<Page | null>(null)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactScrollPending, setContactScrollPending] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  const slideTimeout = useRef<number | undefined>(undefined)
  const prevPageRef = useRef<Page>(page)
  // goContactDesktop lands on 'home' but wants the slide to look like it's
  // heading to 'contact' (the rightmost nav item) — this ref lets the
  // location-driven effect below override the direction just this once.
  const directionOverrideRef = useRef<Page | null>(null)

  useEffect(() => () => window.clearTimeout(slideTimeout.current), [])

  // Unknown paths fall back to rendering 'home' above; normalize the URL too.
  useEffect(() => {
    if (pageFromPath(location.pathname) === null) navigate('/', { replace: true })
  }, [location.pathname, navigate])

  useEffect(() => {
    const prev = prevPageRef.current
    prevPageRef.current = page
    if (prev === page) return

    const directionKey = directionOverrideRef.current ?? page
    directionOverrideRef.current = null
    const dir = PAGE_ORDER.indexOf(directionKey) > PAGE_ORDER.indexOf(prev) ? 1 : -1
    setDirection(dir)
    setPrevPage(prev)
    window.clearTimeout(slideTimeout.current)
    slideTimeout.current = window.setTimeout(() => setPrevPage(null), SLIDE_DURATION)
  }, [page])

  const go = useCallback((p: Page) => {
    navigate(PAGE_TO_PATH[p])
    setMenuOpen(false)
    requestAnimationFrame(() => {
      if (mainRef.current) mainRef.current.scrollTop = 0
      window.scrollTo(0, 0)
    })
  }, [navigate])

  // Desktop layout embeds the contact form on the home page instead of
  // routing to a dedicated page, so its "Contact" affordance scrolls there.
  const goContactDesktop = useCallback(() => {
    directionOverrideRef.current = 'contact'
    if (location.pathname !== '/') navigate('/')
    setContactScrollPending(true)
  }, [navigate, location.pathname])

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
      <Seo page={page} />
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

      <Footer />
    </div>
  )
}
