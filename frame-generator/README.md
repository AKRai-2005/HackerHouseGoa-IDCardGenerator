# HH Goa 2026 — builder pass generator

Upload a photo, fill in a few fields, get a branded Hacker House Goa 2026
builder pass to download or post to X. No login, no signup, one pass through.

React 19 + Vite + Tailwind v4. The pass itself is drawn on a `<canvas>` at
1200×800, so what you download is a real image file.

## Run

```bash
npm install
npm run dev
```

The dev server proxies `/api`, `/s` and `/i` to the share service on `:3001`, so
start `../backend` too if you want to exercise Share to X.

## Layout

```
src/
├── App.jsx                  page state, download and share handlers
├── lib/
│   ├── drawPass.js          all canvas drawing + photo fit maths
│   ├── image.js             file -> ImageBitmap (HEIC, EXIF, validation)
│   └── share.js             upload, native attach, X intent URL
└── components/
    ├── LandingPage.jsx      landing
    ├── UploadSection.jsx    form, upload, actions
    ├── ShareModal.jsx       with / without ID card choice
    ├── CanvasPreview.jsx    live preview + drag to reposition
    ├── Navbar.jsx           builder nav
    ├── UploadNavbar.jsx     landing nav
    ├── DecryptedText.jsx    scramble-in text effect
    └── TextPressure.jsx     variable-font heading effect
```

Drawing lives in `lib/drawPass.js` rather than in the component so that exports
can repaint the canvas with settled text before reading it — the preview
animates values into place, and a download fired mid-animation would otherwise
capture scrambled characters.

## Photos

`accept` covers jpg, png, webp and HEIC. HEIC files are converted in the browser
via `heic2any`, which is dynamically imported so the 1.3 MB decoder is only
downloaded by people who actually upload one. Photos are decoded once into an
`ImageBitmap` with EXIF orientation applied, then scaled to *cover* the frame —
aspect ratio is preserved regardless of what shape the photo is. Drag the
preview to reposition an off-centre subject; panning is clamped so the photo can
never be pulled away from its frame.

## Sharing

Share to X asks how you want to post:

- **Post with my ID card.** On phones that support it the pass is handed
  straight to the X app as a file, so it is attached to the tweet outright.
  Everywhere else the pass is uploaded and the tweet carries a link whose
  preview renders it.
- **Post without my ID card.** Caption and app link only. Nothing is uploaded
  and the photo never leaves the browser.

The link-preview route needs a **publicly reachable URL** — X fetches the page
to build the card, so `localhost` can never work. The dialog says so when it
detects a local origin.

## Configuration

`VITE_PUBLIC_URL` is used only for the landing page's OG image URL. Share links
build their own tags server-side. Copy `.env.example` to `.env`, and set it at
build time in production.
