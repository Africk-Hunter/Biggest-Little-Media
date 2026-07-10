import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import AdminErrorBoundary from './admin/ErrorBoundary'

// Lazy-loaded so public-site visitors never download the admin bundle
// (Firebase Auth SDK, upload/library/reorder UI) — only whoever navigates
// to /admin pays for it.
const AdminApp = lazy(() => import('./admin/AdminApp'))

// The public marketing site owns its own internal page-switching (see
// App.tsx's `Page` state) and isn't on react-router — it's mounted as a
// single catch-all route. Only the admin panel needs real URLs, since it has
// to survive a refresh and be a bookmarkable, auth-gated link.
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <AdminErrorBoundary>
              <Suspense fallback={null}>
                <AdminApp />
              </Suspense>
            </AdminErrorBoundary>
          }
        />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  )
}
