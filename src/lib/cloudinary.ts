// Cloudinary applies delivery-time transforms from a path segment injected
// right after `/upload/` — no re-upload needed. Used to request media sized
// and compressed for where it's actually displayed instead of shipping the
// full source file to every card.
function transform(url: string, params: string): string {
  return url.includes('/upload/') ? url.replace('/upload/', `/upload/${params}/`) : url
}

export function optimizedVideoUrl(url: string, width: number): string {
  return transform(url, `f_auto,q_auto,w_${width}`)
}

export function optimizedPosterUrl(url: string, width: number): string {
  return transform(url, `f_auto,q_auto,w_${width}`)
}
