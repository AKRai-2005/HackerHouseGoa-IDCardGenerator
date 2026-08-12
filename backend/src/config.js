import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const int = (value, fallback) => (Number.isFinite(+value) ? +value : fallback);

export const config = {
  port: int(process.env.PORT, 3001),

  // Render injects RENDER_EXTERNAL_URL, so share cards work even if PUBLIC_URL
  // is never set by hand. Falls back to per-request proxy headers.
  publicUrl: (process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || '')
    .replace(/\/$/, ''),

  dataDir: process.env.DATA_DIR || path.join(root, 'data'),
  frontendDist: process.env.FRONTEND_DIST || path.join(root, '..', 'frame-generator', 'dist'),

  maxUploadBytes: int(process.env.MAX_UPLOAD_BYTES, 8 * 1024 * 1024),
  ttlMs: int(process.env.SHARE_TTL_DAYS, 30) * 24 * 60 * 60 * 1000,
  sweepIntervalMs: 60 * 60 * 1000,
};

export const originOf = (req) =>
  config.publicUrl || `${req.protocol}://${req.get('host')}`;
