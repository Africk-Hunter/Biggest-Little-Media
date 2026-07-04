import { useCallback, useEffect, useState } from 'react'
import DesktopNav from './DesktopNav'
import DesktopHome from './DesktopHome'
import DesktopServices from './DesktopServices'
import DesktopPortfolio from './DesktopPortfolio'
import DesktopAbout from './DesktopAbout'
import './desktop-tokens.css'

export type DesktopPage = 'home' | 'services' | 'portfolio' | 'about'

export default function DesktopApp() {
  const [page, setPage] = useState<DesktopPage>('home')
  const [contactScrollPending, setContactScrollPending] = useState(false)

  const go = useCallback((p: DesktopPage) => {
    setPage(p)
    window.scrollTo(0, 0)
  }, [])

  const goContact = useCallback(() => {
    setPage('home')
    setContactScrollPending(true)
  }, [])

  useEffect(() => {
    if (page !== 'home' || !contactScrollPending) return
    const id = requestAnimationFrame(() => {
      document.getElementById('dsk-contact-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setContactScrollPending(false)
    })
    return () => cancelAnimationFrame(id)
  }, [page, contactScrollPending])

  return (
    <div className="desktop-site">
      <DesktopNav page={page} go={go} goContact={goContact} />
      <main>
        {page === 'home' && <DesktopHome go={go} goContact={goContact} />}
        {page === 'services' && <DesktopServices />}
        {page === 'portfolio' && <DesktopPortfolio goContact={goContact} />}
        {page === 'about' && <DesktopAbout goContact={goContact} goServices={() => go('services')} />}
      </main>
    </div>
  )
}
