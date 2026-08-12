import QRCode from 'qrcode';
import { drawBarcode } from './code128';

export const CARD_W = 1000;
export const CARD_H = 1500;

const CREAM = '#F4F0E6';
const PANEL = '#ECE7DB';
const GREEN = '#0B3B2B';
const LABEL = '#4B6B5D';
const RED = '#E11D48';
const GOLD = '#F5C518';

const PHOTO = { cx: 500, cy: 620, r: 210 };

const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

const centred = (ctx, text, x, y, font, color) => {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
  ctx.restore();
};

/** Vertical rail text down the left and right margins. */
const railText = (ctx, text, x, y, turn) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(turn);
  ctx.font = 'bold 26px monospace';
  ctx.fillStyle = LABEL;
  ctx.textAlign = 'center';
  ctx.fillText(text, 0, 0);
  ctx.restore();
};

function photoCircle(ctx, image, zoom, offset) {
  const { cx, cy, r } = PHOTO;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = PANEL;
  ctx.fill();

  if (image) {
    ctx.clip();
    // Cover the circle without distorting, then apply zoom and pan.
    const cover = Math.max((r * 2) / image.width, (r * 2) / image.height) * zoom;
    const dw = image.width * cover;
    const dh = image.height * cover;
    const limitX = Math.max(0, (dw - r * 2) / 2);
    const limitY = Math.max(0, (dh - r * 2) / 2);
    const dx = Math.min(limitX, Math.max(-limitX, offset.x));
    const dy = Math.min(limitY, Math.max(-limitY, offset.y));
    ctx.drawImage(image, cx - dw / 2 + dx, cy - dh / 2 + dy, dw, dh);
  } else {
    ctx.fillStyle = LABEL;
    ctx.font = 'bold 26px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[ UPLOAD PHOTO ]', cx, cy);
  }
  ctx.restore();

  // Beaded ring, echoing the stitched border on the reference badge.
  ctx.save();
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = RED;
  for (let i = 0; i < 44; i++) {
    const a = (i / 44) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * (r + 24), cy + Math.sin(a) * (r + 24), 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function qrBlock(ctx, url, x, y, size) {
  const qr = QRCode.create(url, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size;
  const cell = size / (n + 4); // 2-module quiet zone each side
  const origin = 2 * cell;

  ctx.save();
  ctx.fillStyle = CREAM;
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = GREEN;
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (qr.modules.data[row * n + col]) {
        ctx.fillRect(x + origin + col * cell, y + origin + row * cell, cell + 0.5, cell + 0.5);
      }
    }
  }
  ctx.restore();
}

function column(ctx, label, value, x, y, width, accent) {
  centred(ctx, label, x + width / 2, y, 'bold 20px monospace', LABEL);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = accent;
  ctx.font = '900 26px sans-serif';
  // Wrap onto a second line so long titles never collide with their neighbours.
  const words = value.split(' ');
  const lines = words.length > 1 ? [words[0], words.slice(1).join(' ')] : [value];
  lines.forEach((line, i) => ctx.fillText(line, x + width / 2, y + 46 + i * 32));
  ctx.restore();
}

export function drawCard(ctx, { image, zoom, offset, text, meta, shareUrl }) {
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  ctx.strokeStyle = 'rgba(11, 59, 43, 0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < CARD_W; x += 30) { ctx.moveTo(x, 0); ctx.lineTo(x, CARD_H); }
  for (let y = 0; y < CARD_H; y += 30) { ctx.moveTo(0, y); ctx.lineTo(CARD_W, y); }
  ctx.stroke();

  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 10;
  roundRect(ctx, 26, 26, CARD_W - 52, CARD_H - 52, 44);
  ctx.stroke();
  ctx.lineWidth = 3;
  roundRect(ctx, 48, 48, CARD_W - 96, CARD_H - 96, 32);
  ctx.stroke();

  railText(ctx, '28 – 31 OCT 2026', 84, 620, -Math.PI / 2);
  railText(ctx, 'GOA, INDIA', CARD_W - 84, 620, Math.PI / 2);

  // Top badge
  ctx.fillStyle = RED;
  roundRect(ctx, 400, 26, 200, 168, 26);
  ctx.fill();
  centred(ctx, '🌴', 500, 84, '38px sans-serif', GOLD);
  centred(ctx, 'HH', 500, 128, '900 40px monospace', CREAM);
  centred(ctx, 'GOA', 500, 160, '900 30px monospace', GOLD);
  centred(ctx, '2026', 500, 186, 'bold 22px monospace', CREAM);

  centred(ctx, 'HACKER', 268, 300, '900 62px sans-serif', GREEN);
  centred(ctx, 'गोवा', 500, 302, '900 58px sans-serif', RED);
  centred(ctx, 'HOUSE', 736, 300, '900 62px sans-serif', GREEN);

  centred(ctx, 'BUILD IN GOA  •  SHIP FROM PARADISE', 500, 344, 'bold 20px monospace', LABEL);

  photoCircle(ctx, image, zoom, offset);

  // Name plate
  ctx.fillStyle = GREEN;
  roundRect(ctx, 120, 892, 760, 92, 22);
  ctx.fill();
  centred(ctx, text.name, 500, 952, '900 46px sans-serif', CREAM);

  // Role banner
  ctx.fillStyle = GOLD;
  roundRect(ctx, 190, 1002, 620, 66, 18);
  ctx.fill();
  centred(ctx, `⚡  ${text.role}  ⚡`, 500, 1046, '900 28px monospace', GREEN);

  // Derived columns
  ctx.strokeStyle = 'rgba(11, 59, 43, 0.18)';
  ctx.lineWidth = 2;
  [340, 660].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, 1104);
    ctx.lineTo(x, 1206);
    ctx.stroke();
  });

  column(ctx, 'BUILDER CLASS', meta.cls, 80, 1134, 260, RED);
  column(ctx, 'FROM', text.from, 340, 1134, 320, GREEN);
  column(ctx, 'SQUAD', text.team, 660, 1134, 260, GREEN);

  // QR + ID + barcode. The inner border ends at y=1452, so everything here has
  // to finish above ~1440 or it gets clipped by the frame.
  qrBlock(ctx, shareUrl, 92, 1236, 150);
  centred(ctx, 'SCAN ME', 167, 1416, 'bold 18px monospace', LABEL);

  ctx.fillStyle = PANEL;
  roundRect(ctx, 290, 1236, 620, 150, 18);
  ctx.fill();
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 3;
  roundRect(ctx, 290, 1236, 620, 150, 18);
  ctx.stroke();

  centred(ctx, 'BUILDER ID', 600, 1268, 'bold 18px monospace', LABEL);
  drawBarcode(ctx, meta.code, 320, 1282, 560, 58, GREEN);
  centred(ctx, `#${meta.id}`, 600, 1372, 'bold 24px monospace', GREEN);

  centred(ctx, '#FRAMEINGOA', 600, 1418, '900 24px monospace', RED);
}
