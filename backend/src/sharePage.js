const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (value = '') => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

/**
 * The page a tweeted link resolves to. Its whole job is to carry OG tags that
 * point at the generated pass, so the tweet preview shows the actual graphic
 * instead of a default thumbnail — X's intent API cannot attach an image.
 */
export function sharePage({ id, origin, name, role }) {
  const who = escape(name) || 'A builder';
  const title = `${who} is going to Hacker House Goa 2026`;
  const description = role
    ? `${escape(role)} · Build in Goa, ship from paradise. #FrameInGoa`
    : 'Build in Goa, ship from paradise. Make your own builder pass. #FrameInGoa';

  const pass = `${origin}/i/${id}.jpg`;
  const card = `${origin}/i/${id}-card.jpg`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<title>${title}</title>
<meta name="description" content="${description}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="Hacker House Goa 2026">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${origin}/s/${id}">
<meta property="og:image" content="${card}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${title}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${card}">
<meta name="twitter:image:alt" content="${title}">

<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;
justify-content:center;gap:24px;padding:24px;background:#FDFBF7;color:#0B3B2B;
font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace}
img{width:100%;max-width:760px;height:auto;border:2px solid #E5DEC9;border-radius:24px;
box-shadow:0 10px 30px rgba(11,59,43,.12);background:#F4F0E6}
a{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:16px;
background:#0B3B2B;color:#F5C518;font-weight:800;font-size:14px;text-decoration:none;
letter-spacing:.04em}
a:hover{background:#082B20}
p{margin:0;font-size:12px;font-weight:700;letter-spacing:.08em;color:#4B6B5D;text-align:center}
strong{color:#E11D48}
</style>
</head>
<body>
<img src="${pass}" alt="${title}" width="1200" height="800">
<a href="/">✦ CREATE YOUR OWN PASS</a>
<p>HACKER HOUSE GOA 2026 • <strong>#FRAMEINGOA</strong></p>
</body>
</html>`;
}
