# PRD: Video Admin Panel

Status: Draft v1 (storage decision revised twice, 2026-07-10 — see §5)
Owner: Biggest Little Media
Last updated: 2026-07-10

## 1. Problem

The public site currently shows fake placeholder video content (`Portfolio.tsx`'s `PLACEHOLDERS`/`CLIPS` arrays, `Carousel.tsx`'s CSS-only cards) — there is no real video anywhere on the site, and no way for Biggest Little Media (BLM) to add any without a code change and redeploy. BLM needs to upload their own TikTok clips and control which ones appear, and where, without touching code.

## 2. Goals

- BLM can log in to a private admin panel and upload video files (sourced from TikTok).
- BLM can choose which uploaded videos are shown on the public site, and in which placement(s) (e.g. Portfolio carousel, Home featured section).
- BLM can reorder/remove videos from a placement without redeploying.
- Admin panel shows a live preview of the actual public-facing component (Portfolio carousel, etc.) reflecting current selections before/as they go live.
- Videos autoplay (muted, looping, inline) as they scroll through the carousel — a real `<video>` element, not a social-platform embed.

## 3. Non-goals (v1)

- Public self-service signup for admin accounts (BLM's account(s) are created manually, not via a signup form).
- Video transcoding/compression pipeline (uploads are used as-is; BLM is responsible for exporting reasonably-sized files from TikTok/CapCut/etc. before upload).
- Draft/staging vs. published state — in v1, saving a change goes live immediately. (Flagged as a candidate Phase 2 feature below.)
- Multi-tenant / multi-client support — this is single-tenant for BLM only.

## 4. Users & Roles

- Single role: **Admin**. Every authenticated user has full read/write access to video management. No viewer/editor split in v1 — BLM is a small team, over-engineering permission tiers isn't warranted yet.
- Accounts are provisioned manually by whoever manages the Firebase project (via Firebase Console), not self-serve.

## 5. Architecture

| Concern | Choice | Why |
|---|---|---|
| Auth | Firebase Auth (email/password) | Already decided; free on Spark plan, no card required. |
| Video file storage | **Cloudinary (free plan, unsigned uploads)** — third choice, after Cloudflare R2 and Firebase Storage | R2 was dropped because Cloudflare requires a card on file to activate R2 even on the free tier (confirmed — [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)). Firebase Storage was dropped for the same reason (Blaze plan requires a card). BLM does not want to provide a card anywhere. Cloudinary's free plan requires no card ([confirmed](https://cloudinary.com/documentation/billing_and_plans)) and its unsigned upload API lets the browser upload directly with no custom backend — trading away server-side auth enforcement on the upload endpoint itself (see §6.3 and SETUP.md for the tradeoff). |
| Video metadata (title, placement, order, source URL, etc.) | Firestore (Spark/free tier) | Free quota (1GiB, 50k reads/day) is more than enough for a video list. |
| Client-side routing | **New dependency: react-router** | The site currently has *no* URL-based routing — `App.tsx` swaps pages via a `useState` union type. That means there is no bookmarkable, refresh-safe `/admin` URL today. This has to be added regardless of any other decision, so `/admin` survives a page refresh and can be auth-gated. |
| Video playback | Native `<video muted autoplay loop playsinline>` pointed at the Cloudinary delivery URL | Only way to get true scroll-driven autoplay without click-to-play friction; TikTok's own embed widget doesn't support this. |

### Data model (Firestore — collection `videos`)

```
videos/{videoId}
  title: string
  platform: string
  videoUrl: string             // Cloudinary secure_url for playback
  videoKey: string              // Cloudinary public_id (for manual cleanup reference)
  posterUrl: string             // Cloudinary-derived thumbnail (frame grab), auto-generated — no manual upload
  sourceUrl: string | null      // original TikTok post, for a "View on TikTok" attribution link
  placements: string[]          // e.g. ["home-carousel", "portfolio-grid"]
  orderByPlacement: { [placement]: number }  // per-placement position (see open question #2)
  createdAt: timestamp
  updatedAt: timestamp
```

### Storage layout (Cloudinary)

```
videos/{videoId}   (public_id; Cloudinary infers the extension/format)
```

Poster thumbnails aren't separately stored — they're generated on the fly from the video via Cloudinary's URL transformations (`so_0` = grab the frame at 0s) and cached as a plain URL on the doc.

## 6. Admin panel — features

1. **Login** — Firebase Auth email/password form at `/admin/login`. Unauthenticated visits to any `/admin/*` route redirect here.
2. **Video library** (`/admin/videos`) — grid/list of all uploaded videos with thumbnail, title, current placement(s), upload date. Actions: upload new, edit metadata, delete, assign/remove placement.
3. **Upload flow** — file picker (video only; poster is auto-generated) → client uploads directly to Cloudinary via its unsigned upload API → on success, create the Firestore doc. The admin UI is what's auth-gated here, not the Cloudinary endpoint itself (see §6.3 tradeoff below).
4. **Placement management** — per placement (e.g. "Portfolio Grid"), a reorderable list (native HTML5 drag-and-drop) of the videos currently assigned to it, pulled from the shared library. Adding a video to a placement doesn't duplicate the file — it just adds that placement string + order to the existing doc.
5. **Live preview** — the admin panel renders the *actual* `Carousel`/`PortfolioGrid` React components, fed with live Firestore data, right inside the admin UI, so BLM sees exactly what the public page will look like as they reorder/add/remove — not a mockup.
6. **Delete** — removes the Firestore doc (video disappears from the site immediately). Does **not** delete the Cloudinary file — unsigned uploads have no matching unsigned delete API; that's cleaned up manually in Cloudinary's Media Library if it ever matters. Flagged explicitly rather than silently accepted.

**On the upload-auth tradeoff:** Cloudinary's unsigned preset is not itself authenticated — anyone who extracts the preset name from the client bundle could POST to it directly, bypassing our admin login. The alternative (signed uploads) needs a backend to hold the API secret, which is exactly the complexity (Cloudflare Worker, then Firebase Cloud Functions) this PRD moved away from twice already to avoid a card requirement. For a low-traffic, single-tenant portfolio site this is an acceptable v1 risk — mitigated by a file-size cap on the preset and it being easy to regenerate a preset if abused — but it's a real gap, not a non-issue, and should be revisited if the site's profile changes (e.g. becomes high-traffic or the preset leaks in a way that draws abuse).

## 7. Public site changes

- `Portfolio.tsx` (via the extracted `PortfolioGrid` component) and `Carousel.tsx` stop using the hardcoded `PLACEHOLDERS`/`CLIPS` arrays and instead read from the `videos` Firestore collection, filtered by `placements` and sorted by `orderByPlacement[placement]`. Both fall back to the original placeholder rendering when a placement has no videos assigned yet.
- Public reads of `videos` are unauthenticated (Firestore security rules: public read, auth-only write).

## 8. Open questions / assumptions made to keep moving

These were defaulted to keep this PRD moving rather than re-opening the interview — flag any you want to revisit:

1. **Which placements exist in v1?** Implemented as `home-carousel` (Home.tsx's `Carousel`) and `portfolio-grid` (Portfolio.tsx's grid, now `PortfolioGrid`), based on those being the only places with video-shaped UI today. Confirm if Services/About should also get a video slot.
2. **Ordering mechanic** — a per-placement `orderByPlacement[placement]` number, set via drag-and-drop and persisted with a Firestore batch write. Fine as long as placements stay small (tens of videos); would need pagination/virtualization if the library grows large.
3. **File size/format limits** — enforced at 100MB / .mp4/.mov client-side (`UploadForm.tsx`); should also be set as a max-file-size restriction on the Cloudinary upload preset itself (see SETUP.md) since the client-side check alone is trivially bypassed. Confirm the 100MB number is right for typical TikTok export sizes.
4. ~~Direct-to-R2 upload requires a signing step~~ — superseded twice: R2 → Firebase Storage → Cloudinary. Resolved by using Cloudinary's unsigned upload API, which needs no backend at all — at the cost of the upload endpoint not being server-side auth-gated (see §6's tradeoff note). This is the one open item most worth a second look if the site's risk profile ever changes.
5. ~~Poster/thumbnail~~ — resolved: Cloudinary auto-generates a thumbnail from the video (frame grab at 0s), no manual upload needed.
6. **Draft vs. publish** — v1 assumes changes are live immediately on save. If BLM wants to stage a set of changes and "publish" them at once, that's a real Phase 2 feature (adds a `published: boolean` flag and a review step).

## 9. Phasing

**Phase 1 (this PRD):** Auth, upload, library management, placement assignment + ordering, live preview, public site reads from Firestore/Cloudinary.

**Phase 2 (candidate, not committed):** draft/publish staging, auto-thumbnail generation, multiple admin roles, analytics on video plays, video size/format validation with clearer error messaging.

## 10. Out of scope

- Comments, likes, or any social interaction features on the videos.
- Editing/trimming video content in-browser.
- Automatic import from TikTok (e.g. pulling a creator's feed via API) — every upload is a manual, deliberate action by BLM.
