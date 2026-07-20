// Shared card widths (doubled for retina) for anywhere a video/poster is
// shown at roughly this size. Reusing the same width across placements
// (rather than each component picking its own) means Cloudinary only ever
// has to generate one derivative per size instead of one per caller — fewer
// distinct transformations, and no cold-start transcode delay the first
// time a new placement requests a size nobody's asked for yet.
export const MEDIA_WIDTH_MOBILE = 280
export const MEDIA_WIDTH_DESKTOP = 440

// Cloudinary applies delivery-time transforms from a path segment injected
// right after `/upload/` — no re-upload needed. Used to request media sized
// and compressed for where it's actually displayed instead of shipping the
// full source file to every card.
function transform(url: string, params: string): string {
  return url.includes('/upload/') ? url.replace('/upload/', `/upload/${params}/`) : url
}

// q_auto:eco over plain q_auto — these clips are muted, small, and
// autoplaying in the background (carousel/grid), so the extra compression
// is imperceptible at this size while meaningfully cutting bytes delivered.
export function optimizedVideoUrl(url: string, width: number): string {
  return transform(url, `f_auto,q_auto:eco,w_${width}`)
}

export function optimizedPosterUrl(url: string, width: number): string {
  return transform(url, `f_auto,q_auto:eco,w_${width}`)
}
