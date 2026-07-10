import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import RequireAuth from './RequireAuth'
import LoginPage from './LoginPage'

// Lazy so visiting /admin/login never evaluates Dashboard's module graph
// (which touches Firebase Storage) — that only needs to work once someone's
// actually signed in.
const Dashboard = lazy(() => import('./Dashboard'))

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          path="*"
          element={
            <RequireAuth>
              <Suspense fallback={<div className="admin-loading">Loading…</div>}>
                <Dashboard />
              </Suspense>
            </RequireAuth>
          }
        />
      </Routes>
    </AuthProvider>
  )
}
