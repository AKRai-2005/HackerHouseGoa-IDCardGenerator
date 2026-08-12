import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { customAlphabet } from 'nanoid';
import { config } from './config.js';

// No lookalike characters — these ids get read off phone screens.
const newId = customAlphabet('23456789abcdefghijkmnpqrstuvwxyz', 10);

const ID_RE = /^[23456789abcdefghijkmnpqrstuvwxyz]{10}$/;
export const isValidId = (id) => ID_RE.test(id);

const file = (id, suffix) => path.join(config.dataDir, `${id}${suffix}`);

export const passPath = (id) => file(id, '.jpg');
export const ogPath = (id) => file(id, '.og.jpg');

export async function init() {
  await fs.mkdir(config.dataDir, { recursive: true });
}

/**
 * Re-encodes the upload rather than trusting it: this strips EXIF and any
 * non-image payload, and guarantees what we serve is a real JPEG.
 *
 * Two derivatives are written — the pass as generated, and a 1200x630 version
 * for the tweet card, since X centre-crops anything that isn't ~1.91:1 and
 * would otherwise slice the top and bottom off the pass.
 */
export async function savePass(buffer, meta) {
  const image = sharp(buffer, { limitInputPixels: 40e6 });
  const { width, height } = await image.metadata();
  if (!width || !height || width > 4000 || height > 4000) {
    throw Object.assign(new Error('Unsupported image dimensions'), { status: 400 });
  }

  const id = newId();

  await Promise.all([
    image.clone().jpeg({ quality: 92, progressive: true }).toFile(passPath(id)),

    image
      .clone()
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 244, g: 240, b: 230 },
      })
      .jpeg({ quality: 88, progressive: true })
      .toFile(ogPath(id)),

    fs.writeFile(
      file(id, '.json'),
      JSON.stringify({ ...meta, createdAt: Date.now() })
    ),
  ]);

  return id;
}

export async function readMeta(id) {
  try {
    return JSON.parse(await fs.readFile(file(id, '.json'), 'utf8'));
  } catch {
    return null;
  }
}

/** Drops passes past their TTL so the disk can't grow without bound. */
export async function sweep() {
  const cutoff = Date.now() - config.ttlMs;
  let removed = 0;

  for (const entry of await fs.readdir(config.dataDir)) {
    const full = path.join(config.dataDir, entry);
    const stat = await fs.stat(full).catch(() => null);
    if (stat && stat.mtimeMs < cutoff) {
      await fs.unlink(full).catch(() => {});
      removed++;
    }
  }
  return removed;
}
