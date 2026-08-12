<div align="center">

# 🌴 Hacker House Goa 2026 — Builder Pass Generator

**Upload a photo. Get a branded HH Goa 2026 builder pass. Download it or post it to X.**

No login. No signup gate. Start to finish in one pass.

[**Live demo →**](https://YOUR-APP.onrender.com)

`React 19` · `Vite` · `Tailwind v4` · `Canvas` · `Node` · `Express` · `sharp`

</div>

---

## What it does

Pick a photo, fill in a few fields, and the app renders a 1200×800 event badge on
a `<canvas>` — an airline-boarding-pass take on an event ID, drawn entirely in
the browser so it appears as you type. Download it as a real PNG, or post it
straight to X.

## Features

- **Two formats** — a landscape boarding pass and a portrait builder ID card, switchable in one click
- **Scannable QR + barcode** — a real QR and a real Code 128 barcode, not decorative bars
- **Unique builder IDs** — `#HH-GOA-0000` derived from the name, so the same person always gets the same ID
- **Instant** — the pass renders live while you type; no loading screen, no round trip
- **Real photos welcome** — portrait, landscape, square or panoramic, all fitted without distortion
- **iPhone HEIC support** — converted in-browser, decoder loaded only when needed
- **Drag to reposition** — off-centre snaps get fixed without cropping first
- **Working X share** — the pass actually shows up in the tweet, not a blank thumbnail
- **Your choice** — post with your ID card, or without it (nothing is uploaded)
- **Mobile-first** — built for the phone, which is where most people will use it
- **No account, ever** — no login wall, no signup gate

## How the X share works

X's tweet intent API **cannot attach an image**, so the pass reaches the tweet as
a link preview: the graphic is uploaded, and the tweet carries a short link whose
Open Graph tags point at it, making the preview card *the pass itself*.

This keeps sharing to a single hop — clicking the option opens X directly, with
no operating-system share sheet asking which app to use in between.

The card is rendered as a separate 1200×630 letterboxed image, because X
centre-crops `summary_large_image` previews and would otherwise slice the top and
bottom off the pass.

> The link-preview route needs a publicly reachable URL — X fetches the page with
> its own crawler, so `localhost` can never produce a card.

## Project structure

```
.
├── frame-generator/     React + Vite frontend — the generator itself
│   └── src/
│       ├── lib/
│       │   ├── drawPass.js   landscape boarding pass
│       │   ├── drawCard.js   portrait ID card (QR + barcode)
│       │   ├── code128.js    Code 128 barcode encoder
│       │   ├── builderId.js  derived builder ID and class
│       │   ├── formats.js    format registry
│       │   ├── image.js      file -> ImageBitmap (HEIC, EXIF)
│       │   └── share.js      upload + X intent
│       └── components/  UI
└── backend/             Express service for share links + OG previews
    └── src/
        ├── server.js    routes
        ├── store.js     pass storage + image derivatives
        └── sharePage.js the OG-tagged page X reads
```

## Running locally

```bash
npm run install:all
```

Then in two terminals:

```bash
npm run dev:web      # frontend on :5173
```

```bash
npm run dev          # share service on :3001
```

The frontend proxies `/api`, `/s` and `/i` to the backend, so both halves work
together in development.

To run it the way production does — one server, one URL:

```bash
npm run build && npm start
```

## Deploying

Push to GitHub and connect the repo to [Render](https://render.com) — the
included [`render.yaml`](render.yaml) configures the build and start commands
automatically, and the service detects its own public URL, so no environment
variables are required to get share cards working.

Full details, including how to make share links permanent, are in
[`backend/README.md`](backend/README.md).

## Notes

- Uploads are re-encoded server-side, which strips EXIF and any non-image payload
- Requests are size-capped and rate-limited; user text is escaped before it reaches the share page
- Stored passes expire after 30 days and are swept hourly

Built for the Hacker House Goa 2026 shortlisting task. **#FrameInGoa**
