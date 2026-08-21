#!/usr/bin/env node
/**
 * Serve the split design frames so a frame can be measured in a browser the
 * same way the running app is.
 *
 * `GET /f/<bundle>/<frameFile>` wraps one split frame in a standalone page:
 * the canvas's own <helmet> styles, a <base> pointing at the bundle's project
 * folder so `laurel-mark.webp` and `noise.png` resolve, and the frame pinned at
 * 0,0 so `getBoundingClientRect()` reports canvas coordinates directly.
 *
 * `GET /i/<bundle>` lists a bundle's frames.
 *
 * Usage: node scripts/uifinal1/serve.mjs [port]
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.argv[2] ?? 8097);
const ROOT = process.cwd();
const SPLIT = path.join(ROOT, '.uifinal1', 'final');
const PROJECT = 'UI Final 1/project';

const TYPES = { '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json', '.js': 'text/javascript', '.html': 'text/html', '.txt': 'text/plain' };

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
    try {
      if (url.startsWith('/f/')) {
        const rest = url.slice(3);
        const i = rest.indexOf('/');
        const bundle = rest.slice(0, i);
        const file = rest.slice(i + 1);
        const frame = fs.readFileSync(path.join(SPLIT, bundle, file), 'utf8');
        const helmetPath = path.join(SPLIT, bundle, '_helmet.html');
        const helmet = fs.existsSync(helmetPath) ? fs.readFileSync(helmetPath, 'utf8') : '';
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        res.end(`<!doctype html><html><head><meta charset="utf-8"><base href="/p/">${helmet}
<style>html,body{margin:0;padding:0;background:#fff}#frame{position:absolute;left:0;top:0}
#frame > [data-screen-label]{box-shadow:none !important;margin:0 !important}</style>
</head><body><div id="frame">${frame}</div></body></html>`);
        return;
      }
      if (url.startsWith('/p/')) {
        const p = path.join(ROOT, PROJECT, url.slice(3));
        res.writeHead(200, { 'content-type': TYPES[path.extname(p)] ?? 'application/octet-stream' });
        res.end(fs.readFileSync(p));
        return;
      }
      if (url.startsWith('/i/')) {
        const bundle = url.slice(3);
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(fs.readFileSync(path.join(SPLIT, bundle, '_index.json')));
        return;
      }
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(fs.readdirSync(SPLIT)));
    } catch (e) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end(String(e));
    }
  })
  .listen(PORT, () => console.log(`design frames on http://localhost:${PORT}`));
