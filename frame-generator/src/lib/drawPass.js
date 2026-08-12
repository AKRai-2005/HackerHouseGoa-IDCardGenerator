export const PASS_W = 1200;
export const PASS_H = 800;

const CREAM_BG = '#F4F0E6';
const CARD_BG = '#ECE7DB';
const DARK_GREEN = '#0B3B2B';
const LABEL_GREEN = '#4B6B5D';
const ACCENT_RED = '#E11D48';

const PHOTO = { x: 710, y: 175, w: 440, h: 480, pad: 6 };

const orPlaceholder = (value, fallback) =>
  value?.trim() ? value.toUpperCase() : fallback;

/** The settled text for a pass — what an export must always contain. */
export const passText = (form = {}) => ({
  name: orPlaceholder(form.name, 'YOUR NAME HERE'),
  role: orPlaceholder(form.role, 'BUILDER / DEVELOPER'),
  from: orPlaceholder(form.from, 'PARADISE CITY'),
  team: orPlaceholder(form.team, 'SOLO BUILDER'),
});

/**
 * Scales the photo to cover the frame without distorting it, then applies zoom
 * and the user's pan. Panning is clamped to whatever actually overflows, so a
 * photo can never be dragged away from the frame.
 */
export function photoRect(image, zoom, offset) {
  const w = PHOTO.w - PHOTO.pad * 2;
  const h = PHOTO.h - PHOTO.pad * 2;
  const cover = Math.max(w / image.width, h / image.height) * zoom;
  const dw = image.width * cover;
  const dh = image.height * cover;

  const limitX = Math.max(0, (dw - w) / 2);
  const limitY = Math.max(0, (dh - h) / 2);
  const dx = Math.min(limitX, Math.max(-limitX, offset.x));
  const dy = Math.min(limitY, Math.max(-limitY, offset.y));

  return {
    dw,
    dh,
    x: PHOTO.x + PHOTO.w / 2 - dw / 2 + dx,
    y: PHOTO.y + PHOTO.h / 2 - dh / 2 + dy,
    limitX,
    limitY,
  };
}

function pressuredText(ctx, text, x, y, font, color, tracking = 0, scaleY = 1) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.translate(x, y);
  ctx.scale(1, scaleY);

  let cursor = 0;
  for (const char of text) {
    ctx.fillText(char, cursor, 0);
    cursor += ctx.measureText(char).width + tracking;
  }
  ctx.restore();
}

function field(ctx, label, value, x, y, highlight = false) {
  ctx.fillStyle = LABEL_GREEN;
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(label, x, y);

  if (highlight) {
    pressuredText(ctx, value, x, y + 35, '900 32px sans-serif', DARK_GREEN, -0.5, 1.15);
  } else {
    pressuredText(ctx, value, x, y + 35, '900 24px sans-serif', DARK_GREEN, 0, 1.05);
  }
}

