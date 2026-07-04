import { useState, useRef, useCallback } from 'react'
import Nav from './components/Nav'
import Home from './pages/Home'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Contact from './pages/Contact'
import DesktopApp from './desktop/DesktopApp'
import useIsDesktop from './hooks/useIsDesktop'
import './App.css'

export type Page = 'home' | 'services' | 'portfolio' | 'about' | 'contact'

export default function App() {
  const isDesktop = useIsDesktop()
  const [page, setPage] = useState<Page>('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)

  const go = useCallback((p: Page) => {
    setPage(p)
    setMenuOpen(false)
    requestAnimationFrame(() => {
      if (mainRef.current) mainRef.current.scrollTop = 0
      window.scrollTo(0, 0)
    })
  }, [])

  const toggleMenu = useCallback(() => setMenuOpen(o => !o), [])

  if (isDesktop) return <DesktopApp />

  return (
    <div className="site-wrapper" data-page={page}>
      <Nav page={page} go={go} menuOpen={menuOpen} toggleMenu={toggleMenu} />

      <main ref={mainRef} className="main-content">
        {page === 'home'      && <Home go={go} />}
        {page === 'services'  && <Services go={go} />}
        {page === 'portfolio' && <Portfolio go={go} />}
        {page === 'about'     && <About go={go} />}
        {page === 'contact'   && <Contact />}
      </main>
    </div>
  )
}
