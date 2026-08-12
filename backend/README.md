# HH Goa 2026 — share service

Small Express service behind the builder pass generator. It exists for one
reason: **X's tweet intent API cannot attach an image.** The only way to get the
generated pass into a tweet is to share a link whose OG tags point at it, so
this stores each generated pass and serves a page carrying those tags.

In production it also serves the built frontend, so the whole thing lives behind
a single URL.

## Run

```bash
npm install
npm start
```

Listens on `:3001`. In development the Vite dev server proxies `/api`, `/s` and
`/i` here, so `npm run dev` in `../frame-generator` is all you need.

## API

| Route | Purpose |
| --- | --- |
| `POST /api/passes` | Body is the raw JPEG, `?name=` and `?role=` optional. Returns `{ id, url }`. |
| `GET /s/:id` | Share page — carries the OG/Twitter tags the crawler reads. |
| `GET /i/:id.jpg` | The pass as generated (1200×800). |
| `GET /i/:id-card.jpg` | 1200×630 variant used as the OG image. |
| `GET /healthz` | Health check. |

### Why two images

X centre-crops `summary_large_image` cards to roughly 1.91:1. Feeding it the
1200×800 pass would slice the header and footer off. `-card.jpg` letterboxes the
whole pass onto a 1200×630 cream background so the preview shows all of it.

## Configuration

Copy `.env.example` to `.env`. Everything has a working default except
`PUBLIC_URL`, which should be set in production so OG image URLs are absolute.

| Variable | Default | Notes |
| --- | --- | --- |
| `PORT` | `3001` | Injected by most hosts. |
| `PUBLIC_URL` | derived from request | e.g. `https://your-app.onrender.com`. |
| `DATA_DIR` | `./data` | Point at a mounted volume to survive restarts. |
| `FRONTEND_DIST` | `../frame-generator/dist` | Skipped if missing. |
| `SHARE_TTL_DAYS` | `30` | Expired passes are swept hourly. |
| `MAX_UPLOAD_BYTES` | `8388608` | 8 MB. |

## Deploying

Build the frontend first, then start this:

```bash
cd ../frame-generator && npm ci && npm run build
cd ../backend && npm ci && npm start
```

On Render: build command `cd frame-generator && npm ci && npm run build && cd ../backend && npm ci`,
start command `cd backend && npm start`. Set `PUBLIC_URL` to the service URL, and
attach a disk mounted at `/data` with `DATA_DIR=/data` so share links outlive
deploys — without one, the filesystem is ephemeral and old links 404.

## Notes on handling uploads

Uploads are re-encoded through sharp rather than stored as received. That strips
EXIF and any non-image payload, and guarantees what gets served is a real JPEG.
Requests are capped at 8 MB and rate limited to 12 per minute per IP. Names and
roles are HTML-escaped before they reach the share page.
