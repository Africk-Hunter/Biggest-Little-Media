import { useEffect, useState } from 'react'
import { subscribeAllVideos, type Video } from '../lib/videos'

export function useAllVideos(): Video[] {
  const [videos, setVideos] = useState<Video[]>([])
  useEffect(() => subscribeAllVideos(setVideos), [])
  return videos
}
