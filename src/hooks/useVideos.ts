import { useEffect, useState } from 'react'
import { subscribeToPlacement, type Placement, type Video } from '../lib/videos'

// Live list of videos assigned to a placement, kept in sync with Firestore.
// Starts as `null` (loading) so callers can distinguish "still loading" from
// "loaded, but nobody has assigned a video here yet".
export function useVideos(placement: Placement): Video[] | null {
  const [videos, setVideos] = useState<Video[] | null>(null)

  useEffect(() => {
    setVideos(null)
    return subscribeToPlacement(placement, setVideos)
  }, [placement])

  return videos
}
