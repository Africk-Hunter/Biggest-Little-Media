import { useState } from 'react'
import { useVideos } from '../hooks/useVideos'
import { reorderPlacement, PLACEMENT_LABELS, type Placement, type Video } from '../lib/videos'
import Carousel from '../components/Carousel'
import PortfolioGrid from '../components/PortfolioGrid'

interface Props {
  placement: Placement
}

function LivePreview({ placement }: { placement: Placement }) {
  if (placement === 'home-carousel') {
    return (
      <div className="admin-preview-frame admin-preview-dark">
        <Carousel variant="desktop" />
      </div>
    )
  }
  return (
    <div className="admin-preview-frame">
      <PortfolioGrid variant="desktop" />
    </div>
  )
}

export default function PlacementPanel({ placement }: Props) {
  const videos = useVideos(placement)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || !videos || dragIndex === targetIndex) return
    const reordered = [...videos]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(targetIndex, 0, moved)
    setDragIndex(null)
    reorderPlacement(placement, reordered)
  }

  return (
    <div className="admin-placement-panel">
      <h2>{PLACEMENT_LABELS[placement]}</h2>

      {videos === null ? (
        <p className="admin-empty">Loading…</p>
      ) : videos.length === 0 ? (
        <p className="admin-empty">
          No videos assigned yet. Check this placement's box next to a video in the library below.
        </p>
      ) : (
        <ul className="admin-reorder-list">
          {videos.map((video: Video, i: number) => (
            <li
              key={video.id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              className={dragIndex === i ? 'dragging' : ''}
            >
              <span className="admin-reorder-handle">⠿</span>
              <img src={video.posterUrl} alt="" />
              <span>{video.title}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="admin-preview-label">Live preview</p>
      <LivePreview placement={placement} />
    </div>
  )
}
