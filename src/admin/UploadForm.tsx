import { useRef, useState, type FormEvent } from 'react'
import { createVideo, newVideoId } from '../lib/videos'
import { uploadVideo } from '../lib/upload'

const MAX_VIDEO_BYTES = 100 * 1024 * 1024

export default function UploadForm() {
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState('TikTok')
  const [sourceUrl, setSourceUrl] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!videoFile) return
    if (videoFile.size > MAX_VIDEO_BYTES) {
      setError(`Video is too large (${Math.round(videoFile.size / 1024 / 1024)}MB). Max 100MB.`)
      return
    }

    setStatus('uploading')
    setError(null)
    const id = newVideoId()

    try {
      const video = await uploadVideo(videoFile, id)

      await createVideo(id, {
        title: title.trim() || 'Untitled clip',
        platform,
        sourceUrl: sourceUrl.trim() || null,
        videoUrl: video.url,
        videoKey: video.key,
        posterUrl: video.posterUrl,
        placements: [],
        orderByPlacement: {},
      })

      setStatus('idle')
      setTitle('')
      setSourceUrl('')
      setVideoFile(null)
      formRef.current?.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
  }

  return (
    <form ref={formRef} className="admin-upload-form" onSubmit={handleSubmit}>
      <h2>Upload a clip</h2>

      <label>
        Title
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Restaurant launch reel" />
      </label>

      <label>
        Platform
        <select value={platform} onChange={e => setPlatform(e.target.value)}>
          <option>TikTok</option>
          <option>Instagram Reels</option>
          <option>YouTube Shorts</option>
          <option>Other</option>
        </select>
      </label>

      <label>
        Original post URL (optional)
        <input
          type="url"
          value={sourceUrl}
          onChange={e => setSourceUrl(e.target.value)}
          placeholder="https://www.tiktok.com/@..."
        />
      </label>

      <label>
        Video file (.mp4/.mov, max 100MB)
        <input
          type="file"
          accept="video/mp4,video/quicktime,.mp4,.mov"
          required
          onChange={e => setVideoFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {error && <p className="admin-form-error">{error}</p>}

      <button type="submit" disabled={status === 'uploading' || !videoFile}>
        {status === 'uploading' ? 'Uploading…' : 'Upload'}
      </button>
    </form>
  )
}