export function drawPass(ctx, { image, zoom, offset, text }) {
  ctx.fillStyle = CREAM_BG;
  ctx.fillRect(0, 0, PASS_W, PASS_H);

  ctx.strokeStyle = 'rgba(11, 59, 43, 0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < PASS_W; x += 30) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, PASS_H);
  }
  for (let y = 0; y < PASS_H; y += 30) {
    ctx.moveTo(0, y);
    ctx.lineTo(PASS_W, y);
  }
  ctx.stroke();

  ctx.strokeStyle = DARK_GREEN;
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 1160, 760);

  ctx.fillStyle = CARD_BG;
  ctx.fillRect(50, 50, 1100, 100);
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, 1100, 100);

  pressuredText(ctx, 'HACKER HOUSE GOA', 80, 95, '900 36px monospace', DARK_GREEN, -1, 1.1);

  ctx.fillStyle = LABEL_GREEN;
  ctx.font = 'bold 18px monospace';
  ctx.fillText('2026 • OFFICIAL BUILDER PASS', 80, 128);

  ctx.fillStyle = ACCENT_RED;
  ctx.fillRect(940, 70, 190, 60);
  ctx.fillStyle = CREAM_BG;
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('VERIFIED PASS', 1035, 95);
  ctx.font = 'bold 12px monospace';
  ctx.fillText('#FRAMEINGOA', 1035, 115);
  ctx.textAlign = 'left';

  field(ctx, 'PASSENGER NAME', text.name, 80, 210, true);
  field(ctx, 'ROLE / SPEC', text.role, 80, 310);
  field(ctx, 'FROM', text.from, 80, 410);
  field(ctx, 'SQUAD / TEAM', text.team, 380, 410);

  ctx.fillStyle = CREAM_BG;
  ctx.fillRect(80, 480, 570, 120);
  ctx.strokeStyle = DARK_GREEN;
  ctx.lineWidth = 2;
  ctx.strokeRect(80, 480, 570, 120);

  ctx.fillStyle = LABEL_GREEN;
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('DESTINATION', 100, 512);
  ctx.fillText('EVENT STATUS', 380, 512);

  pressuredText(ctx, 'GOA, INDIA 🌴', 100, 555, '900 28px sans-serif', DARK_GREEN, -0.5, 1.1);
  pressuredText(ctx, 'CONFIRMED ⚡', 380, 555, '900 28px sans-serif', ACCENT_RED, -0.5, 1.1);

  const { x: px, y: py, w: pw, h: ph, pad } = PHOTO;

  ctx.fillStyle = CARD_BG;
  ctx.fillRect(px, py, pw, ph);
  ctx.strokeStyle = DARK_GREEN;
  ctx.lineWidth = 3;
  ctx.strokeRect(px, py, pw, ph);

  const cs = 16;
  ctx.beginPath();
  ctx.moveTo(px, py + cs); ctx.lineTo(px, py); ctx.lineTo(px + cs, py);
  ctx.moveTo(px + pw - cs, py); ctx.lineTo(px + pw, py); ctx.lineTo(px + pw, py + cs);
  ctx.moveTo(px, py + ph - cs); ctx.lineTo(px, py + ph); ctx.lineTo(px + cs, py + ph);
  ctx.moveTo(px + pw - cs, py + ph); ctx.lineTo(px + pw, py + ph); ctx.lineTo(px + pw, py + ph - cs);
  ctx.stroke();

  if (image) {
    const r = photoRect(image, zoom, offset);

    ctx.save();
    ctx.beginPath();
    ctx.rect(px + pad, py + pad, pw - pad * 2, ph - pad * 2);
    ctx.clip();
    ctx.drawImage(image, r.x, r.y, r.dw, r.dh);
    ctx.restore();

    ctx.fillStyle = DARK_GREEN;
    ctx.beginPath();
    ctx.arc(px + pw - 55, py + ph - 55, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = CREAM_BG;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = CREAM_BG;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BUILDER', px + pw - 55, py + ph - 60);
    ctx.fillText('GOA 2026', px + pw - 55, py + ph - 42);
    ctx.textAlign = 'left';
  } else {
    ctx.fillStyle = LABEL_GREEN;
    ctx.textAlign = 'center';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('[ UPLOAD PHOTO ]', px + pw / 2, py + ph / 2 - 10);
    ctx.font = '14px monospace';
    ctx.fillText('JPG • PNG • HEIC • WEBP', px + pw / 2, py + ph / 2 + 20);
    ctx.textAlign = 'left';
  }

  ctx.fillStyle = CARD_BG;
  ctx.fillRect(50, 675, 1100, 75);
  ctx.strokeStyle = DARK_GREEN;
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 675, 1100, 75);

  ctx.fillStyle = DARK_GREEN;
  ctx.font = 'bold 18px monospace';
  ctx.fillText('💻 CODE  •  🌊 CHILL  •  🛵 RIDE  •  🎲 PLAY  •  🌴 REPEAT', 80, 720);

  let bar = 940;
  for (const w of [4, 2, 6, 2, 8, 3, 2, 5, 2, 7, 3, 2, 6, 2, 4, 8, 2, 5]) {
    ctx.fillRect(bar, 688, w, 48);
    bar += w + 3;
  }
}
