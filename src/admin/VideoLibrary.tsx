import { useState } from 'react'
import { PLACEMENTS, PLACEMENT_LABELS, deleteVideoDoc, setPlacementEnabled, updateVideo, type Video } from '../lib/videos'

interface Props {
  videos: Video[]
}

export default function VideoLibrary({ videos }: Props) {
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  // Cloudinary's unsigned upload API (no backend, no card — see lib/upload.ts)
  // deliberately has no matching unsigned delete. This removes the video from
  // the site; the underlying file stays in Cloudinary until removed manually
  // from the Cloudinary Media Library.
  const handleDelete = async (video: Video) => {
    if (pendingDelete !== video.id) {
      setPendingDelete(video.id)
      return
    }
    setPendingDelete(null)
    await deleteVideoDoc(video.id)
  }

  const handleTogglePlacement = async (video: Video, placement: (typeof PLACEMENTS)[number]) => {
    const enabled = !video.placements.includes(placement)
    const placementVideos = videos.filter(v => v.placements.includes(placement))
    await setPlacementEnabled(video, placement, enabled, placementVideos)
  }

  if (videos.length === 0) {
    return <p className="admin-empty">No videos uploaded yet. Use the form above to add your first clip.</p>
  }

  return (
    <table className="admin-library-table">
      <thead>
        <tr>
          <th>Preview</th>
          <th>Title</th>
          <th>Platform</th>
          <th>Source URL</th>
          {PLACEMENTS.map(p => (
            <th key={p}>{PLACEMENT_LABELS[p]}</th>
          ))}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {videos.map(video => (
          <tr key={video.id}>
            <td>
              <img className="admin-library-thumb" src={video.posterUrl} alt="" />
            </td>
            <td>
              <input
                className="admin-inline-input"
                defaultValue={video.title}
                onBlur={e => {
                  if (e.target.value !== video.title) updateVideo(video.id, { title: e.target.value })
                }}
              />
            </td>
            <td>
              <select
                className="admin-inline-select"
                defaultValue={video.platform}
                onChange={e => updateVideo(video.id, { platform: e.target.value })}
              >
                <option>TikTok</option>
                <option>Instagram Reels</option>
                <option>YouTube Shorts</option>
                <option>Other</option>
              </select>
            </td>
            <td>
              <input
                className="admin-inline-input admin-inline-input-wide"
                type="url"
                placeholder="https://…"
                defaultValue={video.sourceUrl ?? ''}
                onBlur={e => {
                  const value = e.target.value.trim() || null
                  if (value !== video.sourceUrl) updateVideo(video.id, { sourceUrl: value })
                }}
              />
            </td>
            {PLACEMENTS.map(p => (
              <td key={p} className="admin-library-checkbox">
                <input
                  type="checkbox"
                  checked={video.placements.includes(p)}
                  onChange={() => handleTogglePlacement(video, p)}
                />
              </td>
            ))}
            <td>
              <button
                type="button"
                className={`admin-delete-btn ${pendingDelete === video.id ? 'confirm' : ''}`}
                onClick={() => handleDelete(video)}
                onBlur={() => setPendingDelete(null)}
                title="Removes it from the site. The file stays in Cloudinary until removed there manually."
              >
                {pendingDelete === video.id ? 'Confirm?' : 'Delete'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
