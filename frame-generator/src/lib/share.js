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
 * True when the device can hand a real file to the X app. This attaches the
 * pass to the tweet directly, with no server and no link preview involved.
 */
export const canAttachFile = (file) =>
  Boolean(file && navigator.canShare?.({ files: [file] }));

/** Must be called straight from the click — iOS rejects a deferred share(). */
export const shareFile = (file) =>
  navigator.share({
    files: [file],
    text:
      `I am officially on board for Hacker House Goa 2026! 🌴⚡\n\n` +
      `#FrameInGoa #HHGoa2026`,
  });

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
