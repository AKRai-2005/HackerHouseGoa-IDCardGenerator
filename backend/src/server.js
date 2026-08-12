import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { config, originOf } from './config.js';
import { init, savePass, readMeta, sweep, passPath, ogPath, isValidId } from './store.js';
import { sharePage } from './sharePage.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // Render/Railway terminate TLS in front of us.

const IMAGE_FILE = /^([23456789abcdefghijkmnpqrstuvwxyz]{10})(-card)?\.jpg$/;
const trim = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.post(
  '/api/passes',
  rateLimit({ windowMs: 60_000, limit: 12, standardHeaders: 'draft-7', legacyHeaders: false }),
  express.raw({ type: 'image/jpeg', limit: config.maxUploadBytes }),
  async (req, res, next) => {
    try {
      // A JPEG always starts FF D8 FF; sharp re-encodes after this anyway.
      if (!Buffer.isBuffer(req.body) || req.body.length < 3 || req.body[0] !== 0xff || req.body[1] !== 0xd8) {
        return res.status(400).json({ error: 'Expected a JPEG body' });
      }

      const id = await savePass(req.body, {
        name: trim(req.query.name, 60),
        role: trim(req.query.role, 60),
      });

      res.status(201).json({ id, url: `${originOf(req)}/s/${id}` });
    } catch (err) {
      next(err);
    }
  }
);

app.get('/i/:file', (req, res) => {
  const match = IMAGE_FILE.exec(req.params.file);
  if (!match) return res.status(404).end();

  const [, id, card] = match;
  const file = card ? ogPath(id) : passPath(id);
  if (!fs.existsSync(file)) return res.status(404).end();

  res.type('image/jpeg');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.sendFile(file);
});

app.get('/s/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id) || !fs.existsSync(passPath(id))) {
    return res
      .status(404)
      .type('html')
      .send('<meta charset="utf-8"><p>That pass has expired. <a href="/">Create a new one</a></p>');
  }

  const meta = (await readMeta(id)) || {};
  res.type('html');
  res.setHeader('Cache-Control', 'public, max-age=600');
  res.send(sharePage({ id, origin: originOf(req), name: meta.name, role: meta.role }));
});

// Serving the built frontend from here keeps the whole thing behind one URL,
// which is also the one link that gets submitted.
if (fs.existsSync(config.frontendDist)) {
  app.use(express.static(config.frontendDist, { maxAge: '1y', index: false }));
  app.get(/^(?!\/api\/).*/, (_req, res) =>
    res.sendFile(path.join(config.frontendDist, 'index.html'))
  );
}

app.use((err, _req, res, _next) => {
  const status = err.status || (err.type === 'entity.too.large' ? 413 : 500);
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status === 413 ? 'Image too large' : 'Could not create share link' });
});

await init();
sweep().then((n) => n && console.log(`swept ${n} expired files`));
setInterval(() => sweep().catch(console.error), config.sweepIntervalMs).unref();

app.listen(config.port, () => {
  console.log(`HH Goa share service on http://localhost:${config.port}`);
  console.log(`  frontend: ${fs.existsSync(config.frontendDist) ? config.frontendDist : 'not built (dev mode: use vite)'}`);
});
