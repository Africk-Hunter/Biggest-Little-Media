const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export interface UploadedVideo {
  key: string // Cloudinary public_id — kept for reference/manual cleanup in the Cloudinary dashboard
  url: string
  posterUrl: string
}

// Cloudinary's unsigned upload API lets the browser upload directly with no
// backend — auth is enforced by our own admin UI requiring a Firebase login
// to reach this form, not by Cloudinary itself. The upload preset name ships
// in the client bundle, so it's not a secret; the preset is configured
// (Cloudinary dashboard) with a max file size and folder restriction as a
// backstop. See docs/SETUP.md for the tradeoff and the preset config.
export async function uploadVideo(file: File, videoId: string): Promise<UploadedVideo> {
  const publicId = `videos/${videoId}`

  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)
  form.append('public_id', publicId)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error(`Upload failed (${res.status}): ${await res.text()}`)

  const data = (await res.json()) as { public_id: string; secure_url: string }
  return {
    key: data.public_id,
    url: data.secure_url,
    posterUrl: posterUrlFor(data.public_id),
  }
}

// Cloudinary generates video thumbnails on the fly — `so_0` grabs a frame at
// the start of the clip, `.jpg` requests it as a still image. No separate
// poster upload needed.
function posterUrlFor(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_0/${publicId}.jpg`
}
