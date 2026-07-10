import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase-auth'
import { useAuth } from './AuthContext'
import { useAllVideos } from '../hooks/useAllVideos'
import { PLACEMENTS } from '../lib/videos'
import UploadForm from './UploadForm'
import PlacementPanel from './PlacementPanel'
import VideoLibrary from './VideoLibrary'
import './admin.css'

export default function Dashboard() {
  const { user } = useAuth()
  const videos = useAllVideos()

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Biggest Little Media — Admin</h1>
        <div className="admin-header-right">
          <span>{user?.email}</span>
          <button type="button" onClick={() => signOut(auth)}>
            Sign out
          </button>
        </div>
      </header>

      <main className="admin-main">
        <UploadForm />

        {PLACEMENTS.map(placement => (
          <PlacementPanel key={placement} placement={placement} />
        ))}

        <section className="admin-library-section">
          <h2>All videos</h2>
          <VideoLibrary videos={videos} />
        </section>
      </main>
    </div>
  )
}
