const CAPTION = (url) =>
  `I am officially on board for Hacker House Goa 2026! 🌴⚡\n\n` +
  `Build your own: ${url}\n\n` +
  `#FrameInGoa #HHGoa2026`;

export const tweetIntent = (url) =>
  `https://x.com/intent/tweet?text=${encodeURIComponent(CAPTION(url))}`;

export const toBlob = (canvas) =>
  new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Canvas is empty.'))),
      'image/jpeg',
      0.92
    )
  );

// X's crawler has to be able to fetch the share link for the card to render.
export const isLocalOrigin = () =>
  /^(localhost|127\.|0\.0\.0\.0|\[?::1)/.test(window.location.hostname) ||
  window.location.hostname.endsWith('.local');

/**
 * Uploads the rendered pass and returns a public URL whose OG tags show the
 * pass itself — X's intent API can't attach an image, so the link preview is
 * the only way to get the graphic into the tweet.
 */
export async function createShareLink(blob, formData) {
  const query = new URLSearchParams();
  if (formData.name?.trim()) query.set('name', formData.name.trim());
  if (formData.role?.trim()) query.set('role', formData.role.trim());

  const res = await fetch(`/api/passes?${query}`, {
    method: 'POST',
    headers: { 'Content-Type': 'image/jpeg' },
    body: blob,
  });
  if (!res.ok) throw new Error(`Share upload failed (${res.status})`);

  const { url } = await res.json();
  return url;
}
