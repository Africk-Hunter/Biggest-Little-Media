import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <>
      {/* ── Mobile / tablet footer (<1024px) ── */}
      <footer className="footer">
        <p className="footer-text">Copyright © {year} Biggest Little Media - All Rights Reserved.</p>
        <p className="footer-text">
          Designed &amp; Developed by Hunter Africk |{' '}
          <a href="https://hunterafrick.com/" target="_blank" rel="noreferrer">hunterafrick.com</a>
        </p>
      </footer>

      {/* ── Desktop footer (>=1024px) ── */}
      <footer className="dfooter">
        <p className="dfooter-text">Copyright © {year} Biggest Little Media - All Rights Reserved.</p>
        <p className="dfooter-text">
          Designed &amp; Developed by Hunter Africk |{' '}
          <a href="https://hunterafrick.com/" target="_blank" rel="noreferrer">hunterafrick.com</a>
        </p>
      </footer>
    </>
  )
}
