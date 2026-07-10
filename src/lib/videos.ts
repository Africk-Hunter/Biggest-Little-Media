import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'

// Slots on the public site a video can be assigned to. Add new entries here
// (and give the placement a home in a public page) to open up a new slot.
export const PLACEMENTS = ['home-carousel', 'portfolio-grid'] as const
export type Placement = (typeof PLACEMENTS)[number]

export const PLACEMENT_LABELS: Record<Placement, string> = {
  'home-carousel': 'Home — Social Content Carousel',
  'portfolio-grid': 'Portfolio — Featured Works Grid',
}

export interface Video {
  id: string
  title: string
  platform: string
  videoUrl: string
  videoKey: string // Cloudinary public_id
  posterUrl: string
  sourceUrl: string | null
  placements: Placement[]
  orderByPlacement: Partial<Record<Placement, number>>
  createdAt: number
  updatedAt: number
}

export type VideoInput = Omit<Video, 'id' | 'createdAt' | 'updatedAt'>

const videosCollection = collection(db, 'videos')

export function subscribeAllVideos(cb: (videos: Video[]) => void) {
  return onSnapshot(videosCollection, snapshot => {
    const videos = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Video))
    videos.sort((a, b) => b.createdAt - a.createdAt)
    cb(videos)
  })
}

export function subscribeToPlacement(placement: Placement, cb: (videos: Video[]) => void) {
  const q = query(videosCollection, where('placements', 'array-contains', placement))
  return onSnapshot(q, snapshot => {
    const videos = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Video))
    videos.sort((a, b) => (a.orderByPlacement[placement] ?? 0) - (b.orderByPlacement[placement] ?? 0))
    cb(videos)
  })
}

// Storage keys for a video's assets need its Firestore id up front (see
// UploadForm), so id generation is split from doc creation.
export function newVideoId(): string {
  return doc(videosCollection).id
}

export async function createVideo(id: string, input: VideoInput) {
  const now = Date.now()
  return setDoc(doc(db, 'videos', id), { ...input, createdAt: now, updatedAt: now })
}

export async function updateVideo(id: string, patch: Partial<VideoInput>) {
  return updateDoc(doc(db, 'videos', id), { ...patch, updatedAt: Date.now() })
}

export async function deleteVideoDoc(id: string) {
  return deleteDoc(doc(db, 'videos', id))
}

// Adds/removes a placement on a video, appending it to the end of that
// placement's order when adding.
export async function setPlacementEnabled(video: Video, placement: Placement, enabled: boolean, currentPlacementVideos: Video[]) {
  const placements = enabled
    ? [...new Set([...video.placements, placement])]
    : video.placements.filter(p => p !== placement)

  const orderByPlacement = { ...video.orderByPlacement }
  if (enabled) {
    const maxOrder = currentPlacementVideos.reduce((max, v) => Math.max(max, v.orderByPlacement[placement] ?? 0), -1)
    orderByPlacement[placement] = maxOrder + 1
  } else {
    delete orderByPlacement[placement]
  }

  return updateVideo(video.id, { placements, orderByPlacement })
}

// Persists a full reordering of a placement's video list (e.g. after a drag-and-drop move).
export async function reorderPlacement(placement: Placement, orderedVideos: Video[]) {
  const batch = writeBatch(db)
  orderedVideos.forEach((video, index) => {
    batch.update(doc(db, 'videos', video.id), {
      [`orderByPlacement.${placement}`]: index,
      updatedAt: Date.now(),
    })
  })
  return batch.commit()
}
