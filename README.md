# Biggest Little Media

Marketing and portfolio site for Biggest Little Media, a Reno-based video and brand studio. It includes a password-protected admin panel for managing portfolio videos.

## Tech stack

- React 18 + TypeScript, built with Vite
- React Router for routing
- Firebase Auth and Firestore for the admin panel and video metadata
- Cloudinary for video storage and hosting
- EmailJS for the contact form
- Deployed on Netlify

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Firebase, Cloudinary and EmailJS values
npm run dev
```

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Project structure

```
src/
  admin/       Admin panel (login, dashboard, upload, video placement)
  components/  Shared UI (Nav, Footer, Carousel, Seo, ...)
  hooks/       Data and viewport hooks
  lib/         Firebase, Cloudinary, SEO and upload helpers
  pages/       Home, Portfolio, Services, About, Contact
  utils/       Small helpers
docs/          Setup guide, admin panel PRD, email template
```

Account setup for the admin panel (Firebase, Cloudinary) is covered in [docs/SETUP.md](docs/SETUP.md).
